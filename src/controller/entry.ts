import { AddEntry, AddEntryUseCase } from "../use-cases/entry";
import { Controller } from "./comm-types";
import { DeleteEntryUseCase } from "../use-cases/entry";
import { Entry } from "../entities";
import { UpdateEntry, UpdateEntryUseCase } from "../use-cases/entry";

export function makeGetEntry({
  listEntry: listEntry,
}: {
  listEntry: (id: string) => Promise<Entry>;
}): Controller<{ id: string }, Entry> {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const entry = await listEntry((httpRequest.query as { id: string }).id);
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

export function makeGetEntries({ listEntries }: { listEntries: () => Promise<Entry[]> }): Controller<any, Entry[]> {
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

export function makeDeleteEntry({ deleteEntry }: { deleteEntry: DeleteEntryUseCase }): Controller<string, boolean> {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const res = await deleteEntry(httpRequest.body);
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

export function makePostEntry({ addEntry }: { addEntry: AddEntryUseCase }): Controller<AddEntry, Entry> {
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

export function makeUpdateEntry({ updateEntry }: { updateEntry: UpdateEntryUseCase }): Controller<UpdateEntry, Entry> {
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
