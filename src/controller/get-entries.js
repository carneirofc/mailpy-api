const makeGetEntries = ({ listEntries }) => {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json"
    };
    try {
      const entries = await listEntries();
      return {
        headers,
        statusCode: 200,
        body: entries
      }
    } catch (e) {
      console.error(`Failed to get entries ${e}`, e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  };
}
export default makeGetEntries;
