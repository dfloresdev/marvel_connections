const fetch = require("node-fetch");
const config = require("../../../config");

let promiseTemplate = (uri, offset) => {
  let response = [];
  return new Promise((resolve, reject) => {
    fetch(
      `${uri}?limit=100&offset=${offset}&ts=${config.api.ts}&apikey=${config.api.apikey}&hash=${config.api.hash}`,
    )
      .then((res) => res.json())
      .then((info) => {
        info.data.results.map((element) => {
          element.characters.items.map((character) => {
            if (character.name.toLowerCase() !== "iron man") {
              let findCharacter = response.find((characterResponse, index) => {
                if (characterResponse.character === character.name) {
                  characterResponse.comics.push(element.title);
                  response[index] = {
                    character: characterResponse.character,
                    comics: [...new Set(characterResponse.comics)],
                  };
                }
              });

              if (!findCharacter) {
                response.push({
                  character: character.name,
                  comics: [element.title],
                });
              }
            }
          });
        });

        resolve(response);
      })
      .catch((error) => reject(error));
  });
};

function cleanDatar(data) {
  data.reduce((beforeData, currentData) => {
    const result = beforeData.find(
      (item) => item.character === currentData.character,
    );
    if (!result) {
      return beforeData.concat([currentData]);
    } else {
      return beforeData;
    }
  }, []);
}

function runAllPromises(arrayPromises) {
  let arrayCharacters = [];
  let response = {};
  return new Promise((resolve, reject) => {
    Promise.all(arrayPromises).then(
      (values) => {
        values.map((elements) => {
          arrayCharacters.push(...elements);
        });

        const newValues = arrayCharacters.reduce((beforeData, currentData) => {
          const result = beforeData.find(
            (item) => item.character === currentData.character,
          );
          if (!result) {
            return beforeData.concat([currentData]);
          } else {
            return beforeData;
          }
        }, []);

        let options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };
        let currentDate = new Date();

        response = {
          last_sync: currentDate.toLocaleDateString("es-ES", options),
          characters: newValues,
        };
        resolve(response);
      },
      (reason) => {
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
