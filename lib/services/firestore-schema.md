# Firestore Collections Schema

## 1. users
Colección de usuarios del sistema.

```json
{
  "uid": "firebase-auth-uid",
  "name": "string",
  "email": "string",
  "rating": "number (1-5)",
  "reviewsCount": "number",
  "avatarUrl": "string (URL)",
  "bio": "string (opcional)",
  "createdAt": "timestamp",
  "lastLogin": "timestamp",
  "phone": "string (opcional)",
  "location": "string (opcional)"
}
```

**Índices:**
- uid (único)
- createdAt (descendente)
- rating (descendente)

---

## 2. products
Colección de artículos en venta.

```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "images": "array<string> (URLs)",
  "category": "string (books|uniforms|bags|supplies|tech)",
  "condition": "string (new|like-new|used|fair)",
  "sellerId": "string (uid del vendedor)",
  "state": "string (active|reserved|sold)",
  "views": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "reservedBy": "string (uid, opcional)",
  "soldTo": "string (uid, opcional)",
  "soldDate": "timestamp (opcional)"
}
```

**Índices:**
- state, createdAt (descendente)
- category, state
- sellerId, createdAt (descendente)
- state, updatedAt (descendente)

---

## 3. conversations
Colección de conversaciones entre usuarios.

```json
{
  "productId": "string",
  "sellerId": "string",
  "buyerId": "string",
  "participants": "array<string>",
  "createdAt": "timestamp",
  "lastMessage": "string",
  "lastMessageTime": "timestamp",
  "unreadCount": "number"
}
```

**Índices:**
- participants (array-contains), lastMessageTime (descendente)
- productId, sellerId
- buyerId, createdAt (descendente)

---

## 4. messages
Colección de mensajes individuales.

```json
{
  "conversationId": "string",
  "senderId": "string",
  "text": "string",
  "timestamp": "timestamp",
  "read": "boolean",
  "readAt": "timestamp (opcional)"
}
```

**Índices:**
- conversationId, timestamp (ascendente)
- conversationId, read, timestamp

---

## 5. reviews
Colección de reseñas y valoraciones.

```json
{
  "reviewerId": "string",
  "revieweeId": "string",
  "productId": "string",
  "transactionId": "string",
  "rating": "number (1-5)",
  "comment": "string",
  "createdAt": "timestamp",
  "type": "string (buyer|seller)"
}
```

**Índices:**
- revieweeId, createdAt (descendente)
- reviewerId, createdAt (descendente)
- transactionId (único)

---

## 6. transactions
Colección de transacciones completadas.

```json
{
  "productId": "string",
  "buyerId": "string",
  "sellerId": "string",
  "price": "number",
  "status": "string (completed|pending|cancelled)",
  "createdAt": "timestamp",
  "completedAt": "timestamp",
  "conversationId": "string",
  "paymentMethod": "string (opcional)"
}
```

**Índices:**
- buyerId, createdAt (descendente)
- sellerId, createdAt (descendente)
- status, createdAt (descendente)

---

## 7. notifications
Colección de notificaciones.

```json
{
  "userId": "string",
  "type": "string (message|offer|review|product_sold)",
  "title": "string",
  "message": "string",
  "relatedId": "string (productId, conversationId, etc)",
  "createdAt": "timestamp",
  "read": "boolean",
  "readAt": "timestamp (opcional)"
}
```

**Índices:**
- userId, read, createdAt (descendente)
- userId, createdAt (descendente)

---

## 8. reports
Colección de denuncias de abuso (opcional).

```json
{
  "reporterId": "string",
  "reportedUserId": "string",
  "reason": "string",
  "description": "string",
  "evidence": "array<string> (URLs)",
  "status": "string (open|investigating|resolved|dismissed)",
  "createdAt": "timestamp",
  "resolvedAt": "timestamp (opcional)"
}
```

**Índices:**
- reportedUserId, status
- status, createdAt (descendente)

---

# Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Autenticación requerida para todas las operaciones
    function isAuth() {
      return request.auth != null;
    }
    
    function isUser(uid) {
      return request.auth.uid == uid;
    }
    
    // USERS
    match /users/{userId} {
      allow read: if isAuth();
      allow create: if isAuth() && isUser(userId) && request.resource.data.uid == userId;
      allow update: if isAuth() && isUser(userId);
      allow delete: if false; // No permitir eliminación
    }
    
    // PRODUCTS
    match /products/{productId} {
      allow read: if isAuth();
      allow create: if isAuth() && request.resource.data.sellerId == request.auth.uid;
      allow update: if isAuth() && (resource.data.sellerId == request.auth.uid);
      allow delete: if isAuth() && resource.data.sellerId == request.auth.uid;
    }
    
    // CONVERSATIONS
    match /conversations/{conversationId} {
      allow read: if isAuth() && request.auth.uid in resource.data.participants;
      allow create: if isAuth() && request.auth.uid in request.resource.data.participants;
      allow update: if isAuth() && request.auth.uid in resource.data.participants;
    }
    
    // MESSAGES
    match /messages/{messageId} {
      allow read: if isAuth();
      allow create: if isAuth() && request.resource.data.senderId == request.auth.uid;
      allow update: if isAuth() && resource.data.senderId == request.auth.uid;
    }
    
    // REVIEWS
    match /reviews/{reviewId} {
      allow read: if isAuth();
      allow create: if isAuth() && request.resource.data.reviewerId == request.auth.uid;
      allow update: if isAuth() && resource.data.reviewerId == request.auth.uid;
    }
    
    // TRANSACTIONS
    match /transactions/{transactionId} {
      allow read: if isAuth() && (
        resource.data.buyerId == request.auth.uid || 
        resource.data.sellerId == request.auth.uid
      );
      allow create: if isAuth() && request.resource.data.buyerId == request.auth.uid;
    }
    
    // NOTIFICATIONS
    match /notifications/{notificationId} {
      allow read: if isAuth() && resource.data.userId == request.auth.uid;
      allow update: if isAuth() && resource.data.userId == request.auth.uid;
    }
    
    // REPORTS
    match /reports/{reportId} {
      allow read: if isAuth() && resource.data.reporterId == request.auth.uid;
      allow create: if isAuth() && request.resource.data.reporterId == request.auth.uid;
    }
  }
}
```

---

# Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Imágenes de productos
    match /products/{userId}/{fileName=**} {
      allow read: if true; // Lectura pública
      allow write: if request.auth.uid == userId && 
                     request.resource.size < 5 * 1024 * 1024; // Max 5MB
      allow delete: if request.auth.uid == userId;
    }
    
    // Avatares de usuarios
    match /avatars/{userId}/{fileName=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId && 
                     request.resource.size < 2 * 1024 * 1024; // Max 2MB
      allow delete: if request.auth.uid == userId;
    }
  }
}
```

