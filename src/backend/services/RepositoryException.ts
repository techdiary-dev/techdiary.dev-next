import { zodErrorToString } from "@/lib/utils";
import { z } from "zod";

export class RepositoryException extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.message = message ?? "Validation error";
  }

  toString(): string {
    return this.message;
  }
}

export const handleRepositoryException = (error: any) => {
  if (error instanceof RepositoryException) {
    return error.toString();
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof z.ZodError) {
    throw new RepositoryException(zodErrorToString(error));
  }
};
