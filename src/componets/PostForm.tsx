// import React, { useState } from "react";
// import {Post} from "../types/types"
// import { RiCloseLargeFill } from "react-icons/ri";
// // تعريف النوع الخاص بالخصائص
// interface PostFormProps {
//   onAddPost: (newPost: Post) => void;
//   setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const PostForm: React.FC<PostFormProps> = ({ onAddPost, setShowForm }) => {
//   const [text, setText] = useState<string>("");
//   const [image, setImage] = useState<string | null>(null);
//   const [spotifyUrl, setSpotifyUrl] = useState<string>("");

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

//   const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setText(e.target.value);
//   };

//   const handleSpotifyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSpotifyUrl(e.target.value);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!text.trim() && !image && !spotifyUrl) {
//       alert("Please enter text or upload an image.");
//       return;
//     }

//     const newPost: Post = {
//       text,
//       id: Date.now(),
//       image: image ?? null,
//       liked: false,
//       likeCount: 0,
//       spotifyUrl,
//     };

//     onAddPost(newPost);
//     setText("");
//     setImage(null);
//     setSpotifyUrl("");
//     setShowForm(false);
//   };

//   return (
//     <form
//       className="mt-14 p-6 bg-gray-100 shadow-lg rounded-2xl flex fixed flex-col items-center w-full max-w-sm"
//       onSubmit={handleSubmit}
//     >
//       <button
//         className="absolute top-5 right-4 text-gray-400 transition-colors "
//         onClick={() => setShowForm(false)}
//       >
//         <RiCloseLargeFill  className="w-6 h-6"/>
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
//         onChange={handleTextChange}
//       />
//       <input
//         type="text"
//         placeholder="Enter Spotify Link"
//         value={spotifyUrl}
//         onChange={handleSpotifyUrlChange}
//         className="bg-green-700 p-2 rounded-2xl text-white mb-2.5"
//       />

//       <button className="bg-gray-600 p-2 rounded-2xl text-white hover:bg-gray-500 transition" type="submit">
//         Add New Story
//       </button>
//     </form>
//   );
// };

// export default PostForm;




import React, { useState } from "react";

interface PostFormProps {
  onAddPost: (newPost: { id: number; text: string; liked: boolean; likeCount: number }) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onAddPost }) => {
  const [text, setText] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newPost = {
      id: Date.now(),
      text,
      liked: false,
      likeCount: 0,
    };
    onAddPost(newPost);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your post..."
      />
      <button type="submit">Add Post</button>
    </form>
  );
};

export default PostForm;
