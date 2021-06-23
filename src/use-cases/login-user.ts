import { ExternalUserInfo, User } from "../entities/user";
import { MailpyDB } from "../data-access/mailpy-db";
import { makeUser } from "../entities";
import { UsersDb } from "../data-access/users-db";

export default function makeUserLogin({
  mailpyDb,
  usersDb,
  getExternalUserInfo,
}: {
  mailpyDb: MailpyDB;
  usersDb: UsersDb;
  getExternalUserInfo: (token: string) => Promise<ExternalUserInfo>;
}) {
  return async function (authToken: string) {
    // Get information from azure
    const externalInfo = await getExternalUserInfo(authToken);

    // Check if the user exists
    let result: User = await usersDb.findByUUID(externalInfo.uuid);

    if (!result) {
      // Crete a user with no roles
      const user = makeUser({
        uuid: externalInfo.uuid,
        email: externalInfo.email,
        name: externalInfo.name,
        roles: [],
      });
      // Insert user and get result with the new id
      result = await usersDb.insert(user);
    }

    // Return user info
    return result;
  };
}
