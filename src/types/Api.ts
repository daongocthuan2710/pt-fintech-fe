export type TResponse<T> = {
  code?: string;
  id?: number | string;
  status?: string;
  message?: string;
  data?: any;
  msg?: string;

  [key: string]: any;
};
