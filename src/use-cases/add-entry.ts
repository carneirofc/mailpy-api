import { Entry, makeEntry } from "../entities";
import { MailpyDB } from "../data-access/mailpy-db";

export interface AddEntryUseCase {
  ({ group_id, condition_name, ...data }: AddEntry): Promise<Entry>;
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
export default function makeAddEntry({ mailpyDb }: { mailpyDb: MailpyDB }): AddEntryUseCase {
  const add: AddEntryUseCase = async function add({ group_id, condition_name, ...data }: AddEntry): Promise<Entry> {
    const group = await mailpyDb.findGroupById(group_id);
    const condition = await mailpyDb.findConditionByName(condition_name);
    const entry = makeEntry({ group, condition, ...data });
    const res = await mailpyDb.createEntry(entry);
    return res;
  };
  return add;
}
