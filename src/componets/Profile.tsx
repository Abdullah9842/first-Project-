import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import JadeLogo from "../assets/Screenshot_1446-08-07_at_10.01.56_PM-removebg-preview.png";
import { RiCloseLargeFill } from "react-icons/ri";
import { useParams } from "react-router-dom";

interface Post {
  image: string | null;
  text: string;
  id: number;
  liked: boolean;
  likeCount: number;
  spotifyUrl?: string;
}

const Profile: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState<string>("");

  useEffect(() => {
    const storedPosts = localStorage.getItem(`posts-${email}`);
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, [email]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts((prev) => {
        const updatedPosts = prev.filter((post) => post.id !== id);
        localStorage.setItem(`posts-${email}`, JSON.stringify(updatedPosts));
        return updatedPosts;
      });
    }
  };

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

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSpotifyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)/;
    if (regex.test(value)) {
      setSpotifyUrl(value);
    } else {
      alert("Please enter a valid Spotify track link.");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() && !image && !spotifyUrl) {
      alert("Please enter text or upload an image.");
      return;
    }

    const newPost: Post = {
      text,
      id: Date.now(),
      image: image ?? null,
      liked: false,
      likeCount: 0,
      spotifyUrl,
    };

    setPosts((prev) => {
      const newPosts = [newPost, ...prev];
      localStorage.setItem(`posts-${email}`, JSON.stringify(newPosts));
      return newPosts;
    });

    setText("");
    setImage(null);
    setSpotifyUrl("");
    setShowForm(false);
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

      {showForm && (
        <form
          className="mt-14 p-6 bg-gray-100 shadow-lg rounded-2xl flex fixed flex-col items-center w-full max-w-sm"
          onSubmit={handleSubmit}
        >
          <button
            className="absolute top-5 right-4 text-gray-400 transition-colors"
            onClick={() => setShowForm(false)}
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
            onChange={handleTextChange}
          />
          <input
            type="text"
            placeholder="Enter Spotify Link"
            value={spotifyUrl}
            onChange={handleSpotifyUrlChange}
            className="bg-green-700 p-2 rounded-2xl text-white mb-2.5"
          />

          <button className="bg-gray-600 p-2 rounded-2xl text-white hover:bg-gray-500 transition" type="submit">
            Add New Story
          </button>
        </form>
      )}

      <div className="mt-6 w-full flex flex-col items-center gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-400 p-4 shadow-lg rounded-lg w-full max-w-lg">
            {post.image && (
              <img src={post.image} alt="User Upload" className="w-full h-auto rounded-lg mb-3" />
            )}
            <p className="text-base text-white">{post.text}</p>
            {post.spotifyUrl && (
              <iframe
                src={`https://open.spotify.com/embed/track/${post.spotifyUrl.split('/').pop()}`}
                className="w-full h-24 md:h-32 lg:h-40 rounded-lg"
                allow="encrypted-media"
              ></iframe>
            )}
            <div className="flex justify-between items-center mt-3">
              <button
                className="text-gray-500 hover:text-black transition"
                onClick={() => handleDelete(post.id)}
              >
                <AiFillDelete />
              </button>
              <button
                onClick={() => handleLikes(post.id)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                {post.liked ? <FaHeart /> : <FaRegHeart />} {post.likeCount}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
