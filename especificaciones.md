# 📚 PRODUCT REQUIREMENTS DOCUMENT (PRD) - "Wallapop Escolar"

## 1. PROPÓSITO GENERAL Y DIRECTRIZ PRINCIPAL (NORTH STAR)
El objetivo de este proyecto es construir el Frontend de una aplicación móvil (Thin Client) para el intercambio y compraventa de libros de texto, uniformes y material escolar entre padres de un mismo colegio. 

**Directriz Principal para la IA:** 
La aplicación debe ser un clon conceptual de **Wallapop**, adaptado a un entorno cerrado. Toda la UX/UI debe imitar las convenciones de Wallapop:
1. Navegación basada en un Bottom Navigation Bar.
2. Descubrimiento basado en imágenes grandes (Marketplace).
3. Chat transaccional (el chat siempre está vinculado a un producto específico y el vendedor gestiona el estado del producto desde el chat).
4. El diseño debe ser **estrictamente Mobile-First** (contenedor max-w-md, h-screen).

## 2. REGLAS DE DESARROLLO (FRONTEND)
- **Framework:** React con Tailwind CSS (o el stack por defecto del generador).
- **Componentes:** shadcn/ui y Lucide Icons.
- **Arquitectura:** Componentes atómicos. No generar archivos monolíticos.
- **Datos:** No implementar lógica de Backend. Usar exclusivamente `Mocks` (Arrays de objetos JSON) para poblar las interfaces.
- **Estética:** Limpia, minimalista, familiar y que inspire confianza. Botones grandes y usabilidad accesible para padres.

---

## 3. ÁRBOL DE NAVEGACIÓN Y FLUJOS

La aplicación se divide en dos grandes bloques:
- **Flujo Cerrado (Auth):** Invitación -> Registro -> Login.
- **Main App (Tabs Inferiores):**
  1. 🏠 Mercado (Inicio / Exploración)
  2. ➕ Vender (Flujo de subida de producto)
  3. 💬 Mensajes (Bandeja de chats)
  4. 👤 Perfil (Gestión personal)

---

## 4. ESPECIFICACIONES DE PANTALLAS (UI/UX)

### Pantalla 0: Muro de Acceso (Onboarding)
- Al ser una app exclusiva para el colegio, no hay acceso libre.
- **Vista:** Logo del colegio/AMPA centrado. Input grande para "Código de Invitación" o "Email autorizado".
- **Comportamiento:** Si el código es válido, pasa al formulario de registro (Nombre, Contraseña, Cursos de interés para pre-filtrar el mercado).

### Tab 1: 🏠 Mercado (Home)
La pantalla principal de descubrimiento.
- **Cabecera (Sticky):** Barra de búsqueda de ancho completo ("Buscar libro, curso, ISBN...").
- **Filtros Rápidos:** Scroll horizontal de etiquetas (Pills). Ej: [Todos] [1º ESO] [Libros] [Uniformes].
- **Cuerpo (Feed):** Grid de 2 columnas con `ProductCards`.
- **ProductCard:** Imagen cuadrada ocupando la mayor parte, título truncado a 1 línea, precio destacado en negrita, badge indicando el curso o estado.

### Pantalla Intermedia: Ficha de Producto (Detail View)
Se abre al tocar una `ProductCard`.
- **Media:** Imagen grande en la mitad superior. Botón flotante "Atrás".
- **Info:** Título, Precio y Estado.
- **Confianza:** Tarjeta horizontal del vendedor (Avatar, Nombre y Estrellas de valoración).
- **Acción (Sticky Bottom):** Botón ancho y destacado "Contactar a [Nombre]" (Si el producto está reservado, el botón se deshabilita y dice "Reservado").

### Tab 2: ➕ Vender (Upload Flow)
Formulario optimizado para subir productos en menos de 1 minuto.
- Botón grande para "Subir Fotos" (cámara o galería).
- Inputs limpios: Título, Categoría (Dropdown), Curso (Dropdown), Estado (Dropdown), Precio en €.
- Checkbox opcional: "Lo regalo / Donación".
- Botón final: "Publicar anuncio".

### Tab 3: 💬 Mensajes (Chat Transaccional - ESTILO WALLAPOP)
El núcleo de la aplicación.
- **Bandeja General:** Lista de chats. Cada fila muestra: Foto del otro usuario, miniatura del producto vinculada, último mensaje y hora.
- **Dentro del Chat (La sala de negociación):**
  - **Cabecera (Sticky):** Obligatorio mostrar miniatura, título y precio del producto en la parte superior del chat.
  - **Botones de Estado (Solo Vendedor):** En la cabecera, botones para "Reservar" o "Marcar como Vendido".
  - **Mensajes:** Burbujas estilo WhatsApp.
  - **Input:** Barra inferior para escribir con botón de adjuntar imagen.

### Tab 4: 👤 Perfil y Gestión
El panel de control del usuario.
- **Cabecera:** Avatar, Nombre y Valoración media (Estrellas).
- **Selector de Pestañas Interno (Segmented Control):** [En Venta] | [Reservados] | [Vendidos].
- **Listado:** Muestra los productos del usuario según el filtro seleccionado en formato de lista (no grid).
  - Si está en "En Venta", la lista debe indicar cuántos chats/interesados tiene abiertos cada producto.
  - Botón de 3 puntos (Opciones) para Editar o Borrar.

---

## 5. MOCKS DE DATOS (Data Structures)
Usa estas estructuras para crear los JSON falsos en el Frontend:

**Producto:**
`{ id: "p1", title: "Matemáticas 3º Primaria", price: 15, imageUrl: "...", condition: "Buen estado", course: "3º Primaria", state: "active" | "reserved" | "sold", sellerId: "u1" }`

**Usuario:**
`{ id: "u1", name: "María Gómez", avatarUrl: "...", rating: 4.8, reviewsCount: 12 }`

**Chat:**
`{ id: "c1", productId: "p1", buyerId: "u2", sellerId: "u1", lastMessage: "¿Sigue disponible?", timestamp: "14:30" }`

---

## ⚠️ INSTRUCCIONES PARA LA IA EJECUTORA
1. **Lee y asimila este documento para entender el contexto.**
2. **NO generes toda la aplicación de golpe.** 
3. Espera a que el usuario te pida componentes o pantallas específicas en los siguientes prompts. Cuando lo haga, basarás tu código en las reglas de este documento.