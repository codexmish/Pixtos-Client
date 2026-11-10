// -----every backend response has this shape (sendResponse in the server)
export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
