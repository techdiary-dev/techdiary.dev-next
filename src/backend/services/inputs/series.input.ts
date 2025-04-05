import { z } from "zod";

export const SeriesInput = {
  seriesFeedInput: z.object({
    page: z.number().min(1).max(100),
    limit: z.number().min(1).max(100),
  }),
};
