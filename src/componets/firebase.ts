



import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

// إعداد Firebase باستخدام المتغيرات البيئية
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير خدمة المصادقة (Authentication) للاستخدام في المكونات الأخرى
export const auth = getAuth(app);

// تصدير app (اختياري)
export default app;