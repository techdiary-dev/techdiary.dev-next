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
};
