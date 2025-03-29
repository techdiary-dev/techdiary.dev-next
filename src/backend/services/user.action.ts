"use server";

import { z } from "zod";
import { User } from "../models/domain-models";
import { persistenceRepository } from "../persistence-repositories";
import { desc, eq } from "../persistence/persistence-where-operator";
import { handleRepositoryException } from "./RepositoryException";
import { UserRepositoryInput } from "./inputs/user.input";

/**
 * Updates a user's profile information.
 *
 * @param _input - The user profile data to update, validated against UserRepositoryInput.updateUserProfileInput schema
 * @returns Promise<User> - The updated user
 * @throws {RepositoryException} If update fails or validation fails
 */
export async function updateUserProfile(
  _input: z.infer<typeof UserRepositoryInput.updateUserProfileInput>
) {
  try {
    const input =
      await UserRepositoryInput.updateUserProfileInput.parseAsync(_input);

    const updatedUser = await persistenceRepository.user.updateOne({
      where: eq("id", input.id),
      data: {
        name: input.name,
        username: input.username,
        email: input.email,
        profile_photo: input.profile_photo,
        education: input.education,
        designation: input.designation,
        bio: input.bio,
        website_url: input.websiteUrl,
        location: input.location,
        social_links: input.social_links,
        profile_readme: input.profile_readme,
        skills: input.skills,
      },
    });

    return updatedUser;
  } catch (error) {
    handleRepositoryException(error);
  }
}

/**
 * Retrieves a user by their ID.
 *
 * @param id - The user's ID
 * @returns Promise<User | null> - The user if found, null otherwise
 * @throws {RepositoryException} If query fails
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const [user] = await persistenceRepository.user.findRows({
      where: eq("id", id),
      limit: 1,
    });
    return user;
  } catch (error) {
    handleRepositoryException(error);
    return null;
  }
}

/**
 * Retrieves a user by their username.
 *
 * @param username - The user's username
 * @returns Promise<User | null> - The user if found, null otherwise
 * @throws {RepositoryException} If query fails
 */
export async function getUserByUsername(
  username: string,
  columns?: (keyof User)[]
): Promise<User | null> {
  try {
    const [user] = await persistenceRepository.user.findRows({
      where: eq("username", username),
      limit: 1,
      columns: columns ? columns : undefined,
    });
    return user;
  } catch (error) {
    handleRepositoryException(error);
    return null;
  }
}

/**
 * Retrieves a user by their email.
 *
 * @param email - The user's email
 * @returns Promise<User | null> - The user if found, null otherwise
 * @throws {RepositoryException} If query fails
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [user] = await persistenceRepository.user.findRows({
      where: eq("email", email),
      limit: 1,
    });
    return user;
  } catch (error) {
    handleRepositoryException(error);
    return null;
  }
}

/**
 * Gets a paginated list of users.
 *
 * @param page - The page number (1-based)
 * @param limit - Number of users per page
 * @returns Promise<{users: User[], total: number}> - List of users and total count
 * @throws {RepositoryException} If query fails
 */
export async function getUsers(page: number = 1, limit: number = 10) {
  try {
    return persistenceRepository.user.findAllWithPagination({
      limit,
      orderBy: [desc("created_at")],
      columns: [
        "id",
        "name",
        "username",
        "email",
        "profile_photo",
        "created_at",
      ],
    });
  } catch (error) {
    handleRepositoryException(error);
    return null;
  }
}
