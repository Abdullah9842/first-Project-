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

export interface Post {
  id: string;
  text: string;
  image: string | null;
  liked: boolean;
  likeCount: number;
  mediaUrl?: string;
  userId: string; // Required
  timestamp?: number; // Optional
}