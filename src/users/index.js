import makeDB from "../db";
import makeController from "./controller";
import makeHandler from "./handler";

const database = makeDB();
const controller = makeController(database);
const handler = makeHandler(controller);

export default handler;