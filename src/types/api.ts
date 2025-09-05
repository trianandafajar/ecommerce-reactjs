// types/api.ts

export interface Pagination {
  page: number
  per_page: number
  total: number
}

export interface Metadata {
  request_id?: string
  pagination?: PaginationMeta
  extra?: Record<string, any>
}

export interface ErrorInfo {
  error_id: string
  details?: string
  fields?: Record<string, any>
}

export interface StandardResponse<T> {
  code: number
  status: "success" | "error" | "fail"
  message: string
  data: T
  error: Partial<ErrorInfo> | {}
  metadata: Metadata
}

export interface PaginationResource {
    skip: number
    limit: number
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}