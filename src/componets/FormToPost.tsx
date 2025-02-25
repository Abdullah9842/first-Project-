

// import React, { useEffect, useRef, useState } from "react";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "./firebase"; 
// import { RiCloseLargeFill } from "react-icons/ri";
// import { auth } from "./firebase"; 
// import SpotifyInput from "./Spotfiy";
// import { BiSolidImageAdd } from "react-icons/bi";
// import { BsSendFill } from "react-icons/bs";

// interface FormToPostProps {
//   onSubmit: (text: string, imageUrl: string | null, spotifyUrl: string) => void;
//   onClose: () => void; 
// }

// const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
//   const [text, setText] = useState<string>("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [spotifyUrl, setSpotifyUrl] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       if (file.size > 5 * 1024 * 1024) { // 5MB الحد الأقصى للحجم
//         setError("حجم الصورة كبير جدًا! الحد الأقصى 5MB.");
//         return;
//       }
//       setImageFile(file);
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
//     setError(""); 

//     try {
//       let uploadedImageUrl = null;

//       if (imageFile) {
//         const filePath = `images/${auth.currentUser?.uid}/${imageFile.name}`;
//         const storageRef = ref(storage, filePath);
//         await uploadBytes(storageRef, imageFile);
//         uploadedImageUrl = await getDownloadURL(storageRef);
//       }

//       // تحقق من صحة رابط سبوتيفاي
//       if (spotifyUrl && !spotifyUrl.includes("spotify.com")) {
//         setError("رابط سبوتيفاي غير صحيح!");
//         setIsLoading(false);
//         return;
//       }

//       onSubmit(text, uploadedImageUrl, spotifyUrl);
//       setText("");
//       setImageFile(null);
//       setImageUrl(null);
//       setSpotifyUrl("");
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
//       className=" z-20 h-full p-6 bg-gray-100 shadow-lg rounded-2xl flex fixed flex-col items-center w-full max-w-sm"
//       onSubmit={handleSubmit}
//     >
//       <div className="flex-col justify-between">
//         <button
//           aria-label="Close form"
//           className="absolute top-5 left-1.5 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
//           onClick={onClose} 
//         >
//           <RiCloseLargeFill className="w-6 h-6" />
//         </button>
//       </div>

//       <h2 className="text-xl mt-2 font-semibold mb-4">What's happening?</h2>

//       {imageUrl && (
//         <div className="w-full mb-4">
// <img
//   src={imageUrl}
//   alt="preview"
//   className="w-full h-auto max-h-80 object-cover rounded-lg"
// />  </div>
//       )}

//       <input
//         ref={inputRef}
//         className="w-full p-4 rounded-lg hover:border-gray-400 focus:outline-none focus:border-pink-500 transition"
//         type="text"
//         placeholder="What's up?"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

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




// import React, { useEffect, useRef, useState } from "react";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { storage, auth } from "./firebase";
// import { RiCloseLargeFill } from "react-icons/ri";
// import { BiSolidImageAdd } from "react-icons/bi";
// import { BsSendFill } from "react-icons/bs";
// import { FaSpotify } from "react-icons/fa";

// interface FormToPostProps {
//   onSubmit: (text: string, imageUrl: string | null, spotifyUrl: string) => void;
//   onClose: () => void;
// }

// const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
//   const [text, setText] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [spotifyUrl, setSpotifyUrl] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState("");
//   const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);  // إضافة القفل
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) {
//       const file = e.target.files[0];
//       if (file.size > 5 * 1024 * 1024) {
//         setError("حجم الصورة كبير جدًا! الحد الأقصى 5MB.");
//         return;
//       }
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImageUrl(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageRemove = () => {
//     setImageFile(null);
//     setImageUrl(null);
//   };

//   const handleSpotifyToggle = () => {
//     setIsSpotifyOpen((prev) => !prev);
//     if (isSpotifyOpen) {
//       setSpotifyUrl("");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (isSubmitting) return;  // إذا كان هناك إرسال قيد التنفيذ، لا تقم بالإرسال مرة أخرى

//     setIsSubmitting(true);  // تفعيل القفل
//     setIsLoading(true);
//     setError("");

//     try {
//       let uploadedImageUrl = imageUrl;

//       if (imageFile) {
//         const filePath = `images/${auth.currentUser?.uid}/${imageFile.name}`;
//         const storageRef = ref(storage, filePath);
//         const uploadTask = uploadBytesResumable(storageRef, imageFile);

//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             setProgress(progress);
//           },
//           (error) => {
//             console.error(error);
//             setError("حدث خطأ أثناء التحميل. الرجاء المحاولة مرة أخرى.");
//             setIsLoading(false);
//             setIsSubmitting(false);  // إلغاء القفل في حالة الخطأ
//           },
//           async () => {
//             uploadedImageUrl = await getDownloadURL(storageRef);
//             await onSubmit(text, uploadedImageUrl, spotifyUrl);  // تأكد من أن العملية تنتظر الإرسال
//             resetForm();
//           }
//         );
//       } else {
//         await onSubmit(text, uploadedImageUrl, spotifyUrl);  // تأكد من أن العملية تنتظر الإرسال
//         resetForm();
//       }
//     } catch {
//       setError("حدث خطأ أثناء إرسال النموذج. الرجاء المحاولة مرة أخرى.");
//       setIsLoading(false);
//       setIsSubmitting(false);  // إلغاء القفل في حالة الخطأ
//     }
//   };

//   const resetForm = () => {
//     setText("");
//     setImageFile(null);
//     setImageUrl(null);
//     setSpotifyUrl("");
//     onClose();
//     setIsLoading(false);
//     setIsSubmitting(false);  // إلغاء القفل بعد إعادة تعيين النموذج
//   };

//   const isSubmitDisabled = isLoading || (!text.trim() && !imageFile && !spotifyUrl.trim());

//   return (
//     <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50  modal">
//       <form
//         className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-md flex flex-col relative transition-all duration-500 ease-in-out transform hover:scale-105"
//         onSubmit={handleSubmit}
//       >
//         {isLoading && (
//           <div className="progress-bar animate-pulse">
//             <div
//               className="progress bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         )}

//         <button
//           aria-label="Close form"
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all"
//           onClick={onClose}
//         >
//           <RiCloseLargeFill className="w-6 h-6" />
//         </button>

//         <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">ماذا يجول في خاطرك؟</h2>

//         {imageUrl && (
//           <div className="relative w-full mb-4 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all">
//             <img src={imageUrl} alt="preview" className="w-full h-auto max-h-80 object-cover" />
//             <button
//               className="absolute top-2 right-2 bg-white text-gray-500 rounded-full p-2 hover:bg-gray-200 shadow-md hover:scale-110 transition-all"
//               onClick={handleImageRemove}
//             >
//               <RiCloseLargeFill className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         <textarea
//           ref={inputRef}
//           className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-lg placeholder-gray-400 transition-all"
//           placeholder="اكتب شيئًا..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />

//         <div className="flex gap-4 mb-4 items-center justify-between">
//           {!isSpotifyOpen && (
//             <button
//               type="button"
//               className="text-3xl text-green-500 hover:text-green-400 transform hover:scale-110 transition-all"
//               onClick={handleSpotifyToggle}
//             >
//               <FaSpotify />
//             </button>
//           )}

//           {isSpotifyOpen && (
//             <div className="flex gap-2 items-center transition-all duration-300 ease-in-out">
//               <input
//                 type="text"
//                 className="p-2 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="أدخل رابط الأغنية"
//                 value={spotifyUrl}
//                 onChange={(e) => setSpotifyUrl(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="text-2xl text-red-500 hover:text-red-400"
//                 onClick={handleSpotifyToggle}
//               >
//                 <RiCloseLargeFill className="w-6 h-6" />
//               </button>
//             </div>
//           )}

//           {!imageUrl && (
//             <label className="cursor-pointer text-gray-600 hover:text-blue-500 transform hover:scale-105 transition-all">
//               <BiSolidImageAdd className="text-3xl" />
//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={handleFileChange}
//                 accept="image/*, video/*"
//               />
//             </label>
//           )}

//           <button
//             className="p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition flex-shrink-0"
//             type="submit"
//             disabled={isSubmitDisabled}
//           >
//             {isLoading ? "جاري التحميل..." : <BsSendFill className="text-xl" />}
//           </button>
//         </div>

//         {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default FormToPost;


// import React, { useEffect, useRef, useState } from "react";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { storage, auth } from "./firebase";
// import { RiCloseLargeFill } from "react-icons/ri";
// import { BiSolidImageAdd } from "react-icons/bi";
// import { BsSendFill } from "react-icons/bs";
// import { FaSpotify } from "react-icons/fa";
// import { FaMicrophone } from "react-icons/fa";

// interface FormToPostProps {
//   onSubmit: (text: string, imageUrl: string | null, spotifyUrl: string, audioUrl: string | null) => void;
//   onClose: () => void;
// }

// const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
//   const [text, setText] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [spotifyUrl, setSpotifyUrl] = useState("");
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState("");
//   const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const inputRef = useRef<HTMLTextAreaElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) {
//       const file = e.target.files[0];
//       if (file.size > 5 * 1024 * 1024) {
//         setError("حجم الملف كبير جدًا! الحد الأقصى 5MB.");
//         return;
//       }
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImageUrl(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageRemove = () => {
//     setImageFile(null);
//     setImageUrl(null);
//   };

//   const handleAudioRemove = () => {
//     setAudioBlob(null);
//     setAudioUrl(null);
//   };

//   const handleSpotifyToggle = () => {
//     setIsSpotifyOpen((prev) => !prev);
//     if (isSpotifyOpen) {
//       setSpotifyUrl("");
//     }
//   };

//   const handleStartRecording = async () => {
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       setError("متصفحك لا يدعم تسجيل الصوت.");
//       return;
//     }

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       const audioChunks: BlobPart[] = [];
//       mediaRecorder.ondataavailable = (event) => {
//         audioChunks.push(event.data);
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
//         setAudioBlob(audioBlob);
//         setAudioUrl(URL.createObjectURL(audioBlob));
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch {
//       setError("حدث خطأ أثناء بدء التسجيل.");
//     }
//   };

//   const handleStopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     setIsRecording(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (isSubmitting) return;

//     setIsSubmitting(true);
//     setIsLoading(true);
//     setError("");

//     try {
//       let uploadedImageUrl = imageUrl;
//       let uploadedAudioUrl = audioUrl;

//       if (imageFile) {
//         const filePath = `images/${auth.currentUser?.uid}/${imageFile.name}`;
//         const storageRef = ref(storage, filePath);
//         const uploadTask = uploadBytesResumable(storageRef, imageFile);

//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             setProgress(progress);
//           },
//           (error) => {
//             console.error(error);
//             setError("حدث خطأ أثناء التحميل. الرجاء المحاولة مرة أخرى.");
//             setIsLoading(false);
//             setIsSubmitting(false);
//           },
//           async () => {
//             uploadedImageUrl = await getDownloadURL(storageRef);
//             await onSubmit(text, uploadedImageUrl, spotifyUrl, uploadedAudioUrl);
//             resetForm();
//           }
//         );
//       } else if (audioBlob) {
//         const filePath = `audio/${auth.currentUser?.uid}/${Date.now()}.wav`;
//         const storageRef = ref(storage, filePath);
//         const uploadTask = uploadBytesResumable(storageRef, audioBlob);

//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             setProgress(progress);
//           },
//           (error) => {
//             console.error(error);
//             setError("حدث خطأ أثناء التحميل. الرجاء المحاولة مرة أخرى.");
//             setIsLoading(false);
//             setIsSubmitting(false);
//           },
//           async () => {
//             uploadedAudioUrl = await getDownloadURL(storageRef);
//             await onSubmit(text, uploadedImageUrl, spotifyUrl, uploadedAudioUrl);
//             resetForm();
//           }
//         );
//       } else {
//         await onSubmit(text, uploadedImageUrl, spotifyUrl, uploadedAudioUrl);
//         resetForm();
//       }
//     } catch {
//       setError("حدث خطأ أثناء إرسال النموذج. الرجاء المحاولة مرة أخرى.");
//       setIsLoading(false);
//       setIsSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setText("");
//     setImageFile(null);
//     setImageUrl(null);
//     setSpotifyUrl("");
//     setAudioBlob(null);
//     setAudioUrl(null);
//     onClose();
//     setIsLoading(false);
//     setIsSubmitting(false);
//   };

//   const isSubmitDisabled = isLoading || (!text.trim() && !imageFile && !spotifyUrl.trim() && !audioBlob);

//   return (
//     <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50 modal">
//       <form
//         className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-md flex flex-col relative transition-all duration-500 ease-in-out transform hover:scale-105"
//         onSubmit={handleSubmit}
//       >
//         {isLoading && (
//           <div className="progress-bar animate-pulse">
//             <div
//               className="progress bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         )}

//         <button
//           aria-label="Close form"
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all"
//           onClick={onClose}
//         >
//           <RiCloseLargeFill className="w-6 h-6" />
//         </button>

//         <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">ماذا يجول في خاطرك؟</h2>

//         {imageUrl && (
//           <div className="relative w-full mb-4 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all">
//             <img src={imageUrl} alt="preview" className="w-full h-auto max-h-80 object-cover" />
//             <button
//               className="absolute top-2 right-2 bg-white text-gray-500 rounded-full p-2 hover:bg-gray-200 shadow-md hover:scale-110 transition-all"
//               onClick={handleImageRemove}
//             >
//               <RiCloseLargeFill className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         {audioUrl && (
//           <div className="relative w-full mb-4 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all">
//             <audio controls src={audioUrl} className="w-full" />
//             <button
//               className="absolute top-2 right-2 bg-white text-gray-500 rounded-full p-2 hover:bg-gray-200 shadow-md hover:scale-110 transition-all"
//               onClick={handleAudioRemove}
//             >
//               <RiCloseLargeFill className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         <textarea
//           ref={inputRef}
//           className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-lg placeholder-gray-400 transition-all"
//           placeholder="اكتب شيئًا..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />

//         <div className="flex gap-4 mb-4 items-center justify-between">
//           {!isSpotifyOpen && (
//             <button
//               type="button"
//               className="text-3xl text-green-500 hover:text-green-400 transform hover:scale-110 transition-all"
//               onClick={handleSpotifyToggle}
//             >
//               <FaSpotify />
//             </button>
//           )}

//           {isSpotifyOpen && (
//             <div className="flex gap-2 items-center transition-all duration-300 ease-in-out">
//               <input
//                 type="text"
//                 className="p-2 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="أدخل رابط الأغنية"
//                 value={spotifyUrl}
//                 onChange={(e) => setSpotifyUrl(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="text-2xl text-red-500 hover:text-red-400"
//                 onClick={handleSpotifyToggle}
//               >
//                 <RiCloseLargeFill className="w-6 h-6" />
//               </button>
//             </div>
//           )}

//           {!imageUrl && (
//             <label className="cursor-pointer text-gray-600 hover:text-blue-500 transform hover:scale-105 transition-all">
//               <BiSolidImageAdd className="text-3xl" />
//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={handleFileChange}
//                 accept="image/*, video/*"
//               />
//             </label>
//           )}

//           <button
//             type="button"
//             className={`text-3xl ${isRecording ? "text-red-500" : "text-gray-600"} hover:text-blue-500 transform hover:scale-105 transition-all`}
//             onClick={isRecording ? handleStopRecording : handleStartRecording}
//           >
//             <FaMicrophone />
//           </button>

//           <button
//             className="p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition flex-shrink-0"
//             type="submit"
//             disabled={isSubmitDisabled}
//           >
//             {isLoading ? "جاري التحميل..." : <BsSendFill className="text-xl" />}
//           </button>
//         </div>

//         {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
//       </form>
//     </div>
//   );
// };

// // export default FormToPost;
// import React, { useEffect, useRef, useState } from "react";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { storage, auth } from "./firebase";
// import { RiCloseLargeFill } from "react-icons/ri";
// import { BiSolidImageAdd } from "react-icons/bi";
// import { BsSendFill } from "react-icons/bs";
// import { FaSpotify } from "react-icons/fa";
// import { FaMicrophone } from "react-icons/fa";
// import { Timestamp } from "firebase/firestore";

// interface FormToPostProps {
//   onSubmit: (text: string, imageUrl: string | null, spotifyUrl: string, audioUrl: string | null,timestamp:string) => void;
//   onClose: () => void;
// }

// const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
//   const [text, setText] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [spotifyUrl, setSpotifyUrl] = useState("");
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState("");
//   const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const inputRef = useRef<HTMLTextAreaElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) {
//       const file = e.target.files[0];
//       if (file.size > 5 * 1024 * 1024) {
//         setError("حجم الملف كبير جدًا! الحد الأقصى 5MB.");
//         return;
//       }
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImageUrl(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageRemove = () => {
//     setImageFile(null);
//     setImageUrl(null);
//   };

//   const handleAudioRemove = () => {
//     setAudioBlob(null);
//     setAudioUrl(null);
//   };

//   const handleSpotifyToggle = () => {
//     setIsSpotifyOpen((prev) => !prev);
//     if (isSpotifyOpen) {
//       setSpotifyUrl("");
//     }
//   };

//   const handleStartRecording = async () => {
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       setError("متصفحك لا يدعم تسجيل الصوت.");
//       return;
//     }

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       const audioChunks: BlobPart[] = [];
//       mediaRecorder.ondataavailable = (event) => {
//         audioChunks.push(event.data);
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
//         setAudioBlob(audioBlob);
//         setAudioUrl(URL.createObjectURL(audioBlob));
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch {
//       setError("حدث خطأ أثناء بدء التسجيل.");
//     }
//   };

//   const handleStopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     setIsRecording(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (isSubmitting) return;

//     setIsSubmitting(true);
//     setIsLoading(true);
//     setError("");

//     try {
//       let uploadedImageUrl = imageUrl;
//       let uploadedAudioUrl = audioUrl;
//       const timestamp = Timestamp.fromDate(new Date()); // تخزين كـ Timestamp

//       if (imageFile) {
//         const filePath = `images/${auth.currentUser?.uid}/${imageFile.name}`;
//         const storageRef = ref(storage, filePath);
//         const uploadTask = uploadBytesResumable(storageRef, imageFile);

//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             setProgress(progress);
//           },
//           (error) => {
//             console.error(error);
//             setError("حدث خطأ أثناء التحميل. الرجاء المحاولة مرة أخرى.");
//             setIsLoading(false);
//             setIsSubmitting(false);
//           },
//           async () => {
//             uploadedImageUrl = await getDownloadURL(storageRef);
//             await onSubmit(text, uploadedImageUrl, spotifyUrl, uploadedAudioUrl,timestamp);
//             resetForm();
//           }
//         );
//       } else if (audioBlob) {
//         const filePath = `audio/${auth.currentUser?.uid}/${Date.now()}.wav`;
//         const storageRef = ref(storage, filePath);
//         const uploadTask = uploadBytesResumable(storageRef, audioBlob);

//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             setProgress(progress);
//           },
//           (error) => {
//             console.error(error);
//             setError("حدث خطأ أثناء التحميل. الرجاء المحاولة مرة أخرى.");
//             setIsLoading(false);
//             setIsSubmitting(false);
//           },
//           async () => {
//             uploadedAudioUrl = await getDownloadURL(storageRef);
//             await onSubmit(text, uploadedImageUrl, spotifyUrl, uploadedAudioUrl,timestamp);
//             resetForm();
//           }
//         );
//       } else {
//         await onSubmit(text, uploadedImageUrl, spotifyUrl, uploadedAudioUrl ,timestamp);
//         resetForm();
//       }
//     } catch {
//       setError("حدث خطأ أثناء إرسال النموذج. الرجاء المحاولة مرة أخرى.");
//       setIsLoading(false);
//       setIsSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setText("");
//     setImageFile(null);
//     setImageUrl(null);
//     setSpotifyUrl("");
//     setAudioBlob(null);
//     setAudioUrl(null);
//     onClose();
//     setIsLoading(false);
//     setIsSubmitting(false);
//   };

//   const isSubmitDisabled = isLoading || (!text.trim() && !imageFile && !spotifyUrl.trim() && !audioBlob);

//   return (
//     <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50 modal">
//       <form
//         className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-md flex flex-col relative transition-all duration-500 ease-in-out transform hover:scale-105"
//         onSubmit={handleSubmit}
//       >
//         {isLoading && (
//           <div className="progress-bar animate-pulse">
//             <div
//               className="progress bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         )}

//         <button
//           aria-label="Close form"
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all"
//           onClick={onClose}
//         >
//           <RiCloseLargeFill className="w-6 h-6" />
//         </button>

//         <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">ماذا يجول في خاطرك؟</h2>

//         {imageUrl && (
//           <div className="relative w-full mb-4 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all">
//             <img src={imageUrl} alt="preview" className="w-full h-auto max-h-80 object-cover" />
//             <button
//               className="absolute top-2 right-2 bg-white text-gray-500 rounded-full p-2 hover:bg-gray-200 shadow-md hover:scale-110 transition-all"
//               onClick={handleImageRemove}
//             >
//               <RiCloseLargeFill className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         {audioUrl && (
//           <div className="relative w-full mb-4 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all">
//             <audio controls src={audioUrl} className="w-full" />
//             <button
//               className="absolute top-2 right-2 bg-white text-gray-500 rounded-full p-2 hover:bg-gray-200 shadow-md hover:scale-110 transition-all"
//               onClick={handleAudioRemove}
//             >
//               <RiCloseLargeFill className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         <textarea
//           ref={inputRef}
//           className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-lg placeholder-gray-400 transition-all"
//           placeholder="اكتب شيئًا..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />

//         <div className="flex gap-4 mb-4 items-center justify-between">
//           {!isSpotifyOpen && (
//             <button
//               type="button"
//               className="text-3xl text-green-500 hover:text-green-400 transform hover:scale-110 transition-all"
//               onClick={handleSpotifyToggle}
//             >
//               <FaSpotify />
//             </button>
//           )}

//           {isSpotifyOpen && (
//             <div className="flex gap-2 items-center transition-all duration-300 ease-in-out">
//               <input
//                 type="text"
//                 className="p-2 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="أدخل رابط الأغنية"
//                 value={spotifyUrl}
//                 onChange={(e) => setSpotifyUrl(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="text-2xl text-red-500 hover:text-red-400"
//                 onClick={handleSpotifyToggle}
//               >
//                 <RiCloseLargeFill className="w-6 h-6" />
//               </button>
//             </div>
//           )}

//           {!imageUrl && (
//             <label className="cursor-pointer text-gray-600 hover:text-blue-500 transform hover:scale-105 transition-all">
//               <BiSolidImageAdd className="text-3xl" />
//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={handleFileChange}
//                 accept="image/*, video/*"
//               />
//             </label>
//           )}

//           <button
//             type="button"
//             className={`text-3xl ${isRecording ? "text-red-500" : "text-gray-600"} hover:text-blue-500 transform hover:scale-105 transition-all`}
//             onClick={isRecording ? handleStopRecording : handleStartRecording}
//           >
//             <FaMicrophone />
//           </button>

//           <button
//             className="p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition flex-shrink-0"
//             type="submit"
//             disabled={isSubmitDisabled}
//           >
//             {isLoading ? "جاري التحميل..." : <BsSendFill className="text-xl" />}
//           </button>
//         </div>

//         {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default FormToPost;



import React, { useEffect, useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth } from "./firebase";
import { Timestamp } from "firebase/firestore"; // استيراد Timestamp
import { RiCloseLargeFill } from "react-icons/ri";
import { BiSolidImageAdd } from "react-icons/bi";
import { BsSendFill } from "react-icons/bs";
import { FaSpotify } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";

interface FormToPostProps {
  onSubmit: (text: string, imageUrl: string | null, spotifyUrl: string, audioUrl: string | null, timestamp: Timestamp) => void; // تعديل لتقبل Timestamp
  onClose: () => void;
}

const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("حجم الملف كبير جدًا! الحد الأقصى 5MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImageUrl(null);
  };

  const handleAudioRemove = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleSpotifyToggle = () => {
    setIsSpotifyOpen((prev) => !prev);
    if (isSpotifyOpen) {
      setSpotifyUrl("");
    }
  };

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("متصفحك لا يدعم تسجيل الصوت.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setError("حدث خطأ أثناء بدء التسجيل.");
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setIsLoading(true);
    setError("");

    try {
      let uploadedImageUrl = imageUrl;
      let uploadedAudioUrl = audioUrl;
      const timestamp = Timestamp.fromDate(new Date()); // تخزين كـ Timestamp

      if (imageFile) {
        const filePath = `images/${auth.currentUser?.uid}/${imageFile.name}`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            console.error(error);
            setError("حدث خطأ أثناء التحميل. الرجاء المحاولة مرة أخرى.");
            setIsLoading(false);
            setIsSubmitting(false);
          },
          async () => {
            uploadedImageUrl = await getDownloadURL(storageRef);
            await onSubmit(text, uploadedImageUrl, spotifyUrl, uploadedAudioUrl, timestamp);
            resetForm();
          }
        );
      } else if (audioBlob) {
        const filePath = `audio/${auth.currentUser?.uid}/${Date.now()}.wav`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, audioBlob);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            console.error(error);
            setError("حدث خطأ أثناء التحميل. الرجاء المحاولة مرة أخرى.");
            setIsLoading(false);
            setIsSubmitting(false);
          },
          async () => {
            uploadedAudioUrl = await getDownloadURL(storageRef);
            await onSubmit(text, uploadedImageUrl, spotifyUrl, uploadedAudioUrl, timestamp);
            resetForm();
          }
        );
      } else {
        await onSubmit(text, uploadedImageUrl, spotifyUrl, uploadedAudioUrl, timestamp);
        resetForm();
      }
    } catch {
      setError("حدث خطأ أثناء إرسال النموذج. الرجاء المحاولة مرة أخرى.");
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setText("");
    setImageFile(null);
    setImageUrl(null);
    setSpotifyUrl("");
    setAudioBlob(null);
    setAudioUrl(null);
    onClose();
    setIsLoading(false);
    setIsSubmitting(false);
  };

  const isSubmitDisabled = isLoading || (!text.trim() && !imageFile && !spotifyUrl.trim() && !audioBlob);

  return (
    <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50 modal">
      <form
        className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-md flex flex-col relative transition-all duration-500 ease-in-out transform hover:scale-105"
        onSubmit={handleSubmit}
      >
        {isLoading && (
          <div className="progress-bar animate-pulse">
            <div
              className="progress bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button
          aria-label="Close form"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all"
          onClick={onClose}
        >
          <RiCloseLargeFill className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">ماذا يجول في خاطرك؟</h2>

        {imageUrl && (
          <div className="relative w-full mb-4 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all">
            <img src={imageUrl} alt="preview" className="w-full h-auto max-h-80 object-cover" />
            <button
              className="absolute top-2 right-2 bg-white text-gray-500 rounded-full p-2 hover:bg-gray-200 shadow-md hover:scale-110 transition-all"
              onClick={handleImageRemove}
            >
              <RiCloseLargeFill className="w-5 h-5" />
            </button>
          </div>
        )}

        {audioUrl && (
          <div className="relative w-full mb-4 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all">
            <audio controls src={audioUrl} className="w-full" />
            <button
              className="absolute top-2 right-2 bg-white text-gray-500 rounded-full p-2 hover:bg-gray-200 shadow-md hover:scale-110 transition-all"
              onClick={handleAudioRemove}
            >
              <RiCloseLargeFill className="w-5 h-5" />
            </button>
          </div>
        )}

        <textarea
          ref={inputRef}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-lg placeholder-gray-400 transition-all"
          placeholder="اكتب شيئًا..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex gap-4 mb-4 items-center justify-between">
          {!isSpotifyOpen && (
            <button
              type="button"
              className="text-3xl text-green-500 hover:text-green-400 transform hover:scale-110 transition-all"
              onClick={handleSpotifyToggle}
            >
              <FaSpotify />
            </button>
          )}

          {isSpotifyOpen && (
            <div className="flex gap-2 items-center transition-all duration-300 ease-in-out">
              <input
                type="text"
                className="p-2 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="أدخل رابط الأغنية"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
              />
              <button
                type="button"
                className="text-2xl text-red-500 hover:text-red-400"
                onClick={handleSpotifyToggle}
              >
                <RiCloseLargeFill className="w-6 h-6" />
              </button>
            </div>
          )}

          {!imageUrl && (
            <label className="cursor-pointer text-gray-600 hover:text-blue-500 transform hover:scale-105 transition-all">
              <BiSolidImageAdd className="text-3xl" />
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*, video/*"
              />
            </label>
          )}

          <button
            type="button"
            className={`text-3xl ${isRecording ? "text-red-500" : "text-gray-600"} hover:text-blue-500 transform hover:scale-105 transition-all`}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
          >
            <FaMicrophone />
          </button>

          <button
            className="p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition flex-shrink-0"
            type="submit"
            disabled={isSubmitDisabled}
          >
            {isLoading ? "جاري التحميل..." : <BsSendFill className="text-xl" />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default FormToPost;