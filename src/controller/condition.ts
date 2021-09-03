import { Controller } from "./comm-types";
import { Condition } from "../entities";

export function makeGetConditions({
  listConditions,
}: {
  listConditions: () => Promise<Condition[]>;
}): Controller<any, Condition[]> {
  return async (_httpRequest) => {
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
}
