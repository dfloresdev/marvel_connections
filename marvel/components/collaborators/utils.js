const fetch = require("node-fetch");
const config = require("../../../config");

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

function runAllPromises(arrayPromises) {
  let editors = [];
  let writers = [];
  let colorists = [];
  let response = {};
  return new Promise((resolve, reject) => {
    Promise.all(arrayPromises).then(
      (values) => {
        values.map((elements) => {
          editors.push(...new Set(elements.editors));
          writers.push(...new Set(elements.writers));
          colorists.push(...new Set(elements.colorist));
        });
        editors = [...new Set(editors)];
        writers = [...new Set(writers)];
        colorists = [...new Set(colorists)];

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
        resolve(response);
      },
      (reason) => {
        console.log(reason);
        reject(reason);
      },
    );
  });
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

module.exports = {
  getTotalPages,
  promiseTemplate,
  runAllPromises,
};
