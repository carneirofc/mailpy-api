import _axios from "axios";
import https from "https";

// At instance level
const axios = _axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const baseApiUrl = `https://localhost:1337/mailpy/api`;

const uriConditions = `${baseApiUrl}/conditions`;
const uriGroups = `${baseApiUrl}/groups`;
const uriGroup = `${baseApiUrl}/group`;
const uriEntries = `${baseApiUrl}/entries`;
const uriEntry = `${baseApiUrl}/entry`;

async function getConditions() {
  const res = await axios.get(uriConditions);
  console.log("Conditions", res.data, res.status, res.statusText);
}

async function getGroups() {
  const res = await axios.get(uriGroups);
  console.log("Groups", res.data, res.status, res.statusText);
}

async function getGroup(id: string | any) {
  const res = await axios.get(`${uriGroup}?id=${id}`);
  console.log("Group", res.data, res.status, res.statusText);
}

async function getEntries() {
  const res = await axios.get(`${uriEntries}`);
  console.log("Entries", res.data, res.status, res.statusText);
}

getConditions();
getGroups();
getGroup("60df4a950ab3ba47593ef9a6");
// getGroup('ASD123afds 5q V');
getGroup(13123);
getEntries();
