/**
 * Drizzle-style operator functions with direct generic approach
 */

import { IPersistenceJoin } from "./persistence-contracts";

// Type for all possible operators
type Operator =
  | "="
  | "<"
  | ">"
  | "<="
  | ">="
  | "<>"
  | "like"
  | "ilike"
  | "in"
  | "not in";

// Base type for conditions
export interface SimpleWhere<T> {
  key: keyof T;
  operator: Operator;
  value: any;
}

// Type for composite conditions
export interface CompositeWhere<T> {
  AND?: Array<WhereCondition<T>>;
  OR?: Array<WhereCondition<T>>;
}

// Union type for any condition
export type WhereCondition<T> = SimpleWhere<T> | CompositeWhere<T>;

// Equal
export function eq<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "=",
    value,
  };
}

// Not equal
export function neq<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "<>",
    value,
  };
}

// Greater than
export function gt<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: ">",
    value,
  };
}

// Greater than or equal
export function gte<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: ">=",
    value,
  };
}

// Less than
export function lt<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "<",
    value,
  };
}

// Less than or equal
export function lte<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "<=",
    value,
  };
}

// Like (case-sensitive)
export function like<T>(key: keyof T, pattern: string): SimpleWhere<T> {
  return {
    key,
    operator: "like",
    value: pattern,
  };
}

// ILike (case-insensitive)
export function ilike<T>(key: keyof T, pattern: string): SimpleWhere<T> {
  return {
    key,
    operator: "ilike",
    value: pattern,
  };
}

// In list of values
export function inArray<T, K extends keyof T>(
  key: K,
  values: T[K][]
): SimpleWhere<T> {
  return {
    key,
    operator: "in",
    value: values,
  };
}

// Not in list of values
export function notInArray<T, K extends keyof T>(
  key: K,
  values: T[K][]
): SimpleWhere<T> {
  return {
    key,
    operator: "not in",
    value: values,
  };
}

// Is null
export function isNull<T>(key: keyof T): SimpleWhere<T> {
  return {
    key,
    operator: "=",
    value: null,
  };
}

// Is not null
export function isNotNull<T>(key: keyof T): SimpleWhere<T> {
  return {
    key,
    operator: "<>",
    value: null,
  };
}

// Logical AND
export function and<T>(
  ...conditions: Array<WhereCondition<T>>
): CompositeWhere<T> {
  return {
    AND: conditions,
  };
}

// Logical OR
export function or<T>(
  ...conditions: Array<WhereCondition<T>>
): CompositeWhere<T> {
  return {
    OR: conditions,
  };
}

// Types for orderBy
export interface IPersistentOrderBy<T> {
  key: keyof T;
  direction: "asc" | "desc";
}

// Sorting helpers
export function asc<T>(key: keyof T): IPersistentOrderBy<T> {
  return {
    key,
    direction: "asc",
  };
}

export function desc<T>(key: keyof T): IPersistentOrderBy<T> {
  return {
    key,
    direction: "desc",
  };
}

export function joinTable<LOCAL_MODEL, FOREIGN_MODEL>(payload: {
  as: string;
  joinTo: string;
  localField: keyof LOCAL_MODEL;
  foreignField: keyof FOREIGN_MODEL;
  columns: Array<keyof FOREIGN_MODEL>;
}): IPersistenceJoin {
  return {
    as: payload.as,
    joinTo: payload.joinTo,
    localField: payload.localField.toString(),
    foreignField: payload.foreignField.toString(),
    columns: payload.columns.map((col) => col.toString()),
  };
}
