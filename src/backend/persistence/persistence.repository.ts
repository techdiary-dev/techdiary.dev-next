import {
  AppPaginationResponseDto,
  IPagination,
  IPersistentDriver,
  IPersistentPaginationPayload,
  IPersistentQueryPayload,
  IPersistentUpdatePayload,
} from "./persistence-contracts";
import {
  buildOrderByClause,
  buildSetClause,
  buildWhereClause,
  toSnakeCase,
} from "./persistence-utils";

export class PersistentRepository<DOMAIN_MODEL_TYPE> {
  constructor(
    public readonly tableName: string,
    public readonly persistentDriver: IPersistentDriver
  ) {}

  async findAllWithPagination(
    payload: IPagination<DOMAIN_MODEL_TYPE>
  ): Promise<AppPaginationResponseDto<DOMAIN_MODEL_TYPE>> {
    const _limit = payload.limit || 10;
    const _page = payload.page || 1;
    const _offset = (_page - 1) * _limit;

    // Execute the main query
    const nodes = await this.findRows({
      limit: _limit,
      offset: _offset,
      columns: payload?.columns || [],
      where: payload?.where || undefined,
      orderBy: payload?.orderBy || [],
    });

    // Execute the count query
    const totalCountResult =
      (await this.findRowCount({
        where: payload?.where || undefined,
      })) || 0;

    return {
      nodes: nodes as DOMAIN_MODEL_TYPE[],
      meta: {
        totalCount: +totalCountResult,
        currentPage: +_page,
        hasNextPage: _page * _limit < totalCountResult,
        totalPages: +Math.ceil(totalCountResult / _limit),
      },
    };
  }

  /**
   * Finds rows in the database based on the provided where conditions.
   * @param payload
   */
  async findRows(payload: IPersistentPaginationPayload<DOMAIN_MODEL_TYPE>) {
    // Default columns to '*' if none are provided
    const columns = toSnakeCase(payload?.columns as any) ?? "*";
    const { whereClause, values } = buildWhereClause(payload.where);
    const orderByClause = buildOrderByClause(payload?.orderBy);

    // Build the SQL query with LIMIT, OFFSET, and ORDER BY
    const limit = payload.limit ?? 10; // Default limit to 10 if not provided
    const offset = payload.offset ?? 0; // Default offset to 0 if not provided

    // Build the final SQL query
    const sqlQuery = `
      SELECT ${columns}
      FROM ${this.tableName}
      ${whereClause ? `WHERE ${whereClause}` : ""}
      ${orderByClause ? orderByClause : ""}
      ${limit ? `LIMIT ${limit}` : ""} ${offset ? `OFFSET ${offset}` : ""};
    `;

    // Execute the SQL query
    const result = await this.persistentDriver.executeSQL(sqlQuery, values);
    return result.rows as DOMAIN_MODEL_TYPE[];
  }

  /**
   * Finds the count of rows in the database based on the provided where conditions.
   * @param payload
   */
  async findRowCount(
    payload: IPersistentPaginationPayload<DOMAIN_MODEL_TYPE>
  ): Promise<number> {
    const { whereClause, values } = buildWhereClause(payload.where);

    // Construct the SQL query
    const query = `
      SELECT COUNT(*) as count
      FROM ${this.tableName}
      ${whereClause ? `WHERE ${whereClause}` : ""};
    `;

    const result = await this.persistentDriver.executeSQL(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Creates a new record in the database.
   *
   * @param data - The data to be inserted.
   * @returns The newly created record.
   */
  async createOne(
    data: Partial<DOMAIN_MODEL_TYPE>
  ): Promise<DOMAIN_MODEL_TYPE> {
    // Prepare columns and placeholders for the insert statement
    function toSnakeCase(str: string): string {
      return str
        .replace(/([A-Z])/g, "_$1")
        .replace(/^_/, "")
        .toLowerCase();
    }

    const columns = Object.keys(data).map(toSnakeCase).join(", ");

    const placeholders = Object.keys(data)
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    const values = Object.values(data) as any[];

    // Build the SQL query
    const sql = `
      INSERT INTO ${this.tableName} (${columns},created_at,updated_at)
      VALUES (${placeholders}, now(), now())
      RETURNING *;
    `;

    // Execute the SQL query
    const result = await this.executeSQL(sql, values);
    return result.rows[0] as DOMAIN_MODEL_TYPE;
  }

  /**
   * Creates multiple records in the database.
   *
   * @param payload
   */
  async createMany(
    payload: Partial<DOMAIN_MODEL_TYPE>[]
  ): Promise<DOMAIN_MODEL_TYPE[]> {
    const results = [];

    for (const data of payload) {
      results.push(await this.createOne(data));
    }
    return results as DOMAIN_MODEL_TYPE[];
  }

  /**
   * Updates a record in the database based on where conditions.
   * @param payload Query conditions
   */
  async updateOne(
    payload: IPersistentUpdatePayload<DOMAIN_MODEL_TYPE>
  ): Promise<DOMAIN_MODEL_TYPE> {
    // Build WHERE clause
    const { whereClause, values: whereValues } = buildWhereClause(
      payload.where
    );

    // Build SET clause using the where values as starting point
    const { setClause, values: allValues } = buildSetClause(
      payload.data,
      whereValues
    );

    // Handle columns for RETURNING
    const columns = toSnakeCase((payload.columns as any) || ["*"]);

    // Build final SQL query
    const sql = `
    UPDATE ${this.tableName}
    ${setClause ? `SET ${setClause}` : ""},"updated_at" = now()
    ${whereClause ? `WHERE ${whereClause}` : ""}
    RETURNING ${columns};
  `;

    // Execute the SQL query
    const result = await this.persistentDriver.executeSQL(sql, allValues);

    if (!result.rows || result.rows.length === 0) {
      throw new Error(`No record found to update with the given conditions`);
    }

    return result.rows[0] as DOMAIN_MODEL_TYPE;
  }

  /**
   * Deletes rows in the database based on the provided where conditions.
   * @param payload
   */
  async deleteRows(
    payload: IPersistentQueryPayload<DOMAIN_MODEL_TYPE>
  ): Promise<DOMAIN_MODEL_TYPE[]> {
    const { whereClause, values } = buildWhereClause(payload.where);
    const columns = toSnakeCase(payload.columns as any) || "*";

    const sql = `
        DELETE
        FROM ${this.tableName} ${
      whereClause ? `WHERE ${whereClause}` : ""
    } RETURNING ${columns};
    `;

    const result = await this.executeSQL(sql, values);
    return result.rows as DOMAIN_MODEL_TYPE[];
  }

  /**
   * Executes a raw SQL query with the provided values.
   * @param sql
   * @param values
   */
  executeSQL(sql: string, values: DOMAIN_MODEL_TYPE[]) {
    try {
      return this.persistentDriver.executeSQL(sql, values);
    } catch (e) {
      throw new Error("Error in executeSQL");
    }
  }
}
