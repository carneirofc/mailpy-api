import { MailpyDB } from "../data-access/mailpy-db";

const makeListEntries = ({ mailpyDb }: { mailpyDb: MailpyDB }) => {
  return async function () {
    const entries = await mailpyDb.findAllEntries();
    return entries;
  };
};
export default makeListEntries;
