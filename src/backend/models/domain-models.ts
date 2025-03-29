export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profile_photo: string;
  education: string;
  designation: string;
  bio: string;
  website_url: string;
  location: string;
  social_links: any;
  profile_readme: string;
  skills: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserSocial {
  id: number;
  service: string;
  service_uid: string;

  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserSession {
  id: string;
  user_id: string;
  token: string;
  device?: string;
  created_at: Date;
}

export interface IServerFile {
  key: string;
  provider: "cloudinary" | "direct";
}

export interface ArticleMetadata {}

export interface Article {
  id: string;
  title: string;
  handle: string;
  excerpt?: string | null;
  body?: string | null;
  cover_image?: IServerFile | null;
  is_published: boolean;
  published_at?: Date | null;
  approved_at?: Date | null;
  user?: User | null;
  metadata?: ArticleMetadata | null;
  author_id: string;
  created_at: Date;
  updated_at: Date;
}
