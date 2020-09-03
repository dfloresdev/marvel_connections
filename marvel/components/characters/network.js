const express = require("express");
const router = express.Router();

router.get("/:character", get);

function get(req, res, next) {
  res.send(`calling character ${req.params.character}`);
}

module.exports = router;
