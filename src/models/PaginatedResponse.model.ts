export interface PaginatedResponse<T> {
  data: T[];
  links: Links;
  meta: Meta;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Links {
  first: string;
  last: string;
  prev: null;
  next: string;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}
