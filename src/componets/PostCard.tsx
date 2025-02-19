

// import React from "react";
// import { AiFillDelete } from "react-icons/ai";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { deleteDoc, doc } from "firebase/firestore";
// import { db } from "./firebase"; // تأكد من استيراد Firestore

// interface Post {
//   image: string | null;
//   text: string;
//   id: string; // تغيير النوع إلى string لأن Firestore يستخدم معرفات نصية
//   liked: boolean;
//   likeCount: number;
//   mediaUrl?: string;
// }

// interface PostCardProps {
//   post: Post;
//   onDelete: (id: string) => void;
//   onLike: (id: string) => void;
// }

// const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onLike }) => {
//   const isSpotifyUrl = (url: string): boolean => {
//     return url.includes("open.spotify.com");
//   };

 
//   const handleDelete = async (id: string) => {
    
//     try {
//       const postDocRef = doc(db, "Posts", id);
//       await deleteDoc(postDocRef); // حذف من Firestore
//       console.log("Post deleted from Firestore:", id); // تأكيد الحذف
//       onDelete(id); // تحديث الواجهة
//     } catch (error) {
//       console.error("Error deleting document: ", error);
//     }
//   };

//   return (
//     <div className="bg-gray-400 p-4 shadow-lg rounded-lg w-full max-w-lg">
//       {/* {/* {post.image && (
//         <img src={post.image || undefined} alt="User Upload" className="w-full h-auto rounded-lg mb-3" />
//       )} */}

// {post.mediaUrl && /\.(mov|mp4)$/i.test(post.mediaUrl) ? (
//   <video controls className="w-full h-auto rounded-lg mb-3">
//     <source src={post.mediaUrl} type="video/mp4" />
//     <source src={post.mediaUrl} type="video/quicktime" />
//     متصفحك لا يدعم تشغيل هذا الفيديو.
//   </video>
// ) : (
//   <img src={post.image || undefined} alt="User Upload" className="w-full h-auto rounded-lg mb-3" />
// )}









//       <p className="text-base text-white">{post.text}</p>

//       {post.mediaUrl && isSpotifyUrl(post.mediaUrl) && (
//         <iframe
//           src={`https://open.spotify.com/embed/track/${post.mediaUrl.split('/').pop()}`}
//           className="w-full h-24 md:h-32 lg:h-40 rounded-lg"
//           allow="encrypted-media"
//         ></iframe>
//       )}

//       {post.mediaUrl && !isSpotifyUrl(post.mediaUrl) && (
//         <a
//           href={post.mediaUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-500 hover:underline"
//         >
//           {post.mediaUrl}
//         </a>
//       )}

//       <div className="flex justify-between items-center mt-3">
//         <button
//           aria-label="Delete post"
//           className="text-gray-500 hover:text-black transition"
//           onClick={() => handleDelete(post.id)}
//         >
//           <AiFillDelete />
//         </button>
//         <button
//           aria-label="Like post"
//           onClick={() => onLike(post.id)}
//           className="text-gray-500 hover:text-red-500 transition"
//         >
//           {post.liked ? <FaHeart /> : <FaRegHeart />} {post.likeCount}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostCard;




import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase"; // تأكد من استيراد Firestore

interface Post {
  image: string | null;
  text: string;
  id: string; // تغيير النوع إلى string لأن Firestore يستخدم معرفات نصية
  liked: boolean;
  likeCount: number;
  mediaUrl?: string;
}

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onLike }) => {
  const isSpotifyUrl = (url: string): boolean => {
    return url.includes("open.spotify.com");
  };

  const handleDelete = async (id: string) => {
    try {
      const postDocRef = doc(db, "Posts", id);
      await deleteDoc(postDocRef); // حذف من Firestore
      console.log("Post deleted from Firestore:", id); // تأكيد الحذف
      onDelete(id); // تحديث الواجهة
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="bg-gray-400 p-4 shadow-lg rounded-lg w-full max-w-lg">
      {/* تحقق من وجود الصورة أو الفيديو قبل العرض */}
      {post.mediaUrl && /\.(mov|mp4)$/i.test(post.mediaUrl) ? (
        <video controls className="w-full h-auto rounded-lg mb-3">
          <source src={post.mediaUrl} type="video/mp4" />
          <source src={post.mediaUrl} type="video/quicktime" />
          متصفحك لا يدعم تشغيل هذا الفيديو.
        </video>
      ) : post.image ? (
        <img src={post.image} alt="User Upload" className="w-full h-auto rounded-lg mb-3" />
      ) : null} {/* إذا لم تكن هناك صورة أو فيديو، لا تعرض شيئًا */}

      <p className="text-base text-white">{post.text}</p>

      {/* إذا كان الرابط يشير إلى Spotify */}
      {post.mediaUrl && isSpotifyUrl(post.mediaUrl) && (
        <iframe
          src={`https://open.spotify.com/embed/track/${post.mediaUrl.split('/').pop()}`}
          className="w-full h-24 md:h-32 lg:h-40 rounded-lg"
          allow="encrypted-media"
        ></iframe>
      )}

      {/* إذا كان الرابط ليس Spotify، عرض الرابط العادي */}
      {post.mediaUrl && !isSpotifyUrl(post.mediaUrl) && (
        <a
          href={post.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {post.mediaUrl}
        </a>
      )}

      <div className="flex justify-between items-center mt-3">
        {/* زر الحذف */}
        <button
          aria-label="Delete post"
          className="text-gray-500 hover:text-black transition"
          onClick={() => handleDelete(post.id)}
        >
          <AiFillDelete />
        </button>
        {/* زر الإعجاب */}
        <button
          aria-label="Like post"
          onClick={() => onLike(post.id)}
          className="text-gray-500 hover:text-red-500 transition"
        >
          {post.liked ? <FaHeart /> : <FaRegHeart />} {post.likeCount}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
