import { ExternalUserInfo } from "../entities";
import { MailpyDB } from "../data-access/mailpy-db";
import { UsersDb } from "../data-access/users-db";

export default function makeHandleUserPermission({
  mailpyDb,
  userDb,
  getExternalUserInfo,
}: {
  mailpyDb: MailpyDB;
  userDb: UsersDb;
  getExternalUserInfo: (token: string) => Promise<ExternalUserInfo>;
}) {
  const handleUserPermission = async (token: string) => {
    // 1. parse the token
    const { uuid } = await getExternalUserInfo(token);

    // 2. get the user groups
    const grants = await userDb.findUserGrants(uuid);

    // 3. get the operation info (url for instance ...)
    // 4. check if the user has a grant for the specified action
    // 5. allow or deny resource
  };
}
