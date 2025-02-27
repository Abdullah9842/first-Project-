import React from "react";

interface MediaHandlingProps {
  spotifyUrl: string;
}

const MediaHandling: React.FC<MediaHandlingProps> = ({ spotifyUrl }) => {
  const getSpotifyEmbedUrl = (url: string): string | null => {
    try {
      // Handle different Spotify URL formats
      const patterns = [
        /https?:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)(?:\?.*)?$/,
        /https?:\/\/open\.spotify\.com\/album\/([a-zA-Z0-9]+)(?:\?.*)?$/,
        /https?:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)(?:\?.*)?$/,
        /spotify:track:([a-zA-Z0-9]+)/,
        /spotify:album:([a-zA-Z0-9]+)/,
        /spotify:playlist:([a-zA-Z0-9]+)/,
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          const id = match[1];
          const type = url.includes("track")
            ? "track"
            : url.includes("album")
            ? "album"
            : "playlist";
          return `https://open.spotify.com/embed/${type}/${id}`;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const embedUrl = getSpotifyEmbedUrl(spotifyUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="w-full my-2">
      <iframe
        src={embedUrl}
        width="100%"
        height="80"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-md"
      ></iframe>
    </div>
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
