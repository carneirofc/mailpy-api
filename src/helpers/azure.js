import fetch from "node-fetch";
import { ConfidentialClientApplication } from "@azure/msal-node";

import { URLSearchParams } from "url";
import configAzure from "../config/azure"

const msalConfig = {
  auth: {
    clientId: configAzure.clientID,
    authority: `https://login.microsoftonline.com/${configAzure.tenantId}`,
    clientSecret: configAzure.clientSecret,
  }
};
const cca = new ConfidentialClientApplication(msalConfig);

const msalAcquireTokenOnBehalfOf = async (authToken) => {
  const oboRequest = {
    oboAssertion: authToken,
    scopes: configAzure.resourceScope,
  }

  const {
    accessToken,
  } = await cca.acquireTokenOnBehalfOf(oboRequest);

  return accessToken;
}

const callResourceAPI = async (newTokenValue, resourceURI) => {
  let options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${newTokenValue}`,
      "Content-type": "application/json",
      Accept: "application/json",
      "Accept-Charset": "utf-8",
    },
  };
  console.log("Attempt to call Resource API");

  const response = await fetch(resourceURI, options)
    .then((res) => res.json())
    .then((json) => json)
    .catch((e) => console.error(`Failed to get user data from ${resourceURI}, error ${e}`));
  return response;
};

/** @deprecated Use msal-node instead */
const getNewAccessToken = async (token) => {
  /**
   * The administrator consent is needed. Same problem described at:
   * https://stackoverflow.com/questions/56266148/aad-how-do-you-send-an-interactive-authorization-request-to-resolve-aadsts650
   * In a default environment the user would be propted at the SPA to accept and give the permission, but in our tenant it's more restrictive.
   * */
  const tokenEndpoint = `https://${configAzure.authority}/${configAzure.tenantId}/oauth2/${configAzure.version}/token`;

  let myHeaders = new fetch.Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  let urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  urlencoded.append("client_id", configAzure.clientID);
  urlencoded.append("client_secret", configAzure.clientSecret);
  urlencoded.append("assertion", token);
  urlencoded.append("scope", configAzure.resourceScope.join(" "));
  urlencoded.append("requested_token_use", "on_behalf_of");

  console.log(`Encoded url ${tokenEndpoint}/${urlencoded.toString()}\n\n`);

  let options = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  console.info("Attempt to get a new OBO access token", tokenEndpoint, options);

  const json = await fetch(tokenEndpoint, options)
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => console.log(err));
  console.info("OBO graph api response", json);
  return json;
};

/** Return Azure "/me" @param authorization: Authorization header */
export const getAzureUserInfo = async (userToken) => {

  // Acquire OBO Token
  const accessToken = await msalAcquireTokenOnBehalfOf(userToken);

  // access the resource "/me" with token
  const apiResponse = await callResourceAPI(accessToken, configAzure.resourceUri);

  return Object.freeze({
    id: apiResponse.id,
    mail: apiResponse.mail,
    name: apiResponse.displayName,
    login: apiResponse.userPrincipalName,
  });
};

export default Object.freeze({
  getAzureUserInfo
});