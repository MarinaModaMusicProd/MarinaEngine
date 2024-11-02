export const USER_MODEL = 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  language?: string;
  timezone?: string;
  country?: string;
}

export interface CompactUser {
  id: number;
  name: string;
  image?: string;
}

export interface CompactUserWithEmail extends CompactUser {
  email: string;
}
