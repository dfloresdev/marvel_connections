var ObjectId = require("mongodb").ObjectID;

const TABLE = "collaborators";

module.exports = (injectedStore) => {
  let store = injectedStore;

  if (!store) {
    store = require("../../../store/dummy");
  }

  function list() {
    return store.list(TABLE);
  }

  async function upsert(objCollaborators) {
    objCollaborators.id = new ObjectId();
    return store.upsert(TABLE, objCollaborators);
  }

  return {
    list,
    upsert,
  };
};
