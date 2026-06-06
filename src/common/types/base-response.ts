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

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectOptionsResponse = SuccessResponse<SelectOption[]>;
