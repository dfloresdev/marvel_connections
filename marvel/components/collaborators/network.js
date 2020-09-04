const express = require("express");
const router = express.Router();
const config = require("../../../config");
const fetch = require("node-fetch");
const controller = require("./index");
const { getTotalPages, promiseTemplate, runAllPromises } = require("./utils");
const templateResponse = require("../../../network/response");

router.get("/:character", get);
router.get("/syncup/:character", syncUp);

function upsert(objCollaborators, res, next) {
  const collaborators = controller
    .upsert(objCollaborators)
    .then((responseMongo) => {
      templateResponse.success(null, res, "perfect timing", 200);
    })
    .catch(next);
}

function get(req, res, next) {
  const ID = req.params.character.toLowerCase();
  const collaborators = controller
    .get(ID)
    .then((responseMongo) => {
      templateResponse.success(req, res, responseMongo, 200);
    })
    .catch(next);
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
          arrayPromises.push(promiseTemplate(URI, i));
        }

        const objCollaborators = await runAllPromises(arrayPromises);
        objCollaborators.id_character = info.data.results[0].name.toLowerCase();
        upsert(objCollaborators, res);
      } else {
        templateResponse.success(req, res, "Character not found", 200);
      }
    })
    .catch((error) => console.error(error));
}

module.exports = router;
