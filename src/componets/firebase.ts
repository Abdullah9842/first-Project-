import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { 
  getFirestore,
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
  disableNetwork,
  enableNetwork
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

// تهيئة Firestore بشكل بسيط
const db = getFirestore(app);

// تفعيل التخزين المؤقت متعدد التبويبات
enableMultiTabIndexedDbPersistence(db)
  .then(() => {
    console.log('✅ Firestore persistence enabled');
  })
  .catch((err: { code: string }) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Multiple tabs open, persistence enabled in first tab only');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Browser does not support persistence');
    } else {
      console.error('❌ Error enabling persistence:', err);
    }
  });

// تهيئة خدمات Firebase الأخرى
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// التحقق من بيئة التشغيل وتكوين الاتصالات المناسبة
if (window.location.hostname === 'localhost') {
  // بيئة التطوير المحلية
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  console.log('🔧 Connected to Firebase Emulators');
} else {
  // بيئة الإنتاج (Vercel)
  console.log('🚀 Connected to Firebase Production Services');
  
  // التحقق من الاتصال بـ Firestore
  disableNetwork(db)
    .then(() => enableNetwork(db))
    .then(() => {
      console.log('✅ Firestore connection verified');
    })
    .catch((error: Error) => {
      console.error('❌ Firestore connection error:', error);
    });
}

// إضافة مستمع لحالة المصادقة
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('👤 User authenticated:', user.uid);
  } else {
    console.log('👤 User signed out');
  }
});

// تصدير المتغيرات لاستخدامها في باقي التطبيق
export default app;
export { auth, googleProvider, db, storage, onAuthStateChanged };
