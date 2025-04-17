"use server";
import * as sk from "sqlkit";
import { z } from "zod";
import { ArticleTag, Tag } from "../models/domain-models";
import { pgClient } from "../persistence/database-drivers/pg.client";
import { DatabaseTableName } from "../persistence/persistence-contracts";
import { TagRepositoryInput } from "./inputs/tag.input";
import { handleRepositoryException } from "./RepositoryException";

const tagRepository = new sk.Repository<Tag>(DatabaseTableName.tags, pgClient, {
  logging: true,
});
const tagArticlePivotRepository = new sk.Repository<ArticleTag>(
  DatabaseTableName.article_tag,
  pgClient,
  { logging: true }
);

export const getTags = async (
  _input: z.infer<typeof TagRepositoryInput.findAllInput>
) => {
  try {
    const input = await TagRepositoryInput.findAllInput.parseAsync(_input);
    return tagRepository.findRows({
      where: input.search ? sk.like("name", `%${input.search}%`) : undefined,
    });
  } catch (error) {
    handleRepositoryException(error);
  }
};

export const syncTagsWithArticles = async (
  _input: z.infer<typeof TagRepositoryInput.syncTagsWithArticlesInput>
) => {
  try {
    const input =
      await TagRepositoryInput.syncTagsWithArticlesInput.parseAsync(_input);

    // Find all tags
    const attached = await tagArticlePivotRepository.findRows({
      where: sk.eq("article_id", input.article_id),
    });
    const attachedTagids = attached.map((tag) => tag.tag_id) ?? [];

    // article -> [1,2,3,4,5]
    // input_tags -> [1,2,6]

    // find all tags attached to article
    const tagsToRemove = attachedTagids.filter(
      (tag) => !input.tag_ids.includes(tag)
    );
    const tagsToAdd = input.tag_ids.filter(
      (tag) => !attachedTagids.includes(tag)
    );

    if (tagsToAdd.length) {
      await tagArticlePivotRepository.insertMany(
        tagsToAdd.map((tag) => ({
          article_id: input.article_id,
          tag_id: tag,
        }))
      );
    }

    await tagArticlePivotRepository.delete({
      where: sk.and(
        sk.eq("article_id", input.article_id),
        sk.inArray("tag_id", tagsToRemove)
      ),
    });
    console.log({
      tagsToRemove,
      tagsToAdd,
      attachedTagids,
      inputTagIds: input.tag_ids,
    });
  } catch (error) {
    handleRepositoryException(error);
  }
};
