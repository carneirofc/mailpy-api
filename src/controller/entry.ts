import { AddEntry, AddEntryUseCase } from "../use-cases/entry";
import { Controller } from "./comm-types";
import { DeleteEntryUseCase } from "../use-cases/entry";
import { Entry } from "../entities";
import { UpdateEntry, UpdateEntryUseCase } from "../use-cases/entry";

export type EntriesGetInterface = Controller<any, Entry[]>;
export type EntryDeleteInterface = Controller<{ id: string }, boolean>;
export type EntryGetInterface = Controller<any, Entry, { id: string }>;
export type EntryPatchInterface = Controller<UpdateEntry, Entry>;
export type EntryPostInterface = Controller<AddEntry, Entry>;

export function makeGetEntry({
  listEntry: listEntry,
}: {
  listEntry: (id: string) => Promise<Entry>;
}): EntryGetInterface {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const entry = await listEntry(httpRequest.query.id);
      return {
        headers,
        statusCode: 200,
        body: entry,
      };
    } catch (e) {
      console.error(`Failed to get entries ${e}`, e);
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

export function makeGetEntries({ listEntries }: { listEntries: () => Promise<Entry[]> }): EntriesGetInterface {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const entries = await listEntries();
      return {
        headers,
        statusCode: 200,
        body: entries,
      };
    } catch (e) {
      console.error(`Failed to get entries ${e}`, e);
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

export function makeDeleteEntry({ deleteEntry }: { deleteEntry: DeleteEntryUseCase }): EntryDeleteInterface {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const res = await deleteEntry(httpRequest.body.id);
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

export function makePostEntry({ addEntry }: { addEntry: AddEntryUseCase }): EntryPostInterface {
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

export function makeUpdateEntry({ updateEntry }: { updateEntry: UpdateEntryUseCase }): EntryPatchInterface {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const entryData = httpRequest.body;
      const res = await updateEntry(entryData);
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
