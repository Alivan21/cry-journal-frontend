export type SuccessResponse<T> = {
  data: T;
};

export type ErrorResponse = {
  code: string;
  message: string;
  details: Array<string>;
};

export type BaseResponse<T> = SuccessResponse<T> | ErrorResponse;
