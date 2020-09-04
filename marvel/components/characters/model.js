const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const charactersSchema = new Schema({
  id_character: "String",
  last_sync: "String",
  characters: [
    {
      character: "String",
      comics: ["String"],
    },
  ],
});

const modelCharacters = mongoose.model("characters", charactersSchema);
module.exports = modelCharacters;
