import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFirestore, Firestore } from "firebase/firestore";

// إعداد Firebase باستخدام المتغيرات البيئية
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// تحقق من وجود المتغيرات البيئية المطلوبة
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير خدمة المصادقة (Authentication)
const auth = getAuth(app);

// تصدير خدمة Firestore
const db: Firestore = getFirestore(app);

// تصدير Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// تصدير خدمة التخزين (Storage)
const storage: FirebaseStorage = getStorage(app);

// تصدير المتغيرات بحيث يمكن استخدامها في باقي أجزاء التطبيق
export default app;
export { auth, googleProvider, db, storage, onAuthStateChanged };