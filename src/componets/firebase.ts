import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { 
  getFirestore,
  connectFirestoreEmulator,
  enableIndexedDbPersistence
} from "firebase/firestore";

// تكوين Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCGx4Zjd2X9LoMGvNf42x9YKAyZ1xjSrGo",
  authDomain: "jadeksa-69140.firebaseapp.com",
  projectId: "jadeksa-69140",
  storageBucket: "jadeksa-69140.firebasestorage.app",
  messagingSenderId: "597164029013",
  appId: "1:597164029013:web:72272a88da2a33aa5190dc",
  measurementId: "G-6PJL6V2KJG"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تهيئة Firestore مع إعدادات خاصة
const db = getFirestore(app);

// تمكين التخزين المحلي لـ Safari
if (typeof window !== 'undefined' && window.navigator.vendor.includes('Apple')) {
  enableIndexedDbPersistence(db, {
    forceOwnership: true
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
}

const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// تفعيل المحاكيات المحلية في بيئة التطوير فقط
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('🔧 Using Firebase Emulators');
} else {
  console.log('🚀 Using Firebase Production Services');
}

export default app;
export { auth, googleProvider, db, storage };
