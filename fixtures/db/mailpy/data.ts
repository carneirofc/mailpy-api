import { Db, ObjectID } from "mongodb";
import { collections } from "./setup";
import { GrantName, ConditionName } from "../../../src/entities";
import { listFromObjects } from "../../../src/helpers";

const { conditions, entries, groups } = collections;

export const conditionsEnum = {
  outOfrange: {
    _id: new ObjectID(),
    name: ConditionName.OUT_OF_RANGE,
    desc: "Must remain within the specified range.",
  },
  superiorThan: {
    _id: new ObjectID(),
    name: ConditionName.SUPERIOR_THAN,
    desc: "Must remain superior than.",
  },
  inferiorThan: {
    _id: new ObjectID(),
    name: ConditionName.INFERIOR_THAN,
    desc: "Must remain inferior than.",
  },
  increasingStep: {
    _id: new ObjectID(),
    name: ConditionName.INCREASING_STEP,
    desc: "Each increasing step triggers an alarm.",
  },
  decreasingStep: {
    _id: new ObjectID(),
    name: ConditionName.DECREASING_STEP,
    desc: "Each decreasing step triggers an alarm.",
  },
};

const insertConditions = async (db: Db) => {
  const collection = db.collection(conditions);
  const items = listFromObjects(conditionsEnum);

  await collection.deleteMany({});
  await collection.insertMany(items);
};

export async function insertData(db: Db) {
  await insertConditions(db);
}
