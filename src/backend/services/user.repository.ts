import { z } from "zod";
import { User } from "../models/domain-models";
import { persistenceRepository } from "../persistence-repositories";
import {
  and,
  desc,
  eq,
} from "../persistence/database-drivers/persistence-where-operator";
import { PersistentRepository } from "../persistence/persistence.repository";
import { handleRepositoryException } from "./RepositoryException";

class UserRepository extends PersistentRepository<User> {
  constructor() {
    super("users", persistenceRepository.user);
  }

  async bootSocialUser(
    _input: z.infer<typeof UserRepositoryInput.syncUserInput>
  ) {
    try {
      const input = await UserRepositoryInput.syncUserInput.parseAsync(_input);
      let [user] = await this.findRows({
        where: eq("email", input.email),
        columns: ["id", "name", "username", "email"],
        orderBy: [desc("created_at")],
        limit: 1,
      });

      if (!user) {
        user = await this.createOne({
          name: input.name,
          username: input.username,
          email: input.email,
          profile_photo: input.profile_photo,
          bio: input.bio ?? "",
        });
      }

      // check user has social account
      const [userSocial] = await persistenceRepository.userSocial.findRows({
        where: and(
          eq("service", input.service),
          eq("service_uid", input.service)
        ),
        columns: ["id", "service", "service_uid", "user_id"],
        limit: 1,
      });

      if (!userSocial) {
        await persistenceRepository.userSocial.createOne({
          service: input.service,
          service_uid: input.service_uid,
          user_id: user.id,
        });
      }

      return user;
    } catch (error) {
      handleRepositoryException(error);
    }
  }
}

export const userRepository = new UserRepository();
export const UserRepositoryInput = {
  syncUserInput: z.object({
    service: z.enum(["github", "google", "facebook"]),
    service_uid: z.string(),
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    profile_photo: z.string().url(),
    bio: z.string().optional().nullable(),
  }),
};
