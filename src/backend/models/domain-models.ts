export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profile_photo: string;
  education: string;
  designation: string;
  bio: string;
  websiteUrl: string;
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
  created_at: Date;
}
