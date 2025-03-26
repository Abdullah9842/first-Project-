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

import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  text: string;
  timestamp: Timestamp | Date | string;
  userId: string;
  image: string | null;
  mediaUrl: string;
  liked: boolean;
  likeCount: number;
  likedBy?: string[];
  isOwnPost: boolean;
  isFriendPost: boolean;
}

// دالة مساعدة للتعامل مع التواريخ
export const normalizeTimestamp = (timestamp: string | Timestamp | Date | number): string | Timestamp | Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp;
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  return new Date();
};

// إذا كنت بحاجة لاستخدام "number" في المستقبل، يمكن تحويله
export const convertTimestampNumber = (timestamp: number): Date => {
  return new Date(timestamp);
};