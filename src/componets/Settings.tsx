


// import React, { useState, useEffect } from 'react';
// import { db } from './firebase';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';

// interface SettingsProps {
//   userId: string;
//   onClose: () => void;
//   handleLogout: () => Promise<void>;
// }

// const Settings: React.FC<SettingsProps> = ({ userId, onClose, handleLogout }) => {
//   const [name, setName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [photoURL, setPhotoURL] = useState<string>('');
//   const [createdAt, setCreatedAt] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [isLoadingPhoto, setIsLoadingPhoto] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userDocRef = doc(db, 'Users', userId);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           setName(userData.name || '');
//           setEmail(userData.email || '');
//           setPhotoURL(userData.photoURL || '');
//           if (userData.createdAt) {
//             const createdAtDate = userData.createdAt.toDate();
//             setCreatedAt(createdAtDate.toLocaleString());
//           }
//         } else {
//           console.log('المستند غير موجود!');
//         }
//       } catch (error) {
//         console.error('خطأ في جلب بيانات المستخدم:', error);
//         setError('حدث خطأ أثناء تحميل البيانات!');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchUserData();
//     }
//   }, [userId]);

//   const handleSave = async () => {
//     try {
//       const userDocRef = doc(db, 'Users', userId);
//       await updateDoc(userDocRef, {
//         name,
//         photoURL,
//       });
//       setIsEditing(false);
//     } catch (error) {
//       console.error('خطأ في تحديث بيانات المستخدم:', error);
//       setError('حدث خطأ أثناء حفظ البيانات!');
//     }
//   };

//   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type and size
//       if (!file.type.startsWith('image/')) {
//         setError('يرجى اختيار صورة فقط.');
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) { // Max 5MB
//         setError('حجم الصورة أكبر من المسموح به (5MB).');
//         return;
//       }

//       setIsLoadingPhoto(true);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhotoURL(reader.result as string);
//         setIsLoadingPhoto(false);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg w-80 flex justify-center items-center">
//           <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 rounded-full w-16 h-16"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
  

//     <div className="fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">

//       <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-black transition text-lg"
//         >
//           ✖
//         </button>

//         <h2 className="text-lg font-bold mb-5 text-center">الإعدادات</h2>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <div className="mb-4">
//           <label className="block text-gray-700">الاسم:</label>
//           {isEditing ? (
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-3 py-2 border rounded"
//             />
//           ) : (
//             <p>{name}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">البريد الإلكتروني:</label>
//           <p>{email}</p>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">الصورة الشخصية:</label>
//           {isEditing ? (
//             <>
//               {isLoadingPhoto ? (
//                 <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 rounded-full w-16 h-16"></div>
//               ) : (
//                 <input
//                   type="file"
//                   onChange={handlePhotoUpload}
//                   className="w-full px-3 py-2 border rounded"
//                 />
//               )}
//             </>
//           ) : (
//             <img
//               src={photoURL || '/default-avatar.jpg'}
//               alt="User Avatar"
//               className="w-16 h-16 rounded-full"
//             />
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">تاريخ الإنشاء:</label>
//           <p>{createdAt}</p>
//         </div>

//         {isEditing ? (
//           <button
//             onClick={handleSave}
//             className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition w-full mb-2"
//           >
//             حفظ
//           </button>
//         ) : (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition w-full mb-2"
//           >
//             تعديل
//           </button>
//         )}

//         <button
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition w-full"
//         >
//           تسجيل الخروج
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Settings;




// import React, { useState, useEffect } from 'react';
// import { db } from './firebase';
// import { doc, getDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';

// interface SettingsProps {
//   userId: string;
//   onClose: () => void;
//   handleLogout: () => Promise<void>;
// }

// const Settings: React.FC<SettingsProps> = ({ userId, onClose, handleLogout }) => {
//   const [name, setName] = useState<string>('');
//   const [username, setUsername] = useState<string>('');
//   const [photoURL, setPhotoURL] = useState<string>('');
//   const [error, setError] = useState<string>('');
//   const [isEditing, setIsEditing] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userDocRef = doc(db, 'Users', userId);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           setName(userData.name || '');
//           setUsername(userData.username || '');
//           setPhotoURL(userData.photoURL || '');
//         }
//       } catch {
//         setError('حدث خطأ أثناء تحميل البيانات!');
//       }
//     };

//     if (userId) {
//       fetchUserData();
//     }
//   }, [userId]);

//   const validateUsername = (value: string) => {
//     const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;
//     return usernameRegex.test(value);
//   };

//   const handleSave = async () => {
//     if (!validateUsername(username)) {
//       setError('يجب أن يكون اسم المستخدم باللغة الإنجليزية، يحتوي على 4 أحرف على الأقل، ويمكن أن يشمل أرقامًا و (_) فقط.');
//       return;
//     }

//     try {
//       // التحقق مما إذا كان اسم المستخدم مأخوذًا بالفعل
//       const usersRef = collection(db, 'Users');
//       const q = query(usersRef, where('username', '==', username));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const existingUser = querySnapshot.docs.find((doc) => doc.id !== userId);
//         if (existingUser) {
//           setError('اسم المستخدم مأخوذ بالفعل، يرجى اختيار اسم آخر.');
//           return;
//         }
//       }

//       // تحديث بيانات المستخدم
//       const userDocRef = doc(db, 'Users', userId);
//       await updateDoc(userDocRef, {
//         name,
//         username,
//         photoURL,
//       });
//       setIsEditing(false);
//       setError('');
//     } catch {
//       setError('حدث خطأ أثناء حفظ البيانات!');
//     }
//   };

//   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         setError('يرجى اختيار صورة فقط.');
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError('حجم الصورة أكبر من المسموح به (5MB).');
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhotoURL(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
//         <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">✖</button>
//         <h2 className="text-lg font-bold mb-5 text-center">الإعدادات</h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <div className="mb-4">
//           <label className="block text-gray-700">الصورة الشخصية:</label>
//           {isEditing ? (
//             <input type="file" onChange={handlePhotoUpload} className="w-full px-3 py-2 border rounded" />
//           ) : (
//             <img src={photoURL || '/default-avatar.jpg'}  className="w-16 h-16 rounded-full" />
//           )}
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">الاسم:</label>
//           {isEditing ? (
//             <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" />
//           ) : (
//             <p>{name}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">اسم المستخدم:</label>
//           {isEditing ? (
//             <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded" />
//           ) : (
//             <p>{username}</p>
//           )}
//         </div>
  
      

//         {isEditing ? (
//           <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-full w-full mb-2">حفظ</button>
//         ) : (
//           <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-full w-full mb-2">تعديل</button>
//         )}

//         <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-full w-full">تسجيل الخروج</button>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; 
import { doc, getDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

interface SettingsProps {
  userId: string;
  onClose: () => void;
  handleLogout: () => Promise<void>;
}

const Settings: React.FC<SettingsProps> = ({ userId, onClose, handleLogout }) => {
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [lastUsernameChange, setLastUsernameChange] = useState<Date | null>(null);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'Users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || '');
          setUsername(userData.username || '');
          setPhotoURL(userData.photoURL || '');
          setLastUsernameChange(userData.lastUsernameChange ? new Date(userData.lastUsernameChange) : null);
        }
      } catch {
        setError('حدث خطأ أثناء تحميل البيانات!');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || '');
      }
    });

    if (userId) {
      fetchUserData();
    }

    return () => unsubscribe();
  }, [userId]);

  const validateUsername = (value: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;
    return usernameRegex.test(value);
  };

  const canChangeUsername = () => {
    if (!lastUsernameChange) return true;
    const now = new Date();
    const diffInDays = (now.getTime() - lastUsernameChange.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays >= 14;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase(); // تحويل الحروف إلى صغيرة
    setUsername(value);
  };

  const handleSave = async () => {
    if (!validateUsername(username)) {
      setError('يجب أن يكون اسم المستخدم باللغة الإنجليزية، يحتوي على 4 أحرف على الأقل، ويمكن أن يشمل أرقامًا و (_) فقط.');
      return;
    }

    if (!canChangeUsername()) {
      setError('لا يمكنك تغيير اسم المستخدم إلا مرة كل 14 يومًا.');
      return;
    }

    try {
      const usersRef = collection(db, 'Users');
      const q = query(usersRef, where('username', '==', username.toLowerCase())); // التأكد من أن المقارنة تكون بحروف صغيرة

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingUser = querySnapshot.docs.find((doc) => doc.id !== userId);
        if (existingUser) {
          setError('اسم المستخدم مأخوذ بالفعل، يرجى اختيار اسم آخر.');
          return;
        }
      }

      const userDocRef = doc(db, 'Users', userId);
      await updateDoc(userDocRef, {
        name,
        username: username.toLowerCase(), // حفظ اسم المستخدم بحروف صغيرة
        photoURL,
        lastUsernameChange: new Date().toISOString(),
      });

      setLastUsernameChange(new Date());
      setIsEditing(false);
      setError('');
    } catch {
      setError('حدث خطأ أثناء حفظ البيانات!');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('يرجى اختيار صورة فقط.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة أكبر من المسموح به (5MB).');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">✖</button>
        <h2 className="text-lg font-bold mb-5 text-center">الإعدادات</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700">البريد الإلكتروني:</label>
          <p>{email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">الصورة الشخصية:</label>
          {isEditing ? (
            <input type="file" onChange={handlePhotoUpload} className="w-full px-3 py-2 border rounded" />
          ) : (
            <img src={photoURL || '/default-avatar.jpg'} className="w-16 h-16 rounded-full" />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">الاسم:</label>
          {isEditing ? (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" />
          ) : (
            <p>{name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">اسم المستخدم:</label>
          {isEditing ? (
            <input 
              type="text" 
              value={username} 
              onChange={handleUsernameChange} // استخدام الدالة الجديدة
              className="w-full px-3 py-2 border rounded" 
              disabled={!canChangeUsername()} 
            />
          ) : (
            <p>{username}</p>
          )}
          {!canChangeUsername() && <p className="text-sm text-gray-500">يمكنك تغييره بعد 14 يومًا.</p>}
        </div>

        {isEditing ? (
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-full w-full mb-2">حفظ</button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-full w-full mb-2">تعديل</button>
        )}

        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-full w-full">تسجيل الخروج</button>
      </div>
    </div>
  );
};

export default Settings;
