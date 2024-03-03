/** Default response schema for http errors. */
export interface DefaultErrorResponse {
  /** Error detail */
  detail?: string;
}

/** Schema of a DELETE request response */
export interface DeleteStatus {
  /** Delete status */
  status: DeleteStatusStatusEnum;
}

/** Delete status enum */
export enum DeleteStatusStatusEnum {
  Deleted = "deleted",
  NotFound = "not found",
}

/** Validation error detail element */
export interface ValidationError {
  /**
   * Path of the invalid element in the request data, first element is the location in the request:
   * 'path', 'json', 'query' ?
   */
  loc: (string | number)[];
  /** Error message */
  msg: string;
  /** Error type */
  type: string;
}

/** Response schema for HTTP code 422 - validation errors */
export interface HTTPValidationError {
  /** Validation errors details */
  detail?: ValidationError[];
}

/** GET /status response schema */
export interface StatusResponse {
  /** Status of the server */
  status: "ok";
}
