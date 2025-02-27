// PostInterface.ts (ملف يحتوي على تعريف `Post` فقط)
// export interface Post {
//     image: string | null;
//     text: string;
//     id: string;
//     liked: boolean;
//     likeCount: number;
//     mediaUrl?: string;
//     userId?: string;
//   }
    
export interface Posts {
  image: string | null;
  text: string;
  id: string;
  liked: boolean;
  likeCount: number;
  mediaUrl?: string;
  userId: string; // مطلوبة
  timestamp: number;
  username: string;
  content: string;
}

// export interface Post {
//   image: string | null;
//   text: string;
//   id: string;
//   liked: boolean;
//   likeCount: number;
//   mediaUrl?: string;
//   userId?: string; // اختيارية
//   timestamp: number;
// }

import { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  text: string;
  timestamp: Timestamp;
  userId: string;
  image: string | null;
  liked: boolean;
  likeCount: number;
  mediaUrl?: string;
  name?: string;
  photoURL?: string;
  spotifyUrl?: string;
}