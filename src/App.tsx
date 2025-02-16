import React, { useEffect, useState } from "react";

import PostForm from "./componets/PostForm";
import PostItem from "./componets/PostItem";
import JadeLogo from "./assets/Screenshot_1446-08-07_at_10.01.56_PM-removebg-preview.png";

interface Post {
  image: string | null;
  text: string;
  id: number;
  liked: boolean;
  likeCount: number;
  spotifyUrl?: string;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => {
      const updatedPosts = [newPost, ...prev];
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      return updatedPosts;
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts((prev) => {
        const updatedPosts = prev.filter((post) => post.id !== id);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
        return updatedPosts;
      });
    }
  };

  const handleLikes = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-300 p-6">
      <img className="w-15" src={JadeLogo} alt="Jade Logo" />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
        onClick={() => setShowForm(true)}
      >
        +
      </button>

      {showForm && <PostForm onAddPost={handleAddPost} setShowForm={setShowForm} />}
      
      <div className="mt-6 w-full flex flex-col items-center gap-4">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} onDelete={handleDelete} onLikes={handleLikes} />
        ))}
      </div>
    </div>
  );
};

export default App;
