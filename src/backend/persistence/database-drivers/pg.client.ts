import { Pool } from "pg";
import { IPersistentDriver } from "../persistence-contracts";
import { buildSafeQuery } from "../persistence-utils";
import { PersistenceDriverError } from "./PersistenceDriverError";

declare global {
  var pgClient: IPersistentDriver | undefined;
}

export class PgDatabaseClient implements IPersistentDriver {
  private static instance: PgDatabaseClient;

  private pool: Pool;

  private constructor() {
    try {
      if (!process.env.DATABASE_URL) {
        throw new PersistenceDriverError(
          "DATABASE_URL environment variable is not defined"
        );
      }

      console.log("Creating new Postgres client");
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      // Test the connection
      this.pool.on("error", (err) => {
        console.error("Unexpected error on idle client", err);
        throw new PersistenceDriverError("Database pool error", err);
      });
    } catch (error) {
      throw new PersistenceDriverError(
        "Failed to initialize database connection",
        error
      );
    }
  }

  public static getInstance(): PgDatabaseClient {
    if (!PgDatabaseClient.instance) {
      PgDatabaseClient.instance = new PgDatabaseClient();
    }
    return PgDatabaseClient.instance;
  }

  /**
   * Executes a raw SQL query with the provided values.
   * @param sql
   * @param values
   */
  async executeSQL(sql: string, values: Array<any>): Promise<{ rows: any[] }> {
    try {
      if (!sql) {
        throw new PersistenceDriverError("SQL query is required");
      }

      console.log({
        sql,
        values,
      });

      const safeSql = buildSafeQuery(sql, values);
      const client = await this.pool.connect();

      try {
        const result = await client.query(safeSql);
        return {
          rows: result.rows as any[],
        };
      } catch (error) {
        throw new PersistenceDriverError(
          `Query execution failed: ${sql}`,
          error
        );
      } finally {
        client.release();
      }
    } catch (error) {
      if (error instanceof PersistenceDriverError) {
        throw error;
      }
      throw new PersistenceDriverError("Database operation failed", error);
    }
  }

  /**
   * Closes the database connection pool
   */
  async close(): Promise<void> {
    try {
      await this.pool.end();
    } catch (error) {
      throw new PersistenceDriverError(
        "Failed to close database connection",
        error
      );
    }
  }
}

// Initialize global database connection
if (!globalThis.pgClient) {
  globalThis.pgClient = PgDatabaseClient.getInstance();
}

export const pgClient = globalThis.pgClient;
