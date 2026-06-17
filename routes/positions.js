const express = require("express");
const router = express.Router();

const Position = require("../models/positionsModel");

router
  .route("/")
     .get(async (req, res) => {
       let allPositions = await Position.find({});
       res.send(allPositions);
      });

  

module.exports = router;
