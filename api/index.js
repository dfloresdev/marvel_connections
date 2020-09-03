const express = require("express");
const config = require("../config");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello World massimo");
});

app.listen(config.api.port, () => {
  console.log(`Running -> ${config.api.host}:${config.api.port}`);
});
