
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,onAuthStateChanged} from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFirestore, Firestore } from "firebase/firestore";

// إعداد Firebase باستخدام المتغيرات البيئية
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

// تصدير خدمة المصادقة (Authentication) للاستخدام في المكونات الأخرى
const auth = getAuth(app);

// تصدير خدمة Firestore
const db: Firestore = getFirestore(app);

// تصدير Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// تصدير خدمة التخزين (Storage)
const storage: FirebaseStorage = getStorage(app);

// تصدير المتغيرات بحيث يمكن استخدامها في باقي أجزاء التطبيق
export default app;
export { auth, googleProvider, db, storage,onAuthStateChanged};