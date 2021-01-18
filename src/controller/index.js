import config from "../config";
import db from "./db";

// @todo: Create unique indexes when impplementing post and update methods
const Permissions = {
  EntriesCreate: "entries:create",
  GroupsCreate: "groups:create",
  GroupsControl: "groups:control",
  AuthorizationGrant: "authorization:grant",
};

class MailpyController {
  constructor() {}
  async getGrants(req, res, next) {
    try {
      const data = db.getGrants();
      return res.json(data);
    } catch (errr) {
      console.error(errr);
      next("Failed to get grants");
    }
  }
  async getUser(req, res, next) {
    try {
      const { id, displayName, mail } = res.locals.validatedClaims;
      let user = await db.getUser(id);

      if (!user) {
        console.warn(`The user ${displayName} id ${id} is not registered.`);
        const response = await db.createUser(id, displayName, mail, []);

        let user = await db.getUser(id);

        if (!user) {
          console.error(`Failed to register user id=${id} displayName=${displayName}`);
          return next("User registration failed");
        }

        console.log(`New user ${user} created`);
      }

      return res.json(user);
    } catch (error) {
      console.error(`Unexpected error`, error);
      next("Failed to perform operation");
    }
  }

  async getGroups(req, res, next) {
    const data = await db.getGroups();
    return res.json(data);
  }

  async getGroup(req, res, next) {
    return res.send("Not impplemented");
  }

  async addGroup(req, res, next) {
    res.send("Not impplemented");
  }

  async updateGroup(req, res, next) {
    res.send("Not impplemented");
  }

  async removeGroup(req, res, next) {
    res.send("Not impplemented");
  }

  async getConditions(req, res, next) {
    const data = await db.getConditions();
    console.log("Conditions", data);
    return res.json(data);
  }

  async getEntries(req, res, next) {
    const data = await db.getEntries();
    return res.json(data);
  }

  async getEntry(req, res, next) {
    res.send("Not impplemented");
  }

  async addEntry(req, res, next) {
    res.send("Not impplemented");
  }

  async updateEntry(req, res, next) {
    res.send("Not impplemented");
  }

  async removeEntry(req, res, next) {
    res.send("Not impplemented");
  }
}

export default new MailpyController();
