// import { initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
// import { getStorage, type FirebaseStorage } from 'firebase/storage';
// import { 
//   initializeFirestore, 
//   persistentLocalCache, 
//   persistentMultipleTabManager, 
//   type Firestore,
//   type FirestoreSettings,
//   type Query,
//   type DocumentData,
//   type QuerySnapshot,
//   doc,
//   onSnapshot,
//   collection,
//   type CollectionReference,
//   enableIndexedDbPersistence
// } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyCGx4Zjd2X9LoMGvNf42x9YKAyZ1xjSrGo",
//   authDomain: "jadeksa-69140.firebaseapp.com",
//   projectId: "jadeksa-69140",
//   storageBucket: "jadeksa-69140.firebasestorage.app",
//   messagingSenderId: "597164029013",
//   appId: "1:597164029013:web:72272a88da2a33aa5190dc",
//   measurementId: "G-6PJL6V2KJG"
// };

// // Initialize Firebase immediately
// const app = initializeApp(firebaseConfig);

// // Initialize services
// const auth = getAuth(app);
// const storage = getStorage(app);
// const googleProvider = new GoogleAuthProvider();

// // Optimized Firestore settings for cross-browser compatibility
// const firestoreSettings: FirestoreSettings = {
//   experimentalForceLongPolling: true,
//   experimentalAutoDetectLongPolling: false,
//   localCache: persistentLocalCache({
//     tabManager: persistentMultipleTabManager(),
//     cacheSizeBytes: 40000000 // Set to 40MB
//   }),
//   ssl: true,
//   host: 'firestore.googleapis.com',
//   ignoreUndefinedProperties: true
// };

// // Initialize Firestore with optimized settings
// const db = initializeFirestore(app, firestoreSettings);

// // Enable offline persistence
// enableIndexedDbPersistence(db).catch((err) => {
//   console.error("Error enabling offline persistence:", err);
// });

// // Export Firebase instances and types
// export { auth, db, storage, googleProvider };
// export type { Auth, Firestore, FirebaseStorage, GoogleAuthProvider };

// // Helper function to get a collection reference
// export const getCollection = (path: string): CollectionReference<DocumentData> => {
//   return collection(db, path);
// };

// // Export utility functions
// export const subscribeToData = (
//   query: Query<DocumentData>,
//   onData: (data: QuerySnapshot<DocumentData>) => void,
//   retryCount = 0
// ): Promise<(() => void) | undefined> => {
//   return new Promise((resolve) => {
//     try {
//       const unsubscribe = onSnapshot(query, 
//         (snapshot) => {
//           onData(snapshot);
//           resolve(unsubscribe);
//         }, 
//         (error) => {
//           console.error('Error fetching data:', error);
//           if (retryCount < 3) {
//             setTimeout(() => {
//               subscribeToData(query, onData, retryCount + 1)
//                 .then(resolve);
//             }, 1000 * (retryCount + 1));
//           } else {
//             resolve(undefined);
//           }
//         }
//       );
//     } catch (error) {
//       console.error('Error setting up listener:', error);
//       if (retryCount < 3) {
//         setTimeout(() => {
//           subscribeToData(query, onData, retryCount + 1)
//             .then(resolve);
//         }, 1000 * (retryCount + 1));
//       } else {
//         resolve(undefined);
//       }
//     }
//   });
// };

// export const loadImage = (url: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onload = () => resolve(url);
//     img.onerror = () => reject(new Error('Image load failed'));
//     img.src = url;
//   });
// };

// export const fetchWithCache = async <T>(
//   key: string,
//   fetchFn: () => Promise<T>
// ): Promise<T> => {
//   const cached = sessionStorage.getItem(key);
//   if (cached) {
//     return JSON.parse(cached) as T;
//   }
//   const data = await fetchFn();
//   sessionStorage.setItem(key, JSON.stringify(data));
//   return data;
// };

// export const checkConnection = (): Promise<boolean> => {
//   return new Promise((resolve) => {
//     const unsubscribe = onSnapshot(
//       doc(db, '_health', 'status'),
//       () => {
//         unsubscribe();
//         resolve(true);
//       },
//       () => {
//         unsubscribe();
//         resolve(false);
//       }
//     );
//   });
// };



import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { 
  initializeFirestore, 
  enableMultiTabIndexedDbPersistence, 
  type Firestore,
  type FirestoreSettings,
  type Query,
  type DocumentData,
  type QuerySnapshot,
  doc,
  onSnapshot,
  collection,
  type CollectionReference
} from 'firebase/firestore';

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCGx4Zjd2X9LoMGvNf42x9YKAyZ1xjSrGo",
  authDomain: "jadeksa-69140.firebaseapp.com",
  projectId: "jadeksa-69140",
  storageBucket: "jadeksa-69140.firebasestorage.app",
  messagingSenderId: "597164029013",
  appId: "1:597164029013:web:72272a88da2a33aa5190dc",
  measurementId: "G-6PJL6V2KJG"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Services
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// ✅ Firestore Settings (Fixed for Safari)
const firestoreSettings: FirestoreSettings = {
  experimentalForceLongPolling: true, // Fix for Safari
  ignoreUndefinedProperties: true
};

// ✅ Initialize Firestore with settings
const db = initializeFirestore(app, firestoreSettings);

// ✅ Detect Safari Private Mode (to avoid IndexedDB errors)
const isSafariPrivate = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const db = indexedDB.open("test");
    db.onerror = () => resolve(true);
    db.onsuccess = () => resolve(false);
  });
};

// ✅ Enable Offline Persistence (except in Safari Private Mode)
isSafariPrivate().then((isPrivate) => {
  if (!isPrivate) {
    enableMultiTabIndexedDbPersistence(db).catch((err) => {
      console.error("Error enabling offline persistence:", err);
    });
  } else {
    console.warn("IndexedDB is blocked in Safari Private Mode. Persistence disabled.");
  }
});

// ✅ Export Firebase Instances
export { auth, db, storage, googleProvider };
export type { Auth, Firestore, FirebaseStorage, GoogleAuthProvider };

// ✅ Helper function to get Firestore Collection
export const getCollection = (path: string): CollectionReference<DocumentData> => {
  return collection(db, path);
};

// ✅ Subscribe to Firestore Data (Auto-Retry on Error)
export const subscribeToData = (
  query: Query<DocumentData>,
  onData: (data: QuerySnapshot<DocumentData>) => void,
  retryCount = 0
): Promise<(() => void) | undefined> => {
  return new Promise((resolve) => {
    try {
      const unsubscribe = onSnapshot(query, 
        (snapshot) => {
          onData(snapshot);
          resolve(unsubscribe);
        }, 
        (error) => {
          console.error('Error fetching data:', error);
          if (retryCount < 3) {
            setTimeout(() => {
              subscribeToData(query, onData, retryCount + 1)
                .then(resolve);
            }, 1000 * (retryCount + 1));
          } else {
            resolve(undefined);
          }
        }
      );
    } catch (error) {
      console.error('Error setting up listener:', error);
      if (retryCount < 3) {
        setTimeout(() => {
          subscribeToData(query, onData, retryCount + 1)
            .then(resolve);
        }, 1000 * (retryCount + 1));
      } else {
        resolve(undefined);
      }
    }
  });
};

// ✅ Image Loading Utility
export const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
};

// ✅ Cached Fetch Function
export const fetchWithCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> => {
  const cached = sessionStorage.getItem(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }
  const data = await fetchFn();
  sessionStorage.setItem(key, JSON.stringify(data));
  return data;
};

// ✅ Check Firestore Connection
export const checkConnection = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = onSnapshot(
      doc(db, '_health', 'status'),
      () => {
        unsubscribe();
        resolve(true);
      },
      () => {
        unsubscribe();
        resolve(false);
      }
    );
  });
};

// import { initializeApp } from 'firebase/app';
// import { 
//   getAuth, 
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut
// } from 'firebase/auth';
// import { 
//   getFirestore,
//   collection,
//   query,
//   where,
//   doc,
//   onSnapshot,
//   getDocs,
//   deleteDoc,
//   getDoc,
//   updateDoc,
//   addDoc,
//   Timestamp,
//   type DocumentData,
//   type QueryDocumentSnapshot,
//   CollectionReference
// } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

// // استخدام متغيرات البيئة بدلاً من المفاتيح المباشرة
// const firebaseConfig = {
//   apiKey: "AIzaSyCGx4Zjd2X9LoMGvNf42x9YKAyZ1xjSrGo",
//   authDomain: "jadeksa-69140.firebaseapp.com",
//   projectId: "jadeksa-69140",
//   storageBucket: "jadeksa-69140.firebasestorage.app",
//   messagingSenderId: "597164029013",
//   appId: "1:597164029013:web:72272a88da2a33aa5190dc",
//   measurementId: "G-6PJL6V2KJG"
// };

// // تهيئة Firebase
// const app = initializeApp(firebaseConfig);

// // تهيئة الخدمات
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const googleProvider = new GoogleAuthProvider();

// // الدوال المساعدة
// const getCollection = (path: string): CollectionReference<DocumentData> => {
//   return collection(db, path);
// };

// const checkConnection = (): Promise<boolean> => {
//   return new Promise((resolve) => {
//     const unsubscribe = onSnapshot(
//       doc(db, '_health', 'status'),
//       () => {
//         unsubscribe();
//         resolve(true);
//       },
//       () => {
//         unsubscribe();
//         resolve(false);
//       }
//     );
//   });
// };

// export {
//   auth,
//   db,
//   storage,
//   googleProvider,
//   getCollection,
//   checkConnection,
//   signInWithPopup,
//   signOut,
//   collection,
//   query,
//   where,
//   doc,
//   onSnapshot,
//   getDocs,
//   deleteDoc,
//   getDoc,
//   updateDoc,
//   addDoc,
//   Timestamp
// };

// // تصدير الأنواع
// export type {
//   DocumentData,
//   QueryDocumentSnapshot
// }; 

