export type ControllerResponseBody = string | string[] | {};

export interface ControllerResponse {
  statusCode: number;
  body: ControllerResponseBody;
  headers: { [key: string]: string };
}

export interface ControllerParsedQs {
  [key: string]: undefined | string | string[] | ControllerParsedQs | ControllerParsedQs[];
}

export interface ControllerHttpRequest {
  body: any;
  headers: { [key: string]: string };
  ip: string;
  method: string;
  params: { [key: string]: string };
  path: string;
  query: ControllerParsedQs;
}
export type Controller = (httpRequest: ControllerHttpRequest) => Promise<ControllerResponse>;
