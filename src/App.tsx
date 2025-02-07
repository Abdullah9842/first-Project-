
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import JadeLogo from "./assets/Screenshot_1446-08-07_at_10.01.56_PM-removebg-preview.png"

function App() {
  const [posts, setPosts] = useState<
    { image: string | null; text: string; id: number }[]
  >([]);
  const [text, setText] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  const handelDelete = (id: number) => {
    setPosts((prev) => {
      const updatedPosts = prev.filter((post) => post.id !== id);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      return updatedPosts;
    });
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setImage(result); // Set image here
        }
      };

      reader.readAsDataURL(file);
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim() && !image) {
      alert("Please enter text or upload an image.");
      return;
    }

    setPosts((prev) => {
      const newPost = { text, id: Date.now(), image: image ?? null }; // Allow `null` as an image value
      const newPosts = [newPost,...prev];
      localStorage.setItem("posts", JSON.stringify(newPosts));
      return newPosts;
    });

    setText("");
    setImage(null);
    setShowForm(false);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-600 p-6">
      <img className="w-15" src={JadeLogo} alt="" />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-300 fixed bottom-5 right-6 transition mb-5"
        onClick={() => setShowForm(true)}
      >
        +
      </button>

      {showForm && (
        <form
          className="mt-5 p-6 bg-gray-100 shadow-lg rounded-2xl flex flex-col items-center w-full max-w-md"
          onSubmit={handleSubmit}
        >
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

          <button className="bg-gray-600 p-2 rounded-2xl text-white" type="submit">
            Add New Story
          </button>
        </form>
      )}

      <div className="mt-6 w-full flex flex-col items-center gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-700 p-4 shadow-lg rounded-lg w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-3">
           
            </div>
            {post.image && (
              <img
                src={post.image}
                alt="User Upload"
                className="w-full h-auto rounded-lg mb-3"
              />
            )}
            <p className="text-base text-white">{post.text}</p>
            <div className="flex justify-between items-center mt-3">
           
            <button
                className="text-gray-500 hover:text-black"
                onClick={() => handelDelete(post.id)}
              > <AiFillDelete />
               
              </button>
              <button className="text-gray-500 hover:text-red-500">
                <FaRegHeart /> Like
               
              </button>
            </div>{" "}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
