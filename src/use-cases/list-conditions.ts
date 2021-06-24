import { MailpyDB } from "../data-access/mailpy-db";

const makeListConditions = ({ mailpyDb }: { mailpyDb: MailpyDB }) => {
  return async function () {
    const conditions = await mailpyDb.findAllConditions();
    return conditions;
  };
};
export default makeListConditions;
