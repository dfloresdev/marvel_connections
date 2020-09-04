var ObjectId = require("mongodb").ObjectID;

const TABLE = "characters";

module.exports = (injectedStore) => {
  let store = injectedStore;

  if (!store) {
    store = require("../../../store/dummy");
  }

  function get(id_character) {
    return store.get(TABLE, id_character);
  }

  async function upsert(objCollaborators) {
    objCollaborators.id = new ObjectId();
    return store.upsert(TABLE, objCollaborators);
  }

  return {
    get,
    upsert,
  };
};
