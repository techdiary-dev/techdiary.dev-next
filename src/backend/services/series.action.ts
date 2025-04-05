import { z } from "zod";
import { SeriesInput } from "./inputs/series.input";
import { handleRepositoryException } from "./RepositoryException";
import { persistenceRepository } from "../persistence-repositories";
import {
  asc,
  desc,
  eq,
  joinTable,
} from "../persistence/persistence-where-operator";
import { Article, Series, SeriesItem, User } from "../models/domain-models";

export async function seriesFeed(
  _input: z.infer<typeof SeriesInput.seriesFeedInput>
) {
  try {
    const input = await SeriesInput.seriesFeedInput.parseAsync(_input);

    return persistenceRepository.series.findAllWithPagination({
      limit: input.limit,
      page: input.page,
    });
  } catch (error) {
    handleRepositoryException(error);
  }
}

export const getSeriesDetailByHandle = async (handle: string) => {
  try {
    const [series] = await persistenceRepository.series.findRows({
      where: eq("handle", handle),
      limit: 1,
      joins: [
        joinTable<Series, User>({
          as: "owner",
          joinTo: "users",
          localField: "owner_id",
          foreignField: "id",
          columns: ["id", "name", "username", "profile_photo"],
        }),
      ],
    });

    const serieItems = await persistenceRepository.seriesItems.findRows({
      where: eq("series_id", series.id),
      orderBy: [asc("index")],
      limit: -1,
      joins: [
        joinTable<SeriesItem, Article>({
          as: "article",
          joinTo: "articles",
          localField: "article_id",
          foreignField: "id",
          columns: ["id", "title", "handle"],
        }),
      ],
    });
    return {
      series,
      serieItems,
    };
  } catch (error) {
    handleRepositoryException(error);
  }
};
