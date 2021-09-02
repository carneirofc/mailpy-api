export type ControllerResponseBody<T> = { error: string } | T;

export interface ControllerResponse<T> {
  statusCode: number;
  body: ControllerResponseBody<T>;
  headers: { [key: string]: string };
}
/*
export interface ControllerParsedQs<T> {
  [key: string]: undefined | string | string[] | ControllerParsedQs<T> | ControllerParsedQs<T>[] | T;
}
*/
export interface ControllerHttpRequest<BodyT, QueryT, ParamsT> {
  body: BodyT;
  headers: { [key: string]: string };
  ip: string;
  method: string;
  params: ParamsT;
  path: string;
  query: QueryT;
}
export type Controller<
  BodyT = any,
  ResponseT = any,
  QueryT = { [key: string]: any },
  ParamsT = { [key: string]: any }
> = (httpRequest: ControllerHttpRequest<BodyT, QueryT, ParamsT>) => Promise<ControllerResponse<ResponseT>>;
