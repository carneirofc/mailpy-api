import mongodb from "mongodb";
import config from "./config";

const makeDB = async () => {
    const MongoClient = mongodb.MongoClient;

    const uri = config.MONGODB_URI;
    const options = config.options;
    const client = new MongoClient(
        uri, {
        ...options,
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    await client.connect();

    const db = await client.db();
    db.makeId = makeId;

    return db;
};

const makeId = (str = null) => {
    if (str) {
        return mongodb.ObjectID(str);
    }
    return mongodb.ObjectID();
}
export default makeDB;