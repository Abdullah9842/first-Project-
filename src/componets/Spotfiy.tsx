import { useState } from "react";

interface SpotifyInputProps {
  spotifyUrl: string;
  setSpotifyUrl: (url: string) => void;
}

const SpotifyInput: React.FC<SpotifyInputProps> = ({ spotifyUrl, setSpotifyUrl }) => {
  const [showInput, setShowInput] = useState<boolean>(false);

  return (
    <div className="relative">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className=" p-3 rounded-full hover:bg-green-500 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            className="w-5 h-5 text-white"
            fill="currentColor"
          >
            <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm115.5 365.8c-4.3 7-13.6 9.2-20.7 4.9-56.6-34-127.9-41.7-211.8-22.9-8.1 1.8-16.3-3.5-18.2-11.6s3.5-16.3 11.6-18.2c90.1-19.9 167.2-11.2 231.5 26.1 7 4.3 9.2 13.7 4.9 20.7zm29.5-58.8c-5.3 8.6-16.7 11.3-25.4 6-64.9-40.4-163.9-52.1-241.2-28.6-9.6 2.9-19.6-2.5-22.5-12.1s2.5-19.6 12.1-22.5c86.7-26 196.8-12.7 270.8 33.1 8.7 5.4 11.4 16.8 6.1 25.4zM388 243c-74.6-45.6-197.5-49.7-269.2-27.3-11.2 3.4-23-3-26.3-14.3-3.4-11.2 3-23 14.3-26.3 80.9-24.7 214.5-19.6 298.5 31.8 10 6.1 13.2 19.2 7.1 29.2-6.1 10-19.2 13.3-29.2 7.1z" />
          </svg>
        </button>
      ) : (
        <input
          type="text"
          placeholder="Enter Spotify Link"
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          onBlur={() => setShowInput(false)}
          className="px-2 py-2 bg-white rounded-2xl text-gray-500 focus:outline-none focus:ring-2 transition w-full"
          autoFocus
        />
      )}
    </div>
  );
};

export default SpotifyInput;
