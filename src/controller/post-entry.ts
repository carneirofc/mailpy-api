import { Entry } from "../entities";
import { AddEntry, AddEntryUseCase } from "../use-cases/add-entry";

import { Controller } from "./comm-types";

export default function makePostEntry({ addEntry }: { addEntry: AddEntryUseCase }): Controller<AddEntry, Entry> {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const entryData = httpRequest.body;
      const res = await addEntry(entryData);
      return {
        headers,
        statusCode: 200,
        body: res,
      };
    } catch (e) {
      console.error(`Failed to insert entry ${e}`, e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
}
