export interface UserReference {
  id: string;
  name: string;
  username: string;
  profilePhoto: string;
  social_links: SocialLinks;
  joined: Date;
}

export interface SocialLinks {
  twitter: null | string;
  github: null | string;
}
