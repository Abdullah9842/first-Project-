
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // تأكد من استيراد storage
import { RiCloseLargeFill } from "react-icons/ri"; // أيقونة الإغلاق
import { BiSolidImageAdd } from "react-icons/bi";

interface FormToPostProps {
  onSubmit: (text: string, imageUrl: string | null, spotifyUrl: string) => void;
  onClose: () => void; // دالة الإغلاق
}

const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
  const [text, setText] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);

      // عرض معاينة الصورة
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

    try {
      let uploadedImageUrl = null;

      // رفع الصورة إلى Firebase Storage
      if (imageFile) {
        const filePath = `${"gs://jadeksa-69140.firebasestorage.app/images"}/${imageFile.name}`; // المسار الكامل للملف
        const storageRef = ref(storage, filePath);

        await uploadBytes(storageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(storageRef);
      }

      // استدعاء دالة onSubmit مع البيانات
      onSubmit(text, uploadedImageUrl, spotifyUrl);

      // مسح الحقول بعد الإرسال
      setText("");
      setImageFile(null);
      setImageUrl(null);
      setSpotifyUrl("");

      // إغلاق النموذج بعد الإرسال
      onClose();
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className=" top-0 left-0 h-full p-6 bg-gray-100 shadow-lg rounded-2xl flex fixed flex-col items-center w-full max-w-sm"
      onSubmit={handleSubmit}
    >
      <button
        aria-label="Close form"
        className="absolute top-5 right-4 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
        onClick={onClose} // استدعاء دالة onClose عند النقر
      >
        <RiCloseLargeFill className="w-6 h-6" />
      </button>
      <h2 className="text-xl font-semibold mb-4">What's happening?</h2>

      {/* <input
        className="mb-4 w-full border p-2 rounded-lg hover:border-gray-400 focus:outline-none focus:border-pink-500 transition"
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        aria-label="image"
      /> */}

       

      {imageUrl && (
        <div className="mb-4">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full  h-72 object-cover rounded-lg"
          />
        </div>
      )}

      <input
        className="mb-4 w-full border p-2 rounded-lg hover:border-gray-400 focus:outline-none focus:border-pink-500 transition"
        type="text"
        placeholder="What's up?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />




         <label className="flex flex-col items-center justify-center bg-gray-100   border-gray-400 rounded-lg cursor-pointer hover:bg-gray-200">
      <BiSolidImageAdd className="text-gray-500 text-4xl mb-2" />
      {/* <span className="text-gray-600">اضغط لرفع صورة</span> */}
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*, video/*"
        aria-label="image"
      />
    </label>




      <input
        type="text"
        placeholder="Enter Spotify Link"
        value={spotifyUrl}
        onChange={(e) => setSpotifyUrl(e.target.value)}
        className="bg-green-700 p-2 rounded-2xl text-white mb-2.5 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />

      <button
        className="bg-gray-600 p-2 rounded-2xl text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Add New Story"}
      </button>
    </form>
  );
};

export default FormToPost;
