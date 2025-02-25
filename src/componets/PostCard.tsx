

// import React, { useEffect, useState } from "react";
// import { AiFillDelete } from "react-icons/ai";
// import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
// import { deleteDoc, doc, getDoc } from "firebase/firestore";
// import { db } from "./firebase";
// import "../index.css";

// interface Posts {
//   image: string | null;
//   text: string;
//   id: string;
//   liked: boolean;
//   likeCount: number;
//   mediaUrl?: string;
//   userId: string;
//   comments?: string[];
// }

// interface PostCardProps {
//   post: Posts;
//   onDelete: (id: string) => void;
//   onLike: (id: string) => void;
//   onComment: (id: string, comment: string) => void;
// }

// const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onLike, onComment }) => {
//   interface User {
//     name: string;
//     photoURL: string;
//   }

//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userDocRef = doc(db, "Users", post.userId);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) {
//           setUser(userDoc.data() as User);
//         }
//       } catch (error) {
//         console.error("Error fetching user data: ", error);
//       }
//     };

//     fetchUser();
//   }, [post.userId]);

//   const handleDelete = async (id: string) => {
//     try {
//       const postDocRef = doc(db, "Posts", id);
//       await deleteDoc(postDocRef);
//       console.log("Post deleted from Firestore:", id);
//       onDelete(id);
//     } catch (error) {
//       console.error("Error deleting document: ", error);
//     }
//   };

//   const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const commentInput = e.currentTarget.elements.namedItem("comment") as HTMLInputElement;
//     const comment = commentInput.value.trim();
//     if (comment) {
//       onComment(post.id, comment);
//       commentInput.value = "";
//     }
//   };

//   if (!user) {
//     return null; // Optionally, you can show a loading spinner here.
//   }

//   return (
//     <div className="bg-white shadow-lg rounded-xl w-full overflow-hidden relative transition-all hover:shadow-xl border border-gray-100">
//       {/* Header with Profile Image and Username */}
//       <div className="flex items-center p-4 border-b border-gray-100">
//         <img
//           src={user.photoURL || "https://via.placeholder.com/40"}
//           alt="Profile"
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <span className="ml-3 font-medium text-gray-800">{user.name || "Unknown User"}</span>
//       </div>

//       {/* Image or Video */}
//       {post.mediaUrl && /\.(mov|mp4)$/i.test(post.mediaUrl) ? (
//         <video controls className="w-full object-cover">
//           <source src={post.mediaUrl} type="video/mp4" />
//           <source src={post.mediaUrl} type="video/quicktime" />
//           Your browser does not support this video.
//         </video>
//       ) : post.image ? (
//         <img
//           src={post.image ?? undefined}
//           alt="User Upload"
//           className="w-full object-cover"
//         />
//       ) : null}

//       {/* Post Content */}
//       <div className="p-4">
//         {/* Post Text */}
//         <p className="text-gray-800 text-lg font-medium leading-relaxed mb-4">
//           {post.text}
//         </p>

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center border-t border-gray-100 pt-4">
//           <div className="flex items-center space-x-4">
//             <button
//               aria-label="Like post"
//               onClick={() => onLike(post.id)}
//               className="flex items-center text-gray-500 hover:text-red-500 transition-all p-2 rounded-full hover:bg-red-50"
//             >
//               {post.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
//               <span className="ml-2 text-sm font-medium">{post.likeCount}</span>
//             </button>
//             <button
//               aria-label="Comment"
//               className="flex items-center text-gray-500 hover:text-blue-500 transition-all p-2 rounded-full hover:bg-blue-50"
//             >
//               <FaComment />
//               <span className="ml-2 text-sm font-medium">{post.comments?.length || 0}</span>
//             </button>
//           </div>
//           <button
//             aria-label="Delete post"
//             className="text-gray-500 hover:text-red-600 transition-all p-2 rounded-full hover:bg-red-50"
//             onClick={() => handleDelete(post.id)}
//           >
//             <AiFillDelete size={20} />
//           </button>
//         </div>

//         {/* Comments Section */}
//         <div className="mt-4">
//           {post.comments?.map((comment, index) => (
//             <div key={index} className="text-gray-700 text-sm mb-2">
//               <span className="font-medium">{user.name || "User"}: </span>
//               {comment}
//             </div>
//           ))}
//         </div>

//         {/* Add Comment Form */}
//         <form onSubmit={handleAddComment} className="mt-4">
//           <input
//             type="text"
//             name="comment"
//             placeholder="Add a comment..."
//             className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
//           />
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PostCard;


import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import "../index.css";

interface Posts {
  image: string | null;
  text: string;
  id: string;
  liked: boolean;
  likeCount: number;
  mediaUrl?: string;
  userId: string;
  comments?: string[];
}

interface PostCardProps {
  post: Posts;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onLike }) => {
  interface User {
    name: string;
    photoURL: string;
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDocRef = doc(db, "Users", post.userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUser();
  }, [post.userId]);

  const handleDelete = async (id: string) => {
    try {
      const postDocRef = doc(db, "Posts", id);
      await deleteDoc(postDocRef);
      console.log("Post deleted from Firestore:", id);
      onDelete(id);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };


  if (!user) {
    return null; // Optionally, you can show a loading spinner here.
  }

  return (
    <div className="bg-gray-400 shadow-lg items-center  rounded-xl w-full overflow-hidden relative transition-all hover:shadow-xl border border-gray-100">
      {/* Header with Profile Image and Username */}
      <div className="flex items-center p-4 border-gray-100">
        <img
          src={user.photoURL || "https://via.placeholder.com/40"}
          alt="Profile"
          className=" w-10 h-10 rounded-full object-cover"
        />
        <span className="ml-3 font-medium text-gray-800">{user.name || "Unknown User"}</span>
      </div>

      {/* Image or Video */}
      {post.mediaUrl && /\.(mov|mp4)$/i.test(post.mediaUrl) ? (
        <video controls className="w-full object-cover">
          <source src={post.mediaUrl} type="video/mp4" />
          <source src={post.mediaUrl} type="video/quicktime" />
          Your browser does not support this video.
        </video>
      ) : post.image ? (
        <img
          src={post.image ?? undefined}
          alt="User Upload"
          className="w-full object-cover"
        />
      ) : null}

      {/* Post Content */}
      <div className="p-4">
        {/* Post Text */}
        <p className="text-gray-800 text-lg font-medium leading-relaxed mb-1">
          {post.text}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center  border-gray-100 ">
          <div className="flex items-center space-x-4">
            <button
              aria-label="Like post"
              onClick={() => onLike(post.id)}
              className="flex items-center text-gray-500 hover:text-red-500 transition-all p-2 rounded-full hover:bg-red-50"
            >
              {post.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span className="ml-2 text-sm font-medium">{post.likeCount}</span>
            </button>
           
          </div>
          <button
            aria-label="Delete post"
            className="text-gray-500 hover:text-red-600 transition-all p-2 rounded-full hover:bg-red-50"
            onClick={() => handleDelete(post.id)}
          >
            <AiFillDelete size={20} />
          </button>
        </div>

  

     
      </div>
    </div>
  );
};

export default PostCard;
