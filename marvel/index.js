const express = require("express");
const config = require("../config");
const app = express();

const collaborators = require("./components/collaborators/network");
const characters = require("./components/characters/network");

// ROUTER
app.use("/marvel/collaborators", collaborators);
app.use("/marvel/characters", characters);

app.get("/", function (req, res) {
  res.send("Hello World ");
});

app.listen(config.api.port, () => {
  console.log(`Running -> ${config.api.host}:${config.api.port}`);
});
