
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//     apiKey: "AIzaSyCGx4Zjd2X9LoMGvNf42x9YKAyZ1xjSrGo",
//     authDomain: "jadeksa-69140.firebaseapp.com",
//     projectId: "jadeksa-69140",
//     storageBucket: "jadeksa-69140.firebasestorage.app",
//     messagingSenderId: "597164029013",
//     appId: "1:597164029013:web:72272a88da2a33aa5190dc",
//     measurementId: "G-6PJL6V2KJG"
//   };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app); // تصدير auth
// export default app; // تصدير app

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// إعداد Firebase
const firebaseConfig = {

};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير auth للاستخدام في المكونات الأخرى
export const auth = getAuth(app);

// تصدير app (اختياري)
export default app;
