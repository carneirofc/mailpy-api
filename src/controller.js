const monk = require('monk');

const db = monk(process.env.MONGODB_URI || "mongodb://localhost:27017/mailpy-db");
const conditionsCollection = db.get('conditions');
const entriesCollection = db.get('entries');
const groupsCollection = db.get('groups');
// @todo: Create unique indexes when impplementing post and update methods
    
class MailpyController {
    constructor(){}

    async getGroups (req, res, next) {
        const data = await groupsCollection.find({});
        return res.json(data);
    };

    async getGroup (req, res, next) {

    };

    async getConditions (req, res, next) {
        const data = await conditionsCollection.find({});
        return res.json(data);
    };

    async getEntries(req, res, next) {
        const data = await entriesCollection.find({});
        return res.json(data);

    };

    async getEntry(req, res, next) {

    };

}

module.exports = new MailpyController();