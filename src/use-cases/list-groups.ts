import { MailpyDB } from "../data-access/mailpy-db";

const makeListGroups = ({ mailpyDb }: { mailpyDb: MailpyDB }) => {
  return async function () {
    const groups = await mailpyDb.findAllGroups();
    return groups;
  };
};
export default makeListGroups;
