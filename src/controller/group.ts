import {
  AddGroupUseCase,
  AddGroupUseCaseParams,
  UpdateGroupUseCase,
  UpdateGroupUseCaseParams,
} from "../use-cases/group";
import { Group } from "../entities";
import { Controller } from "./comm-types";

export type GroupPostInterface = Controller<AddGroupUseCaseParams, Group>;
export type GroupPatchInterface = Controller<UpdateGroupUseCaseParams, Group>;
export type GroupGetInterface = Controller<any, Group, { id: string }>;
export type GroupDeleteInterface = Controller<{ id: string }, { status: boolean; msg?: string }>;
export type GroupsGetInterface = Controller<any, Group[]>;

export function makePostGroup({ addGroup }: { addGroup: AddGroupUseCase }): GroupPostInterface {
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

export function makeUpdateGroup({ updateGroup }: { updateGroup: UpdateGroupUseCase }): GroupPatchInterface {
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

export function makeGetGroup({ getGroup }: { getGroup: (id: string) => Promise<Group> }): GroupGetInterface {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const group = await getGroup(httpRequest.query.id);
      return {
        headers,
        statusCode: 200,
        body: group,
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
export function makeDeleteGroup({
  deleteGroup,
}: {
  deleteGroup: (id: string) => Promise<boolean>;
}): GroupDeleteInterface {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const deleted = await deleteGroup(httpRequest.body.id);
      if (!deleted) {
        return {
          headers,
          statusCode: 409, // Conflict
          body: { status: deleted, msg: `Cannot delete group "${httpRequest.body.id}", check if it is being used` },
        };
      }

      return {
        headers,
        statusCode: 200,
        body: { status: deleted },
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

export function makeGetGroups({ listGroups }: { listGroups: () => Promise<any> }): GroupsGetInterface {
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
