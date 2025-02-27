import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { 
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  connectFirestoreEmulator,
  CACHE_SIZE_UNLIMITED,
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

// الكشف عن متصفح Safari
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// تهيئة Firestore مع إعدادات مخصصة
const db = initializeFirestore(app, {
  // إعدادات خاصة لـ Safari
  experimentalForceLongPolling: isSafari,
  // إعدادات التخزين المؤقت
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({ forceOwnership: true }),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  }),
  // تعطيل الكشف التلقائي
  experimentalAutoDetectLongPolling: false
});

// تفعيل التخزين المحلي
if (isSafari) {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('📱 Safari IndexedDB persistence enabled');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ The current browser does not support persistence.');
      } else {
        console.error('❌ Error enabling persistence:', err);
      }
    });
}

// تهيئة خدمات Firebase الأخرى
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// تفعيل المحاكيات المحلية في بيئة التطوير فقط
if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  console.log('🔧 Connected to Firebase Emulators');
} else {
  console.log('🚀 Connected to Firebase Production Services');
  console.log(`🌐 Browser: ${isSafari ? 'Safari' : 'Other'}`);
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
