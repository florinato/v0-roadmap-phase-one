# Modelos de Datos - EscolarApp API

## Descripción General

Este documento describe la estructura de datos completa para el backend de EscolarApp. La aplicación es un marketplace de compra/venta de artículos escolares entre estudiantes de un colegio.

---

## 1. User (Usuario)

Representa un estudiante o usuario de la plataforma.

```typescript
interface User {
  id: string;                    // UUID o ID único
  email: string;                 // Email único, validado
  password: string;              // Hash bcrypt (nunca guardar en plaintext)
  name: string;                  // Nombre completo (50 caracteres max)
  bio?: string;                  // Biografía opcional (150 caracteres max)
  avatarUrl?: string;            // URL de avatar en storage (Vercel Blob, S3, etc)
  phone?: string;                // Teléfono opcional
  
  // Estadísticas
  rating: number;                // 0-5 estrellas (promedio de reviews)
  reviewsCount: number;          // Total de reseñas recibidas
  productsSoldCount: number;     // Total de artículos vendidos
  productsBoughtCount: number;   // Total de artículos comprados
  
  // Metadata
  createdAt: Date;               // Fecha de registro
  updatedAt: Date;               // Última actualización
  lastActiveAt?: Date;           // Última actividad
  isVerified: boolean;           // Email verificado
  isActive: boolean;             // Cuenta activa (no baneada)
}

// Tabla: users
// Índices: 
//   - PRIMARY KEY (id)
//   - UNIQUE (email)
//   - INDEX (createdAt)
//   - INDEX (rating)
```

---

## 2. Product (Producto)

Representa un artículo en venta.

```typescript
type ProductState = 'active' | 'reserved' | 'sold' | 'deleted';
type ProductCondition = 'new' | 'like-new' | 'used' | 'fair';
type ProductCategory = 'books' | 'uniforms' | 'bags' | 'supplies' | 'tech' | 'other';

interface Product {
  id: string;                    // UUID o ID único
  sellerId: string;              // FK: User.id
  
  // Información básica
  title: string;                 // Título (60 caracteres max)
  description: string;           // Descripción (300 caracteres max)
  category: ProductCategory;     // Categoría del producto
  price: number;                 // Precio en euros (2 decimales: 19.99)
  condition: ProductCondition;   // Estado del artículo
  
  // Imágenes
  images: string[];              // Array de URLs (hasta 6 imágenes)
  
  // Estado
  state: ProductState;           // active, reserved, sold, deleted
  reservedBy?: string;           // FK: User.id (si está reservado)
  reservedAt?: Date;             // Cuándo se reservó
  soldTo?: string;               // FK: User.id (si está vendido)
  soldAt?: Date;                 // Cuándo se vendió
  
  // Metadata
  createdAt: Date;               // Fecha de publicación
  updatedAt: Date;               // Última actualización
  views: number;                 // Contador de visualizaciones
  interestsCount: number;        // Número de usuarios interesados (basado en conversaciones)
}

// Tabla: products
// Índices:
//   - PRIMARY KEY (id)
//   - FOREIGN KEY (sellerId) REFERENCES users(id)
//   - FOREIGN KEY (reservedBy) REFERENCES users(id)
//   - FOREIGN KEY (soldTo) REFERENCES users(id)
//   - INDEX (state)
//   - INDEX (category)
//   - INDEX (createdAt DESC) para feed ordenado
//   - INDEX (price) para filtros
```

---

## 3. Conversation (Conversación)

Representa un chat entre comprador y vendedor sobre un producto.

```typescript
interface Conversation {
  id: string;                    // UUID o ID único
  productId: string;             // FK: Product.id
  sellerId: string;              // FK: User.id (dueño del producto)
  buyerId: string;               // FK: User.id (interesado en comprar)
  
  // Metadata
  createdAt: Date;               // Cuándo se abrió el chat
  updatedAt: Date;               // Último mensaje
  lastMessageAt: Date;           // Timestamp del último mensaje
  
  // Estado
  isActive: boolean;             // True si la conversación está activa
  
  // Contadores
  messagesCount: number;         // Total de mensajes
  buyerUnreadCount: number;      // Mensajes sin leer para el comprador
  sellerUnreadCount: number;     // Mensajes sin leer para el vendedor
}

// Tabla: conversations
// Índices:
//   - PRIMARY KEY (id)
//   - FOREIGN KEY (productId) REFERENCES products(id)
//   - FOREIGN KEY (sellerId) REFERENCES users(id)
//   - FOREIGN KEY (buyerId) REFERENCES users(id)
//   - INDEX (lastMessageAt DESC) para ordenar bandeja de entrada
//   - UNIQUE (productId, buyerId) para evitar duplicados
```

---

## 4. Message (Mensaje)

Representa un mensaje individual en una conversación.

```typescript
type MessageType = 'text' | 'system'; // system = cambio de estado automático

interface Message {
  id: string;                    // UUID o ID único
  conversationId: string;        // FK: Conversation.id
  senderId: string;              // FK: User.id
  
  // Contenido
  content: string;               // Texto del mensaje (1000 caracteres max)
  type: MessageType;             // 'text' o 'system'
  
  // Metadata
  createdAt: Date;               // Cuándo se envió
  readAt?: Date;                 // Cuándo se leyó (null si no leído)
  
  // Flags
  isDeleted: boolean;            // Soft delete
}

// Tabla: messages
// Índices:
//   - PRIMARY KEY (id)
//   - FOREIGN KEY (conversationId) REFERENCES conversations(id)
//   - FOREIGN KEY (senderId) REFERENCES users(id)
//   - INDEX (conversationId, createdAt) para obtener historial
//   - INDEX (readAt) para contar no leídos
```

---

## 5. Review (Reseña)

Representa una valoración de un usuario sobre otro después de una transacción.

```typescript
interface Review {
  id: string;                    // UUID o ID único
  fromUserId: string;            // FK: User.id (quien hace la reseña)
  toUserId: string;              // FK: User.id (a quién se le hace)
  productId: string;             // FK: Product.id (producto referenciado)
  transactionId: string;         // FK: Transaction.id
  
  // Contenido
  rating: number;                // 1-5 estrellas
  comment: string;               // Comentario (150 caracteres max)
  
  // Metadata
  createdAt: Date;               // Fecha de la reseña
  updatedAt?: Date;              // Si se editó
  
  // Flags
  isVerified: boolean;           // true si es de una transacción completada
}

// Tabla: reviews
// Índices:
//   - PRIMARY KEY (id)
//   - FOREIGN KEY (fromUserId) REFERENCES users(id)
//   - FOREIGN KEY (toUserId) REFERENCES users(id)
//   - FOREIGN KEY (productId) REFERENCES products(id)
//   - FOREIGN KEY (transactionId) REFERENCES transactions(id)
//   - INDEX (toUserId, createdAt) para obtener reseñas de un usuario
//   - UNIQUE (fromUserId, transactionId) para evitar reseñas duplicadas
```

---

## 6. Transaction (Transacción)

Registro de una compra/venta completada.

```typescript
type TransactionType = 'buy' | 'sell';
type TransactionStatus = 'completed' | 'cancelled' | 'disputed';

interface Transaction {
  id: string;                    // UUID o ID único
  productId: string;             // FK: Product.id
  buyerId: string;               // FK: User.id
  sellerId: string;              // FK: User.id
  
  // Información
  amount: number;                // Precio final (en euros)
  type: TransactionType;         // 'buy' o 'sell'
  status: TransactionStatus;     // Estado de la transacción
  
  // Metadata
  createdAt: Date;               // Cuándo se completó
  updatedAt: Date;               // Última actualización
  completedAt: Date;             // Cuándo se finalizó
  
  // Notas
  notes?: string;                // Notas internas (200 caracteres max)
}

// Tabla: transactions
// Índices:
//   - PRIMARY KEY (id)
//   - FOREIGN KEY (productId) REFERENCES products(id)
//   - FOREIGN KEY (buyerId) REFERENCES users(id)
//   - FOREIGN KEY (sellerId) REFERENCES users(id)
//   - INDEX (buyerId, createdAt) para historial de compras
//   - INDEX (sellerId, createdAt) para historial de ventas
//   - INDEX (completedAt) para estadísticas
```

---

## 7. Notification (Notificación) - Opcional

Para sistema de notificaciones push.

```typescript
type NotificationType = 'new_message' | 'product_reserved' | 'product_sold' | 'review_received' | 'inquiry';

interface Notification {
  id: string;                    // UUID o ID único
  userId: string;                // FK: User.id (destinatario)
  
  // Contenido
  type: NotificationType;        // Tipo de notificación
  title: string;                 // Título (50 caracteres)
  message: string;               // Descripción (150 caracteres)
  
  // Relaciones
  relatedProductId?: string;     // FK: Product.id (opcional)
  relatedUserId?: string;        // FK: User.id (opcional)
  relatedConversationId?: string; // FK: Conversation.id (opcional)
  
  // Metadata
  createdAt: Date;               // Cuándo se generó
  readAt?: Date;                 // Cuándo se leyó
  
  // Flags
  isPushed: boolean;             // Si se envió push
}

// Tabla: notifications
// Índices:
//   - PRIMARY KEY (id)
//   - FOREIGN KEY (userId) REFERENCES users(id)
//   - INDEX (userId, readAt) para obtener notificaciones no leídas
//   - INDEX (createdAt DESC)
```

---

## 8. Report (Reporte) - Opcional

Para denunciar productos o usuarios abusivos.

```typescript
type ReportReason = 'inappropriate' | 'fraud' | 'offensive' | 'fake_product' | 'other';
type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

interface Report {
  id: string;                    // UUID o ID único
  reportedBy: string;            // FK: User.id
  reportedUserId?: string;       // FK: User.id (si es un usuario)
  reportedProductId?: string;    // FK: Product.id (si es un producto)
  
  // Contenido
  reason: ReportReason;          // Razón de la denuncia
  description: string;           // Descripción (300 caracteres)
  
  // Administración
  status: ReportStatus;          // Estado del reporte
  reviewedBy?: string;           // FK: User.id (admin que revisa)
  reviewedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Tabla: reports
// Índices:
//   - PRIMARY KEY (id)
//   - FOREIGN KEY (reportedBy) REFERENCES users(id)
//   - INDEX (status)
//   - INDEX (createdAt DESC)
```

---

## Relaciones Principales

```
User 
  ├─ 1:N → Product (vendedor)
  ├─ 1:N → Conversation (como vendedor)
  ├─ 1:N → Conversation (como comprador)
  ├─ 1:N → Message
  ├─ 1:N → Review (reviews recibidas)
  ├─ 1:N → Review (reviews dadas)
  └─ 1:N → Transaction

Product
  ├─ N:1 → User (vendedor)
  ├─ 1:N → Conversation
  ├─ 1:N → Message (indirecto)
  ├─ 0:1 → User (reservedBy)
  ├─ 0:1 → User (soldTo)
  └─ 1:N → Review

Conversation
  ├─ N:1 → Product
  ├─ N:1 → User (seller)
  ├─ N:1 → User (buyer)
  └─ 1:N → Message

Transaction
  ├─ N:1 → Product
  ├─ N:1 → User (buyer)
  ├─ N:1 → User (seller)
  └─ 1:N → Review
```

---

## Validaciones Comunes

### User
- Email: validar formato email único
- Password: mínimo 8 caracteres, sin hashear en requests
- Name: 2-50 caracteres, sin caracteres especiales peligrosos
- Bio: máximo 150 caracteres
- Rating: 0-5 (calculado, no editable)

### Product
- Title: 5-60 caracteres, requerido
- Description: 10-300 caracteres, requerido
- Price: > 0, máximo 2 decimales
- Images: mínimo 1, máximo 6, formatos permitidos: jpg, png, webp
- Category: debe ser una de las opciones del enum

### Message
- Content: 1-1000 caracteres, requerido
- No puede ser editado después de crear (solo soft delete)

### Review
- Rating: 1-5, requerido
- Comment: 0-150 caracteres, opcional
- Solo puede haber 1 review por transacción y dirección

---

## Endpoints Base Sugeridos

```
POST   /api/auth/signup               - Registrarse
POST   /api/auth/signin               - Iniciar sesión
POST   /api/auth/logout               - Cerrar sesión
GET    /api/auth/me                   - Obtener usuario actual

GET    /api/products                  - Listar productos
POST   /api/products                  - Crear producto (requiere auth)
GET    /api/products/:id              - Obtener producto
PUT    /api/products/:id              - Editar producto (solo owner)
DELETE /api/products/:id              - Eliminar producto (solo owner)

GET    /api/conversations             - Listar conversaciones (requiere auth)
POST   /api/conversations             - Crear conversación
GET    /api/conversations/:id         - Obtener conversación con mensajes
POST   /api/conversations/:id/messages - Enviar mensaje

POST   /api/products/:id/reserve      - Reservar producto
POST   /api/products/:id/mark-sold    - Marcar como vendido

GET    /api/users/:id                 - Obtener perfil de usuario
PUT    /api/users/:id                 - Editar perfil (solo owner)
GET    /api/users/:id/reviews         - Obtener reseñas de usuario
POST   /api/reviews                   - Crear reseña (solo tras compra)

GET    /api/transactions              - Historial de transacciones (requiere auth)
```

---

## Notas de Implementación

1. **Autenticación**: Usar JWT con refresh tokens
2. **Autorización**: Validar que usuarios solo editen/eliminen sus propios datos
3. **Soft Deletes**: Productos y mensajes se marcan como deleted, no se eliminan
4. **Timestamps**: Usar UTC siempre
5. **Búsqueda**: Implementar índices full-text en title y description
6. **Paginación**: Usar offset/limit o cursor-based
7. **Rate Limiting**: Limitar creación de productos, mensajes
8. **Validación**: Validar en backend siempre, nunca confiar solo en frontend
9. **Storage**: Usar servicio externo para imágenes (Vercel Blob, S3, etc)
10. **Transacciones DB**: Asegurar ACID en cambios de estado de productos
