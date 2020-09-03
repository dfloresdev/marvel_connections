const express = require("express");
const router = express.Router();
const config = require("../../../config");
const fetch = require("node-fetch");
const controller = require("./index");
const { getTotalPages, promiseTemplate, runAllPromises } = require("./utils");

router.get("/:character", get);
router.get("/syncup/:character", syncUp);

function upsert(objCollaborators, res) {
  const collaborators = controller
    .upsert(objCollaborators)
    .then((responseMongo) => {
      res.json(responseMongo);
    })
    .catch((err) => res.json(err));
}

function get(req, res) {
  res.send(`calling character ${req.params.character}`);
}

function syncUp(req, res) {
  const CHARACTER_NAME = encodeURI(req.params.character);

  fetch(
    `https://gateway.marvel.com/v1/public/characters?name=${CHARACTER_NAME}&ts=${config.api.ts}&apikey=${config.api.apikey}&hash=${config.api.hash}`,
  )
    .then((res) => res.json())
    .then(async (info) => {
      if (info.data.total > 0) {
        let arrayPromises = [];
        const URI = info.data.results[0].comics.collectionURI;
        let offsets = await getTotalPages(URI);

        for (let i = 0; i < offsets; i++) {
          arrayPromises.push(promiseTemplate(URI, offsets));
        }

        const objCollaborators = await runAllPromises(arrayPromises);

        upsert(objCollaborators, res);
      } else {
        res.json("Character not found");
      }
    })
    .catch((error) => console.log(error));
}

module.exports = router;
