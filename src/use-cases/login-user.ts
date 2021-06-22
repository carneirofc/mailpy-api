import { makeUser } from "../entities";

export default function makeUserLogin({ mailpyDb, usersDb, getExternalUserInfo }) {
  return async function (authToken) {
    // Get information from azure
    const externalInfo = getExternalUserInfo(authToken);

    // Check if the user exists
    let result = await usersDb.findByUUID({ uuid: externalInfo.uuid });

    if (!result) {
      // Crete a user with no roles
      result = await usersDb.insert({
        uuid: externalInfo.uuid,
        email: externalInfo.email,
        name: externalInfo.name,
        roles: [],
      });
    }

    const user = makeUser({
      id: result.id,
      name: result.name,
      uuid: result.uuid,
      email: result.email,
      roles: result.roles,
    });

    // Return user info
    return user;
  };
}
