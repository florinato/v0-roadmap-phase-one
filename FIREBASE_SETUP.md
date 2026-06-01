# Firebase Configuration Guide

## Descripción General

EscolarApp ahora soporta tanto **modo Firebase real** como **modo fallback con mockData**. Esto permite desarrollo y testing sin necesidad de configurar Firebase inmediatamente.

## Modo Actual

Si ves el siguiente mensaje en la consola:
```
[v0] Firebase: Variables de entorno faltantes. Usando mockData como fallback.
```

**Significa que la app está usando datos mock.** Esto es normal durante desarrollo.

## Configurar Firebase para Producción

### Paso 1: Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Crear Proyecto"
3. Completa el formulario y espera a que se cree

### Paso 2: Obtener las credenciales

1. En la consola, ve a **Project Settings** (rueda de engranaje)
2. Desplázate hasta **Tu aplicación**
3. Selecciona **Web** (símbolo `</>`)
4. Copia el objeto `firebaseConfig`

Verás algo como:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "proyecto.firebaseapp.com",
  projectId: "proyecto",
  storageBucket: "proyecto.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456...",
};
```

### Paso 3: Agregar variables de entorno

1. Copia `.env.local.example` a `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Abre `.env.local` y reemplaza los valores `tu_...` con los de tu firebaseConfig:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=proyecto
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456...
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456...
   ```

### Paso 4: Crear colecciones en Firestore

Ve a **Firestore Database** en la consola y crea estas colecciones:

```
users/
  - id (documento)
  - name
  - email
  - avatarUrl
  - rating
  - reviewsCount

products/
  - id (documento)
  - title
  - price
  - images[] (array)
  - category
  - state (active|reserved|sold)
  - description
  - sellerId
  - createdAt
  - updatedAt

conversations/
  - id (documento)
  - productId
  - buyerId
  - sellerId
  - messages[]
  - lastMessage
  - lastMessageTime
  - createdAt

messages/ (subcollection en conversations)
  - id
  - text
  - senderType (user|seller)
  - timestamp

reviews/
  - id (documento)
  - buyerName
  - buyerAvatar
  - rating
  - comment
  - productTitle
  - date
  - sellerId
  - createdAt

transactions/
  - id (documento)
  - productId
  - buyerId
  - sellerId
  - type (bought|sold)
  - price
  - createdAt
```

### Paso 5: Configurar Storage Rules

Ve a **Storage** → **Rules** y reemplaza con:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### Paso 6: Configurar Firestore Rules

Ve a **Firestore** → **Rules** y reemplaza con:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos: todos pueden leer activos, solo vendedor puede escribir
    match /products/{productId} {
      allow read: if resource.data.state == 'active';
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.sellerId;
      allow delete: if request.auth.uid == resource.data.sellerId;
    }

    // Usuarios: datos públicos
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }

    // Conversaciones: solo participantes pueden leer/escribir
    match /conversations/{conversationId} {
      allow read, write: if request.auth.uid in [resource.data.buyerId, resource.data.sellerId];
      allow create: if request.auth != null;
    }

    // Reseñas
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
    }

    // Transacciones
    match /transactions/{transactionId} {
      allow read, write: if request.auth.uid in [resource.data.buyerId, resource.data.sellerId];
    }
  }
}
```

### Paso 7: Reiniciar la app

```bash
npm run dev
```

Si todo está bien, deberías ver en la consola:
```
[v0] Firebase initialized successfully
```

## Solución de Problemas

### Error: "auth/invalid-api-key"
- Verifica que las variables de entorno en `.env.local` sean correctas
- Asegúrate de que el API Key esté habilitado en Google Cloud Console

### Los datos no se guardan en Firestore
- Verifica que las Firestore Rules permitan escritura
- Comprueba que el usuario esté autenticado (Firebase Auth)

### Las imágenes no se suben
- Verifica las Storage Rules permitan escritura
- Comprueba que el bucket name sea correcto

## Modo Desarrollo vs Producción

**Durante desarrollo (sin Firebase):**
- ✅ Todos los datos vienen de mockData
- ✅ Puedes navegar y testear la UI
- ✅ No hay persistencia real

**En producción (con Firebase configurado):**
- ✅ Datos reales en Firestore
- ✅ Imágenes en Storage
- ✅ Autenticación real con Firebase Auth
- ✅ Backups automáticos

## Código Relevante

- **firebase.js** - Inicialización y fallback
- **db.js** - Todas las operaciones de base de datos
- **MarketView.tsx** - Ejemplo de cómo cargar datos
