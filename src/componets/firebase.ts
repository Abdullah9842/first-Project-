import type { FirebaseOptions, FirebaseApp } from "firebase/app";
import type { Auth, GoogleAuthProvider } from "firebase/auth";
import type { FirebaseStorage } from "firebase/storage";
import type { Firestore, FirestoreSettings } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCGx4Zjd2X9LoMGvNf42x9YKAyZ1xjSrGo",
  authDomain: "jadeksa-69140.firebaseapp.com",
  projectId: "jadeksa-69140",
  storageBucket: "jadeksa-69140.firebasestorage.app",
  messagingSenderId: "597164029013",
  appId: "1:597164029013:web:72272a88da2a33aa5190dc",
  measurementId: "G-6PJL6V2KJG"
};

let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;
let db: Firestore;
let googleProvider: GoogleAuthProvider;

async function initializeFirebase() {
  const { initializeApp } = await import('firebase/app');
  const { getAuth, GoogleAuthProvider } = await import('firebase/auth');
  const { getStorage } = await import('firebase/storage');
  const { 
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    enableIndexedDbPersistence,
    CACHE_SIZE_UNLIMITED
  } = await import('firebase/firestore');

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();

  // Safari-optimized Firestore settings
  const firestoreSettings: FirestoreSettings = {
    experimentalForceLongPolling: true,
    experimentalAutoDetectLongPolling: true,
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  };

  try {
    // Try to initialize with optimized settings first
    db = initializeFirestore(app, firestoreSettings);
    
    // Enable offline persistence
    try {
      await enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support persistence.');
        } else {
          console.error("Error enabling persistence:", err);
        }
      });
    } catch (err) {
      console.warn('Failed to enable persistence:', err);
    }
  } catch (err) {
    console.error('Failed to initialize Firestore with custom settings:', err);
    // Fallback to basic configuration
    db = getFirestore(app);
    console.log('Using fallback Firestore configuration');
  }

  return { app, auth, googleProvider, db, storage };
}

export { initializeFirebase };
export type { Auth, Firestore, FirebaseStorage };
