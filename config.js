require("dotenv").config();

module.exports = {
  marvel: {
    host: process.env.HOST,
    port: process.env.PORT || 3001,
  },
  api: {
    ts: process.env.TS,
    apikey: process.env.APIKEY,
    hash: process.env.HASH,
  },
  mongodb: {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
  },
};
