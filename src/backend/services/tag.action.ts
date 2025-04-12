"use server";

import { z } from "zod";
import { persistenceRepository } from "../persistence-repositories";
import { TagRepositoryInput } from "./inputs/tag.input";
import { handleRepositoryException } from "./RepositoryException";

export const getTags = async (
  _input: z.infer<typeof TagRepositoryInput.findAllInput>
) => {
  try {
    const input = await TagRepositoryInput.findAllInput.parseAsync(_input);
    return persistenceRepository.tags.findAllWithPagination({
      page: input.page,
      limit: input.limit,
    });
  } catch (error) {
    handleRepositoryException(error);
  }
};
