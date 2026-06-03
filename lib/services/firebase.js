import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Validar que las variables de entorno estén configuradas
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

// Diagnosticar cuáles variables están presentes
console.log('[v0] Firebase env var check:');
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  console.log(`  ${varName}: ${value ? '✓ SET' : '✗ MISSING'}`);
});

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingVars.length > 0) {
  console.warn(
    '[v0] Firebase: Variables de entorno faltantes (' + missingVars.length + '). Usando mockData como fallback.',
    'Faltantes:',
    missingVars
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mock-domain',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mock-bucket',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'mock-sender',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'mock-app',
};

if (missingVars.length === 0) {
  console.log('[v0] Firebase: Todos los env vars configurados. Inicializando Firebase...');
}

let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('[v0] Firebase initialized successfully');
} catch (error) {
  console.warn('[v0] Firebase initialization failed:', error.message);
  app = null;
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage, app };
export const isFirebaseConfigured = missingVars.length === 0 && app !== null;

export default app;
