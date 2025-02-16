// types.ts
export interface Post {
    image: string | null;
    text: string;
    id: number;
    liked: boolean;
    likeCount: number;
    spotifyUrl?: string;
  }
  