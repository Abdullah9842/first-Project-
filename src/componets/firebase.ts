import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  type Firestore,
  type FirestoreSettings,
  type Query,
  type DocumentData,
  type QuerySnapshot,
  doc,
  onSnapshot,
  collection,
  type CollectionReference,
  enableIndexedDbPersistence
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGx4Zjd2X9LoMGvNf42x9YKAyZ1xjSrGo",
  authDomain: "jadeksa-69140.firebaseapp.com",
  projectId: "jadeksa-69140",
  storageBucket: "jadeksa-69140.firebasestorage.app",
  messagingSenderId: "597164029013",
  appId: "1:597164029013:web:72272a88da2a33aa5190dc",
  measurementId: "G-6PJL6V2KJG"
};

// Initialize Firebase immediately
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Optimized Firestore settings for cross-browser compatibility
const firestoreSettings: FirestoreSettings = {
  experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: false,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  }),
  ssl: true,
  host: 'firestore.googleapis.com',
  ignoreUndefinedProperties: true,
  cacheSizeBytes: 40000000, // Set to 40MB
};

// Initialize Firestore with optimized settings
const db = initializeFirestore(app, firestoreSettings);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.error("Error enabling offline persistence:", err);
});

// Export Firebase instances and types
export { auth, db, storage, googleProvider };
export type { Auth, Firestore, FirebaseStorage, GoogleAuthProvider };

// Helper function to get a collection reference
export const getCollection = (path: string): CollectionReference<DocumentData> => {
  return collection(db, path);
};

// Export utility functions
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

export const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
};

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
