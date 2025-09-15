export type ResultType = 'all' | 'account' | 'group' | 'course' | 'event';

export interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  description: string;
  image: string;
  rating?: number;
  reviews?: number;
  price?: number;
  instructor?: string;
  members?: number;
  date?: string;
  location?: string;
  attendees?: number;
  isVerified?: boolean;
  followers?: number;
  isFollowing?: boolean;
}

export interface FilterState {
  type: ResultType;
  sort: string;
  price: string;
  rating: string;
  freeOnly: boolean;
}