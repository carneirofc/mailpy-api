import { AddGroup, AddGroupUseCase } from "../use-cases/add-group";
import { Controller } from "./comm-types";
import { Group } from "../entities";

export default function makePostGroup({ addGroup }: { addGroup: AddGroupUseCase }): Controller<AddGroup, Group> {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const body = httpRequest.body;
      const res = await addGroup(body);
      return {
        headers,
        statusCode: 200,
        body: res,
      };
    } catch (e) {
      console.error(`Failed to insert entry ${e}`, e);
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
