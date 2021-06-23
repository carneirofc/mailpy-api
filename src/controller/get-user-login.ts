import { Controller } from "./comm-types";
const makeGetUser = ({ userLogin }: { userLogin: (arg0: string) => Promise<any> }): Controller => {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const [type, tokenValue] = httpRequest.headers.Authorization.split(" ");

      if (type !== "Bearer") {
        throw `Unsupported Authorization token type. Expected type 'Bearer' received ${type}.`;
      }
      const user = await userLogin(tokenValue);
      return {
        headers,
        statusCode: 200,
        body: user,
      };
    } catch (e) {
      console.error(`Failed to get user ${e}`, e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
};
export default makeGetUser;