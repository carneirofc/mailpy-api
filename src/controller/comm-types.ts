export type ControllerResponseBody<T> = { error: string } | T;

export interface ControllerResponse<T> {
  statusCode: number;
  body: ControllerResponseBody<T>;
  headers: { [key: string]: string };
}

export interface ControllerParsedQs<T> {
  [key: string]: undefined | string | string[] | ControllerParsedQs<T> | ControllerParsedQs<T>[] | T;
}

export interface ControllerHttpRequest<BodyT> {
  body: BodyT;
  headers: { [key: string]: string };
  ip: string;
  method: string;
  params: { [key: string]: string };
  path: string;
  query: ControllerParsedQs<BodyT>;
}
export type Controller<BodyT, ResponseT> = (
  httpRequest: ControllerHttpRequest<BodyT>
) => Promise<ControllerResponse<ResponseT>>;
