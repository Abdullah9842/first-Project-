import React from "react";

interface MediaHandlingProps {
  spotifyUrl: string;
}

const MediaHandling: React.FC<MediaHandlingProps> = ({ spotifyUrl }) => {
  const isValidSpotifyUrl = (url: string): boolean => {
    const regex = /https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)/;
    return regex.test(url);
  };

  if (!isValidSpotifyUrl(spotifyUrl)) {
    return null;
  }

  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${spotifyUrl.split('/').pop()}`}
      className="w-full h-24 md:h-32 lg:h-40 rounded-lg"
      allow="encrypted-media"
    ></iframe>
  );
};

export default MediaHandling;

// import React from "react";
// import ReactPlayer from "react-player";

// interface MediaHandlingProps {
//   mediaUrl: string;
// }

// const MediaHandling: React.FC<MediaHandlingProps> = ({ mediaUrl }) => {
//   const getMediaType = (url: string): string => {
//     if (url.includes("open.spotify.com")) {
//       return "spotify";
//     } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
//       return "youtube";
//     } else if (url.includes("soundcloud.com")) {
//       return "soundcloud";
//     } else if (url.includes("anghami.com")) {
//       return "anghami";
//     }
//     return "unsupported";
//   };

//   const renderMediaPlayer = () => {
//     const mediaType = getMediaType(mediaUrl);

//     switch (mediaType) {
//       case "spotify":
//       case "youtube":
//       case "soundcloud":
//         return (
//           <ReactPlayer
//             url={mediaUrl}
//             controls={true}
//             width="100%"
//             height="auto"
//             style={{ borderRadius: "12px", overflow: "hidden" }}
//           />
//         );

//       case "anghami":
//         return (
//           <iframe
//             src={mediaUrl}
//             width="100%"
//             height="380"
//             style={{ border: "none", borderRadius: "12px" }}
//             title="Anghami Widget"
//           ></iframe>
//         );

//       default:
//         return <p className="text-red-500">Unsupported media URL</p>;
//     }
//   };

//   return <div>{renderMediaPlayer()}</div>;
// };

// export default MediaHandling;