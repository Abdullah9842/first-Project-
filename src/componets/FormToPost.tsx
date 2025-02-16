import React, { useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";

interface FormToPostProps {
  onSubmit: (text: string, image: string | null, spotifyUrl: string) => void;
  onClose: () => void;
}

const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setImage(result);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(text, image, spotifyUrl);
  };

  return (
    <form
      className="mt-14 p-6 bg-gray-100 shadow-lg rounded-2xl flex fixed flex-col items-center w-full max-w-sm"
      onSubmit={handleSubmit}
    >
      <button
        aria-label="Close form"
        className="absolute top-5 right-4 text-gray-400 transition-colors"
        onClick={onClose}
      >
        <RiCloseLargeFill className="w-6 h-6" />
      </button>
      <h2 className="text-xl font-semibold mb-4">What's happening?</h2>

      <input
        className="mb-4 w-full border p-2 rounded-lg"
        type="file"
        onChange={handleFileChange}
        accept="image/*"
      />

      <input
        className="mb-4 w-full border p-2 rounded-lg hover:bg-pink-200 transition"
        type="text"
        placeholder="What's up?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter Spotify Link"
        value={spotifyUrl}
        onChange={(e) => setSpotifyUrl(e.target.value)}
        className="bg-green-700 p-2 rounded-2xl text-white mb-2.5"
      />

      <button
        className="bg-gray-600 p-2 rounded-2xl text-white hover:bg-gray-500 transition"
        type="submit"
      >
        Add New Story
      </button>
    </form>
  );
};

export default FormToPost;

// import React, { useState } from "react";
// import { RiCloseLargeFill } from "react-icons/ri";

// interface FormToPostProps {
//   onSubmit: (text: string, image: string | null, mediaUrl: string) => void;
//   onClose: () => void;
// }

// const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
//   const [text, setText] = useState<string>("");
//   const [image, setImage] = useState<string | null>(null);
//   const [mediaUrl, setMediaUrl] = useState<string>("");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         const result = reader.result;
//         if (typeof result === "string") {
//           setImage(result);
//         }
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(text, image, mediaUrl); // تمرير البيانات إلى الدالة onSubmit
//     setText("");
//     setImage(null);
//     setMediaUrl("");
//   };

//   return (
//     <form
//       className="mt-14 p-6 bg-gray-100 shadow-lg rounded-2xl flex fixed flex-col items-center w-full max-w-sm"
//       onSubmit={handleSubmit}
//     >
//       <button
//         aria-label="Close form"
//         className="absolute top-5 right-4 text-gray-400 transition-colors"
//         onClick={onClose}
//       >
//         <RiCloseLargeFill className="w-6 h-6" />
//       </button>
//       <h2 className="text-xl font-semibold mb-4">What's happening?</h2>

//       <input
//         className="mb-4 w-full border p-2 rounded-lg"
//         type="file"
//         onChange={handleFileChange}
//         accept="image/*"
//       />

//       <input
//         className="mb-4 w-full border p-2 rounded-lg hover:bg-pink-200 transition"
//         type="text"
//         placeholder="What's up?"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       <input
//         type="text"
//         placeholder="Enter Media Link (Spotify, Anghami, etc.)"
//         value={mediaUrl}
//         onChange={(e) => setMediaUrl(e.target.value)}
//         className="bg-green-700 p-2 rounded-2xl text-white mb-2.5"
//       />

//       <button
//         className="bg-gray-600 p-2 rounded-2xl text-white hover:bg-gray-500 transition"
//         type="submit"
//       >
//         Add New Story
//       </button>
//     </form>
//   );
// };

// export default FormToPost;