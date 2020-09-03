const db = require("mongoose");
const config = require("../config");
const ModelCollaborators = require("../marvel/components/collaborators/model");

db.Promise = global.Promise;

db.connect(
  `mongodb+srv://${config.mongodb.user}:${config.mongodb.pass}@marvel.ijeop.mongodb.net`,
  { useUnifiedTopology: true, useNewUrlParser: true },
);

console.log("[DB Connection] successfully");

async function list(table) {
  if (table === "collaborators") {
    const employees = ModelCollaborators.find();
    return employees;
  }
}

async function upsert(table, data) {
  data._id = data.id;

  if (table === "collaborators") {
    let exist = await ModelCollaborators.findOne({ _id: data._id });
    if (exist) {
      exist.update(data, (err) => {
        if (err) console.log(err);
      });
    } else {
      const collaborators = new ModelCollaborators(data);
      collaborators.save();
    }
  } else {
  }
}

module.exports = {
  list,
  upsert,
};
