const db = require("mongoose");
const config = require("../config");
const ModelCollaborators = require("../marvel/components/collaborators/model");
const ModelCharacters = require("../marvel/components/characters/model");

db.Promise = global.Promise;

db.connect(
  `mongodb+srv://${config.mongodb.user}:${config.mongodb.pass}@marvel.ijeop.mongodb.net`,
  { useUnifiedTopology: true, useNewUrlParser: true },
);

console.log("[DB Connection] successfully");

async function list(table) {
  if (table === "collaborators") {
    const collaborators = ModelCollaborators.find();
    return collaborators;
  }
}

async function get(table, id) {
  if (table === "collaborators") {
    const character = ModelCollaborators.findOne({ id_character: id });
    return character;
  } else if (table === "characters") {
    const character = ModelCharacters.findOne({ id_character: id });
    return character;
  }
}

async function upsert(table, data) {
  if (table === "collaborators") {
    let exist = await ModelCollaborators.findOne({
      id_character: data.id_character,
    });
    if (exist) {
      exist.updateOne(data, (err) => {
        if (err) console.error(err);
      });
    } else {
      const collaborators = new ModelCollaborators(data);
      collaborators.save();
    }
  } else if (table === "characters") {
    let exist = await ModelCharacters.findOne({
      id_character: data.id_character,
    });
    if (exist) {
      exist.updateOne(data, (err) => {
        if (err) console.error(err);
      });
    } else {
      const collaborators = new ModelCharacters(data);
      collaborators.save();
    }
  }
}

module.exports = {
  list,
  upsert,
  get,
};
