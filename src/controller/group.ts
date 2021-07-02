import {
  AddGroupUseCase,
  AddGroupUseCaseParams,
  UpdateGroupUseCase,
  UpdateGroupUseCaseParams,
} from "../use-cases/group";
import { Group } from "../entities";
import { Controller } from "./comm-types";

export function makePostGroup({ addGroup }: { addGroup: AddGroupUseCase }): Controller<AddGroupUseCaseParams, Group> {
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
      console.error(`Failed to update group ${e}`, e);
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

export function makeUpdateGroup({
  updateGroup,
}: {
  updateGroup: UpdateGroupUseCase;
}): Controller<UpdateGroupUseCaseParams, Group> {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const body = httpRequest.body;
      const res = await updateGroup(body);
      return {
        headers,
        statusCode: 200,
        body: res,
      };
    } catch (e) {
      console.error(`Failed to update group ${e}`, e);
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

export function makeGetGroups({ listGroups }: { listGroups: () => Promise<any> }): Controller<any, Group[]> {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const groups = await listGroups();
      return {
        headers,
        statusCode: 200,
        body: groups,
      };
    } catch (e) {
      console.error(`Failed to get groups ${e}`, e);
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
