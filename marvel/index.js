const express = require("express");
const config = require("../config");
const app = express();
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
app.use(cors());

const collaborators = require("./components/collaborators/network");
const characters = require("./components/characters/network");
const errors = require("../network/errors");
const swaggerDoc = require("./swagger.json");

// ROUTER
app.use("/marvel/collaborators", collaborators);
app.use("/marvel/characters", characters);

app.use("/documentation", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use(errors);

app.get("/", function (req, res) {
  res.send("Hello World ");
});

app.listen(config.marvel.port, () => {
  console.log(`Running -> ${config.marvel.host}:${config.marvel.port}`);
});
