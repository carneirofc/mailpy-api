import { Db } from "mongodb";

export interface MakeDb {
  (): Promise<Db>;
}
