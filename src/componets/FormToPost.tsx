import React, { useEffect, useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "./firebase";
import { Timestamp } from "firebase/firestore";
import { RiCloseLargeFill } from "react-icons/ri";
import { BiSolidImageAdd } from "react-icons/bi";
import { BsSendFill } from "react-icons/bs";
import { FaSpotify } from "react-icons/fa";
import MediaHandling from "./MediaHandling";
import { useTranslation } from "react-i18next";

interface FormToPostProps {
  onSubmit: (
    text: string,
    imageUrl: string | null,
    spotifyUrl: string,
    audioUrl: string | null,
    timestamp: number
  ) => void;
  onClose: () => void;
}

const FormToPost: React.FC<FormToPostProps> = ({ onSubmit, onClose }) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleOnlineStatus = () => {
      if (!navigator.onLine) {
        alert(t("error.offline"));
      }
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, [t]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSize) {
        setError(t("post.fileTooLarge"));
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImageUrl(null);
  };

  const handleSpotifyToggle = () => {
    setIsSpotifyOpen((prev) => !prev);
    if (isSpotifyOpen) {
      setSpotifyUrl("");
    }
  };

  const validateSpotifyUrl = (url: string): boolean => {
    const patterns = [
      /https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+/,
      /https?:\/\/open\.spotify\.com\/album\/[a-zA-Z0-9]+/,
      /https?:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+/,
      /spotify:track:[a-zA-Z0-9]+/,
      /spotify:album:[a-zA-Z0-9]+/,
      /spotify:playlist:[a-zA-Z0-9]+/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  };

  const handleSpotifyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setSpotifyUrl(url);

    if (url && !validateSpotifyUrl(url)) {
      setError("Please enter a valid Spotify track, album, or playlist URL");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.uid) return;

    if (!text && !imageFile && !spotifyUrl) {
      setError(t("post.required"));
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      let finalImageUrl = null;

      if (imageFile) {
        const compressedImage = await compressImage(imageFile);
        finalImageUrl = await uploadFile(compressedImage, "images");
      }

      const timestamp = Timestamp.now().toMillis();
      await onSubmit(text, finalImageUrl, spotifyUrl, null, timestamp);

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      setError(t("post.error"));
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(
                  new File([blob], file.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  })
                );
              } else {
                reject(new Error("Blob creation failed"));
              }
            },
            "image/jpeg",
            0.7
          );
        };
      };
    });
  };

  const uploadFile = async (
    file: File | Blob,
    folder: string
  ): Promise<string> => {
    const fileName = `${folder}/${auth.currentUser?.uid}/${Date.now()}_${
      file instanceof File ? file.name : "audio.wav"
    }`;
    const storageRef = ref(storage, fileName);

    try {
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Upload initialization error:", error);
      throw error;
    }
  };

  const resetForm = () => {
    setText("");
    setImageFile(null);
    setImageUrl(null);
    setSpotifyUrl("");
    setError(null);
    setProgress(0);
  };

  const isSubmitDisabled =
    isLoading || (!text.trim() && !imageFile && !spotifyUrl.trim());

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-md flex flex-col relative transition-all duration-500 ease-in-out transform hover:scale-105"
      >
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-1">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button
          aria-label={t("action.close")}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all"
          onClick={onClose}
        >
          <RiCloseLargeFill className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          {t("post.createNew")}
        </h2>

        {imageUrl && (
          <div className="relative w-full mb-4 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all">
            <img
              src={imageUrl}
              alt={t("post.preview")}
              className="w-full h-auto max-h-80 object-cover"
            />
            <button
              className="absolute top-2 right-2 bg-white text-gray-500 rounded-full p-2 hover:bg-gray-200 shadow-md hover:scale-110 transition-all"
              onClick={handleImageRemove}
              aria-label={t("action.remove")}
            >
              <RiCloseLargeFill className="w-5 h-5" />
            </button>
          </div>
        )}

        {spotifyUrl && validateSpotifyUrl(spotifyUrl) && (
          <div className="relative w-full mb-4">
            <MediaHandling spotifyUrl={spotifyUrl} />
            <button
              className="absolute top-2 right-2 bg-white text-gray-500 rounded-full p-2 hover:bg-gray-200 shadow-md hover:scale-110 transition-all"
              onClick={() => {
                setSpotifyUrl("");
                setIsSpotifyOpen(false);
              }}
              aria-label={t("action.remove")}
            >
              <RiCloseLargeFill className="w-5 h-5" />
            </button>
          </div>
        )}

        <textarea
          ref={inputRef}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-lg placeholder-gray-400 transition-all"
          placeholder={t("post.writeHere")}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex gap-4 mb-4 items-center justify-between">
          {!isSpotifyOpen && !spotifyUrl && (
            <button
              type="button"
              className="text-3xl text-green-500 hover:text-green-400 transform hover:scale-110 transition-all"
              onClick={handleSpotifyToggle}
              aria-label={t("spotify.add")}
            >
              <FaSpotify />
            </button>
          )}

          {isSpotifyOpen && (
            <div className="flex gap-2 items-center transition-all duration-300 ease-in-out">
              <input
                type="text"
                className="p-2 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={t("spotify.paste")}
                value={spotifyUrl}
                onChange={handleSpotifyUrlChange}
              />
              <button
                type="button"
                className="text-2xl text-red-500 hover:text-red-400"
                onClick={() => {
                  setSpotifyUrl("");
                  setIsSpotifyOpen(false);
                }}
                aria-label={t("action.remove")}
              >
                <RiCloseLargeFill className="w-6 h-6" />
              </button>
            </div>
          )}

          {!imageUrl && (
            <label className="cursor-pointer text-gray-600 hover:text-blue-500 transform hover:scale-105 transition-all">
              <BiSolidImageAdd className="text-3xl" />
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*, video/*"
                aria-label={t("post.addImage")}
              />
            </label>
          )}

          <button
            className={`p-3 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
            } text-white rounded-lg flex items-center justify-center transition flex-shrink-0`}
            type="submit"
            disabled={isSubmitDisabled || isSubmitting}
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="mr-2">{t("post.posting")}</span>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <BsSendFill className="text-xl" />
            )}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default FormToPost;
