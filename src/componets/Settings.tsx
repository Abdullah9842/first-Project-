import React, { useState, useEffect } from "react";
import { db, auth, storage } from "./firebase";
import {
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

interface SettingsProps {
  userId: string;
  onClose: () => void;
  handleLogout: () => Promise<void>;
  onProfileUpdate?: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  userId,
  onClose,
  handleLogout,
  onProfileUpdate,
}) => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [lastUsernameChange, setLastUsernameChange] = useState<Date | null>(
    null
  );
  const [isImageChanged, setIsImageChanged] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "Users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || "");
          setUsername(userData.username || "");
          setPhotoURL(userData.photoURL || "");
          setLastUsernameChange(
            userData.lastUsernameChange
              ? new Date(userData.lastUsernameChange)
              : null
          );
          setEmail(userData.email || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("حدث خطأ أثناء تحميل البيانات!");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || "");
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
    const diffInDays =
      (now.getTime() - lastUsernameChange.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays >= 0;
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const MAX_SIZE = 800;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedDataUrl);
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
    });
  };

  const uploadImageToStorage = async (
    imageDataUrl: string
  ): Promise<string> => {
    const imageRef = ref(storage, `profile_pictures/${userId}_${Date.now()}`);
    await uploadString(imageRef, imageDataUrl, "data_url");
    return getDownloadURL(imageRef);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        setError("");

        if (!file.type.startsWith("image/")) {
          setError("يرجى اختيار صورة فقط.");
          return;
        }

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
          console.log("جاري ضغط الصورة...");
        }

        const compressedImage = await compressImage(file);
        setPhotoURL(compressedImage);
        setIsImageChanged(true);
      } catch (error) {
        console.error("Error processing image:", error);
        setError("حدث خطأ أثناء معالجة الصورة");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!validateUsername(username)) {
      setError(
        "يجب أن يكون اسم المستخدم باللغة الإنجليزية، يحتوي على 4 أحرف على الأقل، ويمكن أن يشمل أرقامًا و (_) فقط."
      );
      return;
    }

    if (!canChangeUsername()) {
      setError("لا يمكنك تغيير اسم المستخدم إلا مرة كل 14 يومًا.");
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(db, "Users");
      const q = query(
        usersRef,
        where("username", "==", username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingUser = querySnapshot.docs.find(
          (doc) => doc.id !== userId
        );
        if (existingUser) {
          setError("اسم المستخدم مأخوذ بالفعل، يرجى اختيار اسم آخر.");
          return;
        }
      }

      let finalPhotoURL = photoURL;
      if (isImageChanged && photoURL) {
        finalPhotoURL = await uploadImageToStorage(photoURL);
      }

      const userDocRef = doc(db, "Users", userId);
      const updateData = {
        name,
        username: username.toLowerCase(),
        photoURL: finalPhotoURL,
        lastUsernameChange: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userDocRef, updateData);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: finalPhotoURL,
        });
      }

      setLastUsernameChange(new Date());
      setError("");
      setIsImageChanged(false);

      alert("تم حفظ التغييرات بنجاح!");
      onProfileUpdate?.();
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("حدث خطأ أثناء حفظ البيانات!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">الإعدادات</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={photoURL || "default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </label>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المستخدم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-full w-full hover:bg-blue-600 transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>

          <div className="flex justify-between gap-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-full w-full hover:bg-gray-600 transition disabled:bg-gray-400"
              disabled={loading}
            >
              إغلاق
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full w-full hover:bg-red-600 transition disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "جاري التحميل..." : "تسجيل الخروج"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
