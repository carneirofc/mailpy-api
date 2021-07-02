import { Group, makeGroup } from "../entities";
import { MailpyDB } from "../data-access/mailpy-db";

export interface AddGroup {
  name: string;
  desc: string;
  enabled: boolean;
}
export interface AddGroupUseCase {
  (params: { name: string; desc: string; enabled: boolean }): Promise<Group>;
}

export default function makeAddGroup({ mailpyDb }: { mailpyDb: MailpyDB }): AddGroupUseCase {
  const add: AddGroupUseCase = async function (params: AddGroup): Promise<Group> {
    const newGroup = makeGroup(params);
    const res = await mailpyDb.createGroup(newGroup);
    return res;
  };
  return add;
}
