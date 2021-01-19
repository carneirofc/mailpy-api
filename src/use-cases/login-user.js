export default function makeUserLogin({ mailpyDb, getExternalUserInfo }) {
  return async function (authToken) {

    // Get information from azure
    const externalInfo = getExternalUserInfo(authToken);

    // Check data obtained

    // Check if the user exists

    // Crete a guest user

    // Return normalized user info
    return {};
  }
}