import { Entry, makeEntry } from "../entities";
import { MailpyDB } from "../data-access/mailpy-db";

export interface AddEntryUseCase {
  ({ group_id, condition_name, ...data }: AddEntry): Promise<Entry>;
}
export interface UpdateEntryUseCase {
  ({ group_id, condition_name, ...data }: UpdateEntry): Promise<Entry>;
}
export interface DeleteEntryUseCase {
  (id: string): Promise<boolean>;
}
export interface AddEntry {
  group_id: string;
  condition_name: string;
  alarm_values: string;
  email_timeout: number;
  emails: string[];
  subject: string;
  unit: string;
  warning_message: string;
  pvname: string;
}

export interface UpdateEntry extends AddEntry {
  id: string;
}

export function makeUpdateEntry({ mailpyDb }: { mailpyDb: MailpyDB }): UpdateEntryUseCase {
  const update: UpdateEntryUseCase = async function ({ condition_name, group_id, ...data }) {
    const group = await mailpyDb.findGroupById(group_id);
    const condition = await mailpyDb.findConditionByName(condition_name);
    const entry = makeEntry({ group, condition, ...data });
    return await mailpyDb.updateEntry(entry);
  };
  return update;
}

export function makeAddEntry({ mailpyDb }: { mailpyDb: MailpyDB }): AddEntryUseCase {
  const add: AddEntryUseCase = async function add({ group_id, condition_name, ...data }: AddEntry): Promise<Entry> {
    const group = await mailpyDb.findGroupById(group_id);
    const condition = await mailpyDb.findConditionByName(condition_name);
    const entry = makeEntry({ group, condition, ...data });
    const res = await mailpyDb.createEntry(entry);
    return res;
  };
  return add;
}

export function makeDeleteEntry({ mailpyDb }: { mailpyDb: MailpyDB }): DeleteEntryUseCase {
  const del: DeleteEntryUseCase = async (id: string): Promise<boolean> => {
    return await mailpyDb.deleteEntryById(id);
  };
  return del;
}

export function makeListEntries({ mailpyDb }: { mailpyDb: MailpyDB }) {
  return async function () {
    const entries = await mailpyDb.findAllEntries();
    return entries;
  };
}

export function makeListEntry({ mailpyDb }: { mailpyDb: MailpyDB }) {
  return async function (id: string) {
    const entry = await mailpyDb.findEntryById(id);
    return entry;
  };
}
