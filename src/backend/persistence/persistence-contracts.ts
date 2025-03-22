interface PaginationMeta {
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

export class AppPaginationResponseDto<T> {
  nodes: T[];
  meta: PaginationMeta;

  constructor(data: any, meta: PaginationMeta) {
    this.meta = meta;
    this.nodes = data;
  }
}

//------------------------------------
// Pagination
//------------------------------------
export enum ISortType {
  ASC = "ASC",
  DESC = "DESC",
}

//------------------------------------
// Find
//------------------------------------
export interface IPersistentCondition<T> {
  key: keyof T;
  value: any;
  operator:
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
}
export interface IPersistentOrderBy<T> {
  key: keyof T;
  direction: "asc" | "desc";
}

export type SimpleWhere<T> = IPersistentCondition<T>;
export type CompositeWhere<T> = {
  OR?: WhereCondition<T>[];
  AND?: WhereCondition<T>[];
};
export type WhereCondition<T> = SimpleWhere<T> | CompositeWhere<T>;

export interface IPersistentPaginationPayload<T> {
  where?: WhereCondition<T>;
  orderBy?: Array<IPersistentOrderBy<T>>;
  columns?: Array<keyof T>;
  limit?: number;
  offset?: number;
}

export interface IPersistentQueryPayload<T> {
  where?: WhereCondition<T>; // No longer allows arrays
  orderBy?: Array<IPersistentOrderBy<T>>;
  columns?: Array<keyof T>;
}

export interface IPersistentUpdatePayload<T> {
  where: WhereCondition<T>; // No longer allows arrays
  data: Partial<T>;
  columns?: Array<keyof T>;
}

export interface IPagination<T> {
  page?: number;
  limit?: number;
  where?: WhereCondition<T>; // No longer allows arrays
  columns?: Array<keyof T>;
  orderBy?: Array<IPersistentOrderBy<T>>;
}

//------------------------------------
// Driver
//------------------------------------

export interface IPersistentDriver {
  executeSQL(
    sql: string,
    values: Array<any>
  ): Promise<{
    rows: Array<any>;
  }>;
}

export enum DatabaseTableName {
  tenants = "tenants",
  clients = "clients",
  users = "users",
  roles = "roles",
}
