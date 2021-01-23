import { makeUser } from "../entities";

export default function makeUserLogin({ mailpyDb, getExternalUserInfo, addUser }) {
  return async function (authToken) {

    // Get information from azure
    const externalInfo = getExternalUserInfo(authToken);

    // Check if the user exists
    let result = await mailpyDb.findUserByUUID({ uuid: externalInfo.uuid });

    if (!result) {
      // Crete a user with no roles
      result = await mailpyDb.insertUser({
        uuid: externalInfo.uuid,
        email: externalInfo.email,
        name: externalInfo.name,
        roles: []
      });
    }

    const user = makeUser({
      id: result.id,
      name: result.name,
      uuid: result.uuid,
      email: result.email,
      roles: result.roles
    });

    // Return normalized user info
    return user;
  }
}