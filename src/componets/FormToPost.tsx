

// import React, { useEffect, useRef, useState } from "react";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "./firebase"; // تأكد من استيراد storage
// import { RiCloseLargeFill } from "react-icons/ri"; // أيقونة الإغلاق
// import { auth } from "./firebase"; // تأكد من استيراد auth
// import SpotifyInput from "./Spotfiy";
// import { BiSolidImageAdd } from "react-icons/bi";
// import { BsSendFill } from "react-icons/bs";

// interface FormToPostProps {
//   onSubmit: (text: string, imageUrl: string | null, spotifyUrl: string) => void;
//   onClose: () => void; // دالة الإغلاق
// }

// const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
//   const [text, setText] = useState<string>("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [spotifyUrl, setSpotifyUrl] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Automatically focus on the input when the component mounts
//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setImageFile(file);

//       // عرض معاينة الصورة
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const result = reader.result;
//         if (typeof result === "string") {
//           setImageUrl(result);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(""); // مسح الأخطاء السابقة

//     try {
//       let uploadedImageUrl = null;

//       // رفع الصورة إلى Firebase Storage
//       if (imageFile) {
//         const filePath = `images/${auth.currentUser?.uid}/${imageFile.name}`;
//         const storageRef = ref(storage, filePath);

//         await uploadBytes(storageRef, imageFile);
//         uploadedImageUrl = await getDownloadURL(storageRef);
//       }

//       // استدعاء دالة onSubmit مع البيانات
//       onSubmit(text, uploadedImageUrl, spotifyUrl);

//       // مسح الحقول بعد الإرسال
//       setText("");
//       setImageFile(null);
//       setImageUrl(null);
//       setSpotifyUrl("");

//       // إغلاق النموذج بعد الإرسال
//       onClose();
//     } catch (error) {
//       console.error("Error submitting form: ", error);
//       setError("حدث خطأ أثناء إرسال النموذج. الرجاء المحاولة مرة أخرى.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form
//       className="top-0 left-0 h-full p-6 bg-gray-100 shadow-lg rounded-2xl flex fixed flex-col items-center w-full max-w-sm"
//       onSubmit={handleSubmit}
//     >
//       <div className="flex-col justify-between">
//         <button
//           aria-label="Close form"
//           className="absolute top-5 left-1.5 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
//           onClick={onClose} // استدعاء دالة onClose عند النقر
//         >
//           <RiCloseLargeFill className="w-6 h-6" />
//         </button>
//       </div>

//       <h2 className="text-xl mt-2 font-semibold mb-4">What's happening?</h2>

//       {/* عرض الصورة المرفوعة أعلى المدخلات */}
//       {imageUrl && (
//         <div className="w-full mb-4">
//           <img src={imageUrl} alt="preview" className="w-full h-auto object-cover rounded-lg" />
//         </div>
//       )}

//       <input
//         ref={inputRef} // Attach the ref to the input field
//         className="w-full p-4 rounded-lg hover:border-gray-400 focus:outline-none focus:border-pink-500 transition"
//         type="text"
//         placeholder="What's up?"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       {/* هنا نضع الزر لرفع الصورة وسبوتيفاي تحت المعاينة */}
//       <div className="flex bg-gray-500 w-full items-center gap-3 p-2 rounded-lg shadow-sm border border-gray-300 mt-4">
//         {!imageUrl && (
//           <label className="cursor-pointer hover:text-gray-600 transition">
//             <BiSolidImageAdd className="text-white text-2xl" />
//             <input
//               type="file"
//               className="hidden"
//               onChange={handleFileChange}
//               accept="image/*, video/*"
//               aria-label="image"
//             />
//           </label>
//         )}

//         {/* زر سبوتيفاي + إدخال الرابط */}
//         <div className="flex items-center gap-2 flex-1">
//           <SpotifyInput
//             spotifyUrl={spotifyUrl}
//             setSpotifyUrl={setSpotifyUrl}
//           />
//           <button
//             className="p-4 rounded-4xl bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
//             type="submit"
//             disabled={isLoading}
//           >
//             {isLoading ? "Submitting..." : <BsSendFill />}
//           </button>
//         </div>
//       </div>

//       {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//     </form>
//   );
// };

// export default FormToPost;




import React, { useEffect, useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; 
import { RiCloseLargeFill } from "react-icons/ri";
import { auth } from "./firebase"; 
import SpotifyInput from "./Spotfiy";
import { BiSolidImageAdd } from "react-icons/bi";
import { BsSendFill } from "react-icons/bs";

interface FormToPostProps {
  onSubmit: (text: string, imageUrl: string | null, spotifyUrl: string) => void;
  onClose: () => void; 
}

const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
  const [text, setText] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB الحد الأقصى للحجم
        setError("حجم الصورة كبير جدًا! الحد الأقصى 5MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setImageUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); 

    try {
      let uploadedImageUrl = null;

      if (imageFile) {
        const filePath = `images/${auth.currentUser?.uid}/${imageFile.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(storageRef);
      }

      // تحقق من صحة رابط سبوتيفاي
      if (spotifyUrl && !spotifyUrl.includes("spotify.com")) {
        setError("رابط سبوتيفاي غير صحيح!");
        setIsLoading(false);
        return;
      }

      onSubmit(text, uploadedImageUrl, spotifyUrl);
      setText("");
      setImageFile(null);
      setImageUrl(null);
      setSpotifyUrl("");
      onClose();
    } catch (error) {
      console.error("Error submitting form: ", error);
      setError("حدث خطأ أثناء إرسال النموذج. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="top-0 left-0 h-full p-6 bg-gray-100 shadow-lg rounded-2xl flex fixed flex-col items-center w-full max-w-sm"
      onSubmit={handleSubmit}
    >
      <div className="flex-col justify-between">
        <button
          aria-label="Close form"
          className="absolute top-5 left-1.5 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
          onClick={onClose} 
        >
          <RiCloseLargeFill className="w-6 h-6" />
        </button>
      </div>

      <h2 className="text-xl mt-2 font-semibold mb-4">What's happening?</h2>

      {imageUrl && (
        <div className="w-full mb-4">
<img
  src={imageUrl}
  alt="preview"
  className="w-full h-auto max-h-80 object-cover rounded-lg"
/>  </div>
      )}

      <input
        ref={inputRef}
        className="w-full p-4 rounded-lg hover:border-gray-400 focus:outline-none focus:border-pink-500 transition"
        type="text"
        placeholder="What's up?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex bg-gray-500 w-full items-center gap-3 p-2 rounded-lg shadow-sm border border-gray-300 mt-4">
        {!imageUrl && (
          <label className="cursor-pointer hover:text-gray-600 transition">
            <BiSolidImageAdd className="text-white text-2xl" />
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*, video/*"
              aria-label="image"
            />
          </label>
        )}

        <div className="flex items-center gap-2 flex-1">
          <SpotifyInput
            spotifyUrl={spotifyUrl}
            setSpotifyUrl={setSpotifyUrl}
          />
          <button
            className="p-4 rounded-4xl bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : <BsSendFill />}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
    </form>
  );
};

export default FormToPost;
