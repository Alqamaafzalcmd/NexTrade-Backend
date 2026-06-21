const express = require('express');
const router = express.Router();
const Stock = require('../models/stockModel');

router.route("/")
  .get(async (req, res) => {
       let stock = await Stock.find({});
       res.send(stock);
  })



module.exports = router;