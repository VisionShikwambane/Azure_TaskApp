export interface ResponseObject<T> {
    isSuccess: boolean;
    data: T;
    message: string;
  }
  