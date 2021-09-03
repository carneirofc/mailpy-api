import { MailpyDB } from "../data-access/mailpy-db";

export function makeListConditions({ mailpyDb }: { mailpyDb: MailpyDB }) {
  return async function () {
    const conditions = await mailpyDb.findAllConditions();
    return conditions;
  };
}
