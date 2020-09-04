const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const collaboratorsSchema = new Schema({
  id_character: "String",
  last_sync: "String",
  editors: ["String"],
  writers: ["String"],
  colorist: ["String"],
});

const modelCollaborators = mongoose.model("collaborators", collaboratorsSchema);
module.exports = modelCollaborators;
