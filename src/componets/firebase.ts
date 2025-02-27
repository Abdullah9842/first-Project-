import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { 
  getFirestore,
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
const db = getFirestore(app);
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
