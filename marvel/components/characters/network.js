const express = require("express");
const router = express.Router();
const config = require("../../../config");
const fetch = require("node-fetch");

router.get("/syncup/:character", syncUp);
router.get("/:character", get);

function get(req, res) {
  res.send(`calling character ${req.params.character}`);
}

function syncUp() {
  const CHARACTER_NAME = req.params.character;
  fetch(
    `https://gateway.marvel.com/v1/public/characters?name=${CHARACTER_NAME}&ts=${config.api.ts}&apikey=${config.api.apikey}&hash=${config.api.hash}`,
  )
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((error) => console.log(error));
}

module.exports = router;
