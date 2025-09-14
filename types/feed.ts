export interface FeedUser {
  id: string;
  name: string;
  avatarUrl?: string;
  verified?: boolean;
}

export interface FeedPost {
  id: string;
  user: FeedUser;
  createdAt: string; // ISO string
  text?: string;
  images?: string[];
  likesCount?: number;
  commentsCount?: number;
  likedByMe?: boolean;
}


