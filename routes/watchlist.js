const express = require("express");
const router = express.Router();
const watchlistController = require("../controllers/watchlists");


router.route("/")
  .get(watchlistController.getAll);

module.exports = router;
