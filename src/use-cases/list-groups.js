const makeListGroups = ({ mailpyDb }) => {
  return async function () {
    const groups = await mailpyDb.findAllGroups();
    return groups;
  };
};
export default makeListGroups;
