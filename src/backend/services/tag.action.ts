"use server";

import { z } from "zod";
import { persistenceRepository } from "../persistence-repositories";
import { like } from "../persistence/persistence-where-operator";
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
      where: input.search ? like("name", `%${input.search}%`) : undefined,
    });
  } catch (error) {
    handleRepositoryException(error);
  }
};
