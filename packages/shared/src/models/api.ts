export interface SuccessResponse<T, M = undefined> {
  data: T;
  meta?: M;
  success: true;
}
export interface PaginatedResponse<T, M = undefined> {
  data: T;
  totalCount: number;
  meta?: M;
  success: true;
}
export interface ErrorResponse<T, D = undefined> {
  data: T;
  details?: D;
  success: false;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse<T>;

export function makePaginatedResponse<T, M>(data: T, totalCount: number, meta?: M): PaginatedResponse<T, M> {
  return {
    success: true,
    data,
    totalCount,
    meta,
  };
}

export function makeResponse<T, M>(data: T, meta?: M): SuccessResponse<T, M> {
  return {
    success: true,
    data,
    meta,
  };
}
export function makeErrorResponse<T, D>(data: T, details?: D): ErrorResponse<T, D> {
  return {
    success: false,
    data,
    details,
  };
}
