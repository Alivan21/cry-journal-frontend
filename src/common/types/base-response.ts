export type SuccessResponse<T> = {
  data: T;
};

export type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details: Array<string>;
  };
};
