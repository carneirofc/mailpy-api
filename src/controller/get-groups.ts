const makeGetGroups = ({ listGroups }) => {
  return async (httpRequest) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const groups = await listGroups();
      return {
        headers,
        statusCode: 200,
        body: groups,
      };
    } catch (e) {
      console.error(`Failed to get groups ${e}`, e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
};
export default makeGetGroups;
