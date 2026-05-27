const express = require('express');
const router = express.Router();
const HoldingsModel = require('../models/holdingsModel');



router.route("/")
   .get(async (req, res) => {
        let allHoldings = await HoldingsModel.find({});
        res.send(allHoldings);
   })






module.exports = router;