const express = require("express");
const router = express.Router();
const config = require("../../../config");
const fetch = require("node-fetch");
const { response } = require("express");

router.get("/:character", get);
router.get("/syncup/:character", syncUp);

let promiseTemplate = (uri, offset) => {
  let editors = [];
  let writers = [];
  let colorists = [];
  let response = {};
  return new Promise((resolve, reject) => {
    fetch(
      `${uri}?limit=100&offset=${offset}&ts=${config.api.ts}&apikey=${config.api.apikey}&hash=${config.api.hash}`,
    )
      .then((res) => res.json())
      .then((info) => {
        info.data.results.map((element) => {
          element.creators.items.map((human) => {
            switch (human.role) {
              case "editor":
                editors.push(human.name);
                break;
              case "writer":
                writers.push(human.name);
                break;
              case "colorist":
                colorists.push(human.name);
                break;
            }
          });
        });
        response = {
          editors: editors,
          writers: writers,
          colorist: colorists,
        };
        resolve(response);
      })
      .catch((error) => reject(error));
  });
};

function get(req, res, next) {
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

        runAllPromises(req, res, arrayPromises);
      } else {
        res.json("Character not found");
      }
    })
    .catch((error) => console.log(error));
}

function runAllPromises(req, res, arrayPromises) {
  let editors = [];
  let writers = [];
  let colorists = [];
  let response = {};

  Promise.all(arrayPromises).then(
    (values) => {
      values.map((elements) => {
        editors.push(...elements.editors);
        writers.push(...elements.writers);
        colorists.push(...elements.colorist);
      });
      let options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      let fecha = new Date();

      response = {
        last_sync: fecha.toLocaleDateString("es-ES", options),
        editors: editors,
        writers: writers,
        colorist: colorists,
      };
      res.json(response);
    },
    (reason) => {
      console.log(reason);
    },
  );
}

function getTotalPages(uri) {
  return new Promise((resolve, reject) => {
    fetch(
      `${uri}?limit=1&ts=${config.api.ts}&apikey=${config.api.apikey}&hash=${config.api.hash}`,
    )
      .then((res) => res.json())
      .then((info) => {
        const offset = Math.ceil(info.data.total / 100);
        resolve(offset);
      })
      .catch((error) => reject(error));
  });
}

module.exports = router;
