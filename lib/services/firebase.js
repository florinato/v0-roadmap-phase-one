import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Intentar obtener config desde env vars (servidor)
const serverConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Variables que se actualizarán cuando se cargue config desde API
let firebaseConfig = serverConfig;
let app = null;
let auth = null;
let db = null;
let storage = null;
let isFirebaseConfigured = false;

// Promesa que se resuelve cuando Firebase está listo
let firebaseReadyPromise = null;
let firebaseReadyResolve = null;

// Función para validar configuración
function isValidConfig(config) {
  return (
    config &&
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId
  );
}

// Función para inicializar Firebase
function initializeFirebase(config) {
  try {
    if (!isValidConfig(config)) {
      console.log('[v0] Invalid Firebase config');
      return false;
    }

    firebaseConfig = config;
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isFirebaseConfigured = true;

    console.log('[v0] Firebase initialized successfully');

    // Resolver la promesa de espera
    if (firebaseReadyResolve) {
      firebaseReadyResolve(true);
    }

    return true;
  } catch (error) {
    console.error('[v0] Firebase initialization error:', error.message);
    isFirebaseConfigured = false;
    return false;
  }
}

// Crear promesa de espera
if (typeof window !== 'undefined') {
  firebaseReadyPromise = new Promise((resolve) => {
    firebaseReadyResolve = resolve;
  });
}

// Intentar inicializar en servidor
if (typeof window === 'undefined' && isValidConfig(serverConfig)) {
  initializeFirebase(serverConfig);
}

// En cliente, cargar configuración desde API
if (typeof window !== 'undefined') {
  (async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const clientConfig = await response.json();
        console.log('[v0] Config loaded from API');
        if (!isFirebaseConfigured) {
          initializeFirebase(clientConfig);
        }
      } else {
        console.warn('[v0] Failed to fetch config: status', response.status);
        firebaseReadyResolve(false);
      }
    } catch (error) {
      console.error('[v0] Failed to load Firebase config from API:', error);
      firebaseReadyResolve(false);
    }
  })();
}

// Si no hay config válida, al menos log una advertencia
if (!isValidConfig(firebaseConfig)) {
  console.warn('[v0] Firebase config not available. Using mockData fallback.');
}

// Función para esperar a que Firebase esté listo
export async function waitForFirebase() {
  if (typeof window === 'undefined') {
    // En servidor, Firebase ya debe estar inicializado
    return isFirebaseConfigured;
  }
  
  if (isFirebaseConfigured) {
    return true;
  }
  
  if (firebaseReadyPromise) {
    return await firebaseReadyPromise;
  }
  
  return false;
}

export { auth, db, storage, app };
export const isConfigured = () => isFirebaseConfigured;

export default app;

