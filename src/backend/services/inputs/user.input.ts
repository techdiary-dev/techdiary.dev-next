import { z } from "zod";

export const UserRepositoryInput = {
  syncSocialUserInput: z.object({
    service: z.enum(["github"]),
    service_uid: z.string(),
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    profile_photo: z.string().url(),
    bio: z.string().optional().nullable(),
  }),
  updateUserProfileInput: z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    profile_photo: z.string().url(),
    education: z.string().optional(),
    designation: z.string().optional(),
    bio: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    location: z.string().optional(),
    social_links: z.record(z.string()).optional(),
    profile_readme: z.string().optional(),
    skills: z.string().optional(),
  }),
};
