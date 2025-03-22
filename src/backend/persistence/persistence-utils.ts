import {
  IPersistentOrderBy,
  SimpleWhere,
  WhereCondition,
} from "./persistence-contracts";

export const buildWhereClause = <T>(
  where: WhereCondition<T> | undefined,
  startValues: any[] = [],
  logicalOperator: "AND" | "OR" = "AND"
): { whereClause: string; values: any[] } => {
  // If no where clause is provided, return empty
  if (!where) {
    return { whereClause: "", values: startValues };
  }

  const conditions: string[] = [];
  const values = [...startValues]; // Create a copy to avoid modifying the original array

  if ("OR" in where || "AND" in where) {
    // Process composite WHERE with OR/AND
    if ("OR" in where && where.OR && where.OR.length > 0) {
      const { whereClause: orClause, values: orValues } = processConditions(
        where.OR,
        values,
        "OR"
      );
      if (orClause) {
        conditions.push(`(${orClause})`);
      }
    }

    if ("AND" in where && where.AND && where.AND.length > 0) {
      const { whereClause: andClause, values: andValues } = processConditions(
        where.AND,
        values,
        "AND"
      );
      if (andClause) {
        conditions.push(`(${andClause})`);
      }
    }
  } else if ("key" in where && "operator" in where) {
    // Process a single condition
    processSimpleCondition(where as SimpleWhere<T>, conditions, values);
  }

  return {
    whereClause:
      conditions.length > 0 ? conditions.join(` ${logicalOperator} `) : "",
    values,
  };
};

const processConditions = <T>(
  conditions: WhereCondition<T>[],
  startValues: any[] = [],
  operator: "AND" | "OR" = "AND"
): { whereClause: string; values: any[] } => {
  const clauses: string[] = [];
  const values = [...startValues];

  for (const condition of conditions) {
    if ("OR" in condition || "AND" in condition) {
      // Recursive case for nested OR/AND
      const nestedOperator = "OR" in condition ? "OR" : "AND";
      const nestedConditions = condition.OR || condition.AND || [];

      if (nestedConditions.length > 0) {
        const { whereClause: nestedClause, values: nestedValues } =
          processConditions(nestedConditions, values, nestedOperator);

        if (nestedClause) {
          clauses.push(`(${nestedClause})`);
        }
      }
    } else if ("key" in condition && "operator" in condition) {
      // Base case for simple condition
      processSimpleCondition(condition as SimpleWhere<T>, clauses, values);
    }
  }

  return {
    whereClause: clauses.join(` ${operator} `),
    values,
  };
};

// Helper function to process a simple condition
const processSimpleCondition = <T>(
  condition: SimpleWhere<T>,
  conditions: string[],
  values: any[]
): void => {
  const { key, operator, value } = condition;

  if ((operator === "in" || operator === "not in") && Array.isArray(value)) {
    if (value.length === 0) {
      conditions.push(operator === "in" ? "FALSE" : "TRUE");
    } else {
      const placeholders = value
        .map((_, i) => `$${values.length + i + 1}`)
        .join(", ");
      conditions.push(`"${key.toString()}" ${operator} (${placeholders})`);
      values.push(...value);
    }
  } else if (value === null) {
    // Handle NULL values
    if (operator === "=") {
      conditions.push(`"${key.toString()}" IS NULL`);
    } else if (operator === "<>") {
      conditions.push(`"${key.toString()}" IS NOT NULL`);
    } else {
      conditions.push(`"${key.toString()}" IS NULL`);
    }
  } else {
    // Standard case with non-null value
    const placeholder = `$${values.length + 1}`;
    conditions.push(`"${key.toString()}" ${operator} ${placeholder}`);
    values.push(value);
  }
};

/**
 * Builds an ORDER BY clause for SQL queries
 * @param orderBy Array of order specifications
 * @returns Formatted ORDER BY clause
 */
export const buildOrderByClause = <T>(
  orderBy?: Array<IPersistentOrderBy<T>>
): string => {
  if (!orderBy || orderBy.length === 0) {
    return ""; // No order by clause
  }

  const orderByConditions = orderBy.map(({ key, direction }) => {
    // Convert column name to snake_case for database compatibility
    const snakeCaseColumn = toSnakeCase(key.toString());

    // Escape column name to prevent SQL injection
    const safeColumn = `"${snakeCaseColumn}"`;

    // Validate and normalize order direction
    const safeDirection = direction?.toLowerCase() === "desc" ? "DESC" : "ASC";

    // Add NULLS LAST for better sorting behavior
    const nullsOrder = safeDirection === "DESC" ? "NULLS LAST" : "NULLS FIRST";

    return `${safeColumn} ${safeDirection} ${nullsOrder}`;
  });

  return `ORDER BY ${orderByConditions.join(", ")}`;
};

/**
 * Builds a safe SQL query with values embedded for debugging or logging purposes.
 * WARNING: This is meant for debugging only. Never use this for actual query execution.
 *
 * @param sql The parameterized SQL query with $n placeholders
 * @param values Array of values to replace the placeholders
 * @returns SQL query with values safely embedded
 */
export function buildSafeQuery(sql: string, values: any[]): string {
  if (!sql) return "";
  if (!values || !values.length) return sql;

  // Create a copy to avoid modifying the original SQL
  let safeSql = sql;

  // Replace $n placeholders with formatted values
  safeSql = safeSql.replace(/\$(\d+)/g, (match, indexStr) => {
    const index = parseInt(indexStr, 10) - 1;

    // Check if the index is valid
    if (index < 0 || index >= values.length) {
      // Return the original placeholder if the index is out of bounds
      return match;
    }

    const value = values[index];
    return formatSqlValue(value);
  });

  return safeSql;
}

/**
 * Formats a JavaScript value for safe inclusion in SQL.
 * Handles various types including null, strings, numbers, booleans, dates, arrays, and objects.
 *
 * @param value The value to format for SQL
 * @returns SQL-safe representation of the value
 */
export function formatSqlValue(value: any): string {
  // Handle null and undefined
  if (value === null || value === undefined) {
    return "NULL";
  }

  // Handle numbers
  if (typeof value === "number") {
    // Handle NaN and Infinity
    if (isNaN(value)) return "NULL";
    if (!isFinite(value)) return "NULL";
    return value.toString();
  }

  // Handle booleans
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  // Handle dates
  if (value instanceof Date) {
    // Format to ISO string and ensure proper SQL timestamp format
    return `'${value
      .toISOString()
      .replace("T", " ")
      .replace("Z", "")}'::timestamp`;
  }

  // Handle strings
  if (typeof value === "string") {
    // Escape single quotes by doubling them (SQL standard)
    const escaped = value.replace(/'/g, "''");
    return `'${escaped}'`;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `'{}'`;
    }

    // Format each array element and join with commas
    const formattedElements = value.map((element) => formatSqlValue(element));
    return `ARRAY[${formattedElements.join(",")}]`;
  }

  // Handle objects (convert to JSONB)
  if (typeof value === "object") {
    try {
      // Safely stringify the object and escape any single quotes
      const jsonStr = JSON.stringify(value).replace(/'/g, "''");
      return `'${jsonStr}'::jsonb`;
    } catch (error) {
      // Fallback if JSON stringification fails
      console.error("Error converting object to JSON:", error);
      return "NULL";
    }
  }

  // Default case - try to convert to string
  try {
    return `'${String(value).replace(/'/g, "''")}'`;
  } catch (error) {
    return "NULL";
  }
}

/**
 * Builds a SET clause for UPDATE SQL statements with proper type handling
 * @param data Object containing field:value pairs to update
 * @param startValues Initial values array for parameterized query
 * @returns Object containing the SET clause and updated values array
 */
export const buildSetClause = <T>(
  data: Partial<T>,
  startValues: any[] = []
): { setClause: string; values: any[] } => {
  if (!data || Object.keys(data).length === 0) {
    return { setClause: "", values: startValues };
  }

  const values = [...startValues];
  const setClauses: string[] = [];

  Object.entries(data).forEach(([key, value]) => {
    // Convert key to snake_case for database compatibility
    const snakeCaseKey = toSnakeCase(key);

    // Use parameterized queries for values
    const paramIndex = values.length + 1;
    setClauses.push(`"${snakeCaseKey}" = $${paramIndex}`);
    values.push(value);
  });

  return {
    setClause: setClauses.join(", "),
    values,
  };
};

// Helper function to convert camelCase to snake_case
export function toSnakeCase(str: string): string {
  // return str
  //   ?.replace(/([A-Z])/g, "_$1")
  //   ?.replace(/^_/, "")
  //   ?.toLowerCase();

  return str;
}
