import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { 
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  connectFirestoreEmulator
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

// تهيئة Firestore مع إعدادات مخصصة لـ Safari
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const db = initializeFirestore(app, {
  experimentalForceLongPolling: isSafari, // تفعيل فقط في Safari
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({ forceOwnership: true })
  }),
  host: 'firestore.googleapis.com',
  ssl: true
});

// تهيئة خدمات Firebase الأخرى
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// تفعيل المحاكيات المحلية في بيئة التطوير فقط
if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  console.log('Connected to Firebase Emulators');
}

// تصدير المتغيرات لاستخدامها في باقي التطبيق
export default app;
export { auth, googleProvider, db, storage, onAuthStateChanged };
