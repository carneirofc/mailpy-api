import { Controller } from "./comm-types";

const makeGetConditions = ({ listConditions }: { listConditions: () => Promise<any> }): Controller => {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const conditions = await listConditions();
      return {
        headers,
        statusCode: 200,
        body: conditions,
      };
    } catch (e) {
      console.error(`Failed to get conditions ${e}`, e);
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
export default makeGetConditions;
