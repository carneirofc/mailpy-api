const makeListConditions = ({ mailpyDb }) => {
  return async function () {
    const conditions = await mailpyDb.findAllConditions();
    return conditions;
  }
};
export default makeListConditions;