import { Group, makeGroup } from "../entities";
import { MailpyDB } from "../data-access/mailpy-db";

export interface AddGroupUseCaseParams {
  name: string;
  desc: string;
  enabled: boolean;
}

export interface UpdateGroupUseCaseParams extends AddGroupUseCaseParams {
  id: string;
}

export interface AddGroupUseCase {
  (params: AddGroupUseCaseParams): Promise<Group>;
}
export interface UpdateGroupUseCase {
  (params: UpdateGroupUseCaseParams): Promise<Group>;
}

export function makeUpdateGroup({ mailpyDb }: { mailpyDb: MailpyDB }): UpdateGroupUseCase {
  return async function (params: UpdateGroupUseCaseParams): Promise<Group> {
    const newGroup = makeGroup(params);
    const res = await mailpyDb.updateGroup(newGroup);
    return res;
  };
}

export function makeAddGroup({ mailpyDb }: { mailpyDb: MailpyDB }): AddGroupUseCase {
  return async function (params: AddGroupUseCaseParams): Promise<Group> {
    const newGroup = makeGroup(params);
    const res = await mailpyDb.createGroup(newGroup);
    return res;
  };
}

export function makeGetGroup({ mailpyDb }: { mailpyDb: MailpyDB }) {
  return async function (id: string) {
    const group = await mailpyDb.findGroupById(id);
    return group;
  };
}

export function makeListGroups({ mailpyDb }: { mailpyDb: MailpyDB }) {
  return async function () {
    const groups = await mailpyDb.findAllGroups();
    return groups;
  };
}

export function makeDeleteGroup({ mailpyDb }: { mailpyDb: MailpyDB }) {
  return async function (): Promise<boolean> {
    throw new Error("Not Impplemented");
  };
}
