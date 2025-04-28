"use server";
import { slugify } from "@/lib/slug-helper.util";
import { z } from "zod";
import { Article, Series, SeriesItem, User } from "../models/domain-models";
import { persistenceRepository } from "../persistence-repositories";
import {
  and,
  asc,
  desc,
  eq,
  joinTable,
  like,
  neq,
} from "../persistence/persistence-where-operator";
import { SeriesInput } from "./inputs/series.input";
import {
  handleRepositoryException,
  RepositoryException,
} from "./RepositoryException";
import { getSessionUserId } from "./session.actions";

export async function seriesFeed(
  _input: z.infer<typeof SeriesInput.seriesFeedInput>
) {
  try {
    const input = await SeriesInput.seriesFeedInput.parseAsync(_input);

    // Get series with owner information and count of articles
    const series = await persistenceRepository.series.findAllWithPagination({
      limit: input.limit,
      page: input.page,
      orderBy: [desc("created_at")],
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

    // If we have series, get the article count for each one
    if (series && series.nodes.length > 0) {
      // For each series, get the count of its articles
      const seriesWithArticleCounts = await Promise.all(
        series.nodes.map(async (seriesItem) => {
          const items = await persistenceRepository.seriesItems.findRows({
            where: and(
              eq("series_id", seriesItem.id),
              eq("type", "article"),
              neq("article_id", null)
            ),
            limit: -1,
          });

          return {
            ...seriesItem,
            article_count: items.length,
          };
        })
      );

      // Replace the nodes with the enhanced series data
      series.nodes = seriesWithArticleCounts;
    }

    return series;
  } catch (error) {
    handleRepositoryException(error);
  }
}

export async function getMySeries() {
  const userId = await getSessionUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    const userSeries = await persistenceRepository.series.findAllWithPagination(
      {
        where: eq("owner_id", userId),
        limit: -1,
        orderBy: [desc("created_at")],
      }
    );

    return userSeries;
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

/**
 * Get a series by its ID
 * @param id - The ID of the series to retrieve
 * @returns The series with its items
 */
export async function getSeriesById(id: string) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new RepositoryException("User not authenticated");
  }

  try {
    // First get the series
    const [series] = await persistenceRepository.series.findRows({
      where: and(eq("id", id), eq("owner_id", userId)),
      limit: 1,
    });

    if (!series) {
      throw new RepositoryException("Series not found");
    }

    // Then get the items
    const items = await persistenceRepository.seriesItems.findRows({
      where: eq("series_id", id),
      orderBy: [asc("index")],
      limit: -1,
      joins: [
        joinTable<SeriesItem, Article>({
          as: "article",
          joinTo: "articles",
          localField: "article_id",
          foreignField: "id",
          columns: ["id", "title", "handle", "cover_image"],
        }),
      ],
    });

    return {
      ...series,
      items: items.map((item) => ({
        ...item,
        // Add title from article if not explicitly set
        title: item.title || item.article?.title || "",
      })),
    };
  } catch (error) {
    handleRepositoryException(error);
    return null;
  }
}

/**
 * Get user articles that can be added to a series
 * @returns List of user articles
 */
export async function getUserArticles() {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new RepositoryException("User not authenticated");
  }

  try {
    const articles = await persistenceRepository.article.findRows({
      where: eq("author_id", userId),
      limit: 4,
      orderBy: [desc("created_at")],
      columns: ["id", "title", "handle", "cover_image"],
    });

    return articles;
  } catch (error) {
    handleRepositoryException(error);
    return [];
  }
}

/**
 * Generate a unique handle for a series
 * @param title - The title to base the handle on
 * @param existingId - Optional ID of an existing series to exclude from the uniqueness check
 * @returns A unique handle for the series
 */
async function getUniqueSeriesHandle(
  title: string,
  existingId?: string
): Promise<string> {
  try {
    // Create a base handle from the title
    const baseHandle = slugify(title);

    // Check if the exact base handle exists
    const existingSeries = await persistenceRepository.series.findRows({
      where: existingId
        ? and(eq("handle", baseHandle), neq("id", existingId))
        : eq("handle", baseHandle),
      limit: 1,
    });

    const exactBaseExists = existingSeries.length > 0;

    // If the exact base handle doesn't exist, we can use it
    if (!exactBaseExists) {
      return baseHandle;
    }

    // Find all series with similar handles to determine the next number
    const similarHandles = await persistenceRepository.series.findRows({
      where: existingId
        ? and(like("handle", `${baseHandle}-%`), neq("id", existingId))
        : like("handle", `${baseHandle}-%`),
      limit: -1,
      columns: ["handle"],
    });

    // Find the highest numbered suffix
    let highestNumber = 1;
    const regex = new RegExp(`^${baseHandle}-(\\d+)$`);

    similarHandles.forEach((series) => {
      const match = series.handle.match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= highestNumber) {
          highestNumber = num + 1;
        }
      }
    });

    // Return with the next number in sequence
    return `${baseHandle}-${highestNumber}`;
  } catch (error) {
    handleRepositoryException(error);
    // Fallback with timestamp to ensure uniqueness
    return `${slugify(title)}-${Date.now()}`;
  }
}

/**
 * Create a new series
 * @param formData - Form data containing the series details
 * @returns The created series
 */
export async function createSeries(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new RepositoryException("User not authenticated");
  }

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const itemsData = formData.get("items");

    console.log("Creating series with title:", title);
    console.log("Items data received:", itemsData);

    if (!title) {
      throw new RepositoryException("Title is required");
    }

    // Validate and parse items
    let items = [];
    if (itemsData) {
      try {
        items = JSON.parse(itemsData as string);
        if (!Array.isArray(items)) {
          throw new RepositoryException("Items must be an array");
        }
        console.log("Parsed items:", items);
      } catch (parseError) {
        console.error("Failed to parse items:", parseError);
        throw new RepositoryException("Invalid items data format");
      }
    }

    // Generate a unique handle
    const handle = await getUniqueSeriesHandle(title);
    console.log("Generated handle:", handle);

    // Use transaction to ensure both series and items are created together

    let series;

    try {
      // Create the series
      series = await persistenceRepository.series.createOne({
        title,

        handle,
        owner_id: userId,
        cover_image: null, // Implement file upload later if needed
      });

      console.log("Created series:", series);

      // Create series items if any
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const articleId =
            item.article_id ||
            (item.id && item.type === "article" ? item.id : null);

          await persistenceRepository.seriesItems.createOne({
            series_id: series.id,
            type: item.type || "article",
            title: item.title || null,
            article_id: articleId,
            index: i,
          });
        }
        console.log(`Created ${items.length} series items`);
      }

      return series;
    } catch (error) {
      console.error("Transaction error in createSeries:", error);
      throw error;
    } finally {
    }
  } catch (error) {
    console.error("Error in createSeries:", error);
    handleRepositoryException(error);
    return null;
  }
}

/**
 * Update an existing series
 * @param id - The ID of the series to update
 * @param formData - Form data containing the updated series details
 * @returns The updated series
 */
export async function updateSeries(id: string, formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new RepositoryException("User not authenticated");
  }

  try {
    // Check if the series exists and belongs to the user
    const [existingSeries] = await persistenceRepository.series.findRows({
      where: and(eq("id", id), eq("owner_id", userId)),
      limit: 1,
    });

    if (!existingSeries) {
      throw new RepositoryException(
        "Series not found or you don't have permission to edit it"
      );
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const itemsData = formData.get("items");

    console.log("Updating series ID:", id, "with title:", title);
    console.log("Items data received:", itemsData);

    if (!title) {
      throw new RepositoryException("Title is required");
    }

    // Validate and parse items
    let items = [];
    if (itemsData) {
      try {
        items = JSON.parse(itemsData as string);
        if (!Array.isArray(items)) {
          throw new RepositoryException("Items must be an array");
        }
        console.log("Parsed items:", items);
      } catch (parseError) {
        console.error("Failed to parse items:", parseError);
        throw new RepositoryException("Invalid items data format");
      }
    }

    // Update handle only if title changed
    let handle = existingSeries.handle;
    if (title !== existingSeries.title) {
      handle = await getUniqueSeriesHandle(title, id);
      console.log("Generated new handle:", handle);
    }

    try {
      // Update the series
      const updatedSeries = await persistenceRepository.series.updateOne({
        where: eq("id", id),
        data: {
          title,
          handle,
        },
      });

      console.log("Updated series:", updatedSeries);

      // Delete existing items - we'll recreate them with the new order
      await persistenceRepository.seriesItems.deleteRows({
        where: eq("series_id", id),
      });

      // Create new items with updated order
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const articleId =
            item.article_id ||
            (item.id && item.type === "article" ? item.id : null);

          await persistenceRepository.seriesItems.createOne({
            series_id: id,
            type: item.type || "article",
            title: item.title || null,
            article_id: articleId,
            index: i,
          });
        }
        console.log(`Created ${items.length} updated series items`);
      }

      return updatedSeries;
    } catch (error) {
      console.error("Transaction error in updateSeries:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateSeries:", error);
    handleRepositoryException(error);
    return null;
  }
}

/**
 * Delete a series
 * @param seriesId - The ID of the series to delete
 * @returns The deleted series
 */
export async function deleteSeries(seriesId: string) {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new RepositoryException("User not authenticated");
  }

  try {
    // Check if the series exists and belongs to the user
    const [existingSeries] = await persistenceRepository.series.findRows({
      where: and(eq("id", seriesId), eq("owner_id", userId)),
      limit: 1,
    });

    if (!existingSeries) {
      throw new RepositoryException(
        "Series not found or you don't have permission to delete it"
      );
    }

    // Delete all series items first
    await persistenceRepository.seriesItems.deleteRows({
      where: eq("series_id", seriesId),
    });

    // Delete the series
    const [deletedSeries] = await persistenceRepository.series.deleteRows({
      where: eq("id", seriesId),
    });

    return deletedSeries;
  } catch (error) {
    handleRepositoryException(error);
    return null;
  }
}
