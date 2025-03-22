import { Pool } from "pg";
import { IPersistentDriver } from "../persistence-contracts";
import { buildSafeQuery } from "../persistence-utils";

declare global {
  var pgClient: IPersistentDriver | undefined;
}

export class PgDatabaseClient implements IPersistentDriver {
  private static instance: PgDatabaseClient;

  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });
  }

  public static getInstance(): PgDatabaseClient {
    if (!PgDatabaseClient.instance) {
      PgDatabaseClient.instance = new PgDatabaseClient();
    }
    return PgDatabaseClient.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  /**
   * Executes a raw SQL query with the provided values.
   * @param sql
   * @param values
   */
  async executeSQL(sql: string, values: Array<any>): Promise<{ rows: any[] }> {
    // Escapes a single value safely

    console.log({
      sql,
      values,
    });

    const safeSql = buildSafeQuery(sql, values);

    const result = await this.pool.query(safeSql);

    return {
      rows: result.rows as any[],
    };
  }
}

// Initialize global database connection
if (!globalThis.pgClient) {
  globalThis.pgClient = PgDatabaseClient.getInstance();
}

export const pgClient = globalThis.pgClient;
