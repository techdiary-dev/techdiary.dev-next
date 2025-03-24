"use server";

import { z } from "zod";
import { User } from "../models/domain-models";
import { persistenceRepository } from "../persistence-repositories";
import { and, desc, eq } from "../persistence/persistence-where-operator";
import { PersistentRepository } from "../persistence/persistence.repository";
import { handleRepositoryException } from "./RepositoryException";
import { UserRepositoryInput } from "./inputs/user.input";

const userRepository = new PersistentRepository<User>(
  "users",
  persistenceRepository.user
);

/**
 * Creates or syncs a user account from a social login provider.
 * If the user exists, links their social account. If not, creates a new user and social link.
 *
 * @param _input - The social user data containing service, uid and profile info, validated against UserRepositoryInput.syncSocialUserInput schema
 * @returns Promise<{user: User, userSocial: UserSocial}> - The user and their social account link
 * @throws {RepositoryException} If user creation/sync fails or validation fails
 */
export async function bootSocialUser(
  _input: z.infer<typeof UserRepositoryInput.syncSocialUserInput>
) {
  try {
    const input =
      await UserRepositoryInput.syncSocialUserInput.parseAsync(_input);
    let [user] = await userRepository.findRows({
      where: eq("email", input.email),
      columns: ["id", "name", "username", "email"],
      orderBy: [desc("created_at")],
      limit: 1,
    });

    if (!user) {
      user = await userRepository.createOne({
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

    return {
      user,
      userSocial,
    };
  } catch (error) {
    handleRepositoryException(error);
  }
}
