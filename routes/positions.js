const express = require("express");
const router = express.Router();

const PositionsModel = require("../models/positionsModel");

router
  .route("/")

  .get(async (req, res) => {
    let allPositions = await PositionsModel.find({});
    res.send(allPositions);
  });


  

module.exports = router;
