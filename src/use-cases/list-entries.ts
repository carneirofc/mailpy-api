const makeListEntries = ({ mailpyDb }) => {
  return async function () {
    const entries = await mailpyDb.findAllEntries();
    return entries;
  };
};
export default makeListEntries;
