// types/api.ts

export interface Pagination {
  page: number
  per_page: number
  total: number
}

export interface Metadata {
  request_id?: string
  pagination?: Pagination
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
  metadata?: Metadata
}

export interface PaginationResource {
    skip: number
    limit: number
}
