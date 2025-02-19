import React, { useState } from "react";

const SetUsername: React.FC = () => {
  const [username, setUsername] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save the username or call an API
    console.log("Username set:", username);
  };

  return (
    <div>
      <h2>Set Username</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleChange}
          placeholder="Enter your username"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default SetUsername;
