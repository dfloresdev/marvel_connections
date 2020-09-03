const express = require("express");
const config = require("../config");
const app = express();

const collaborators = require("./components/collaborators/network");
const characters = require("./components/characters/network");
const errors = require("../network/errors");
// ROUTER
app.use("/marvel/collaborators", collaborators);
app.use("/marvel/characters", characters);

app.use(errors);

app.get("/", function (req, res) {
  res.send("Hello World ");
});

app.listen(config.marvel.port, () => {
  console.log(`Running -> ${config.marvel.host}:${config.marvel.port}`);
});
