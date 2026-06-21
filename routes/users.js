const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const Position = require("../models/positionsModel");
const Holding = require("../models/holdingsModel");
const Stock = require("../models/stockModel")
const { userVerification } = require("../middlewares/authorization");

router.route("/addfunds").post(userVerification, async (req, res) => {
  // console.log("adding funds");
  // console.log(req.body);
  const amount = Number(req.body.field);

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "valid fund amount is required" });
  }

  let currUser = await User.findById(req.user.id);
  currUser.funds += amount;

  await currUser.save();
  res.status(200).json({
    success: true,
    message: "Funds added successfully.",
  });
});

router.route("/withdrawfunds").post(userVerification, async (req, res) => {
  console.log("adding funds");

  const amount = Number(req.body.field);
  let currUser = await User.findById(req.user.id);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "valid fund amount is required" });
  }
  // console.log(currUser.funds,amount);
  if (currUser.funds < amount) {
    return res.status(400).json({ message: "insufficient amount to withdraw" });
  }

  currUser.funds -= amount;
  await currUser.save();
  res.status(200).json({
    success: true,
    message: "Funds withdrawn successfully.",
  });
});

router.route("/info")
     .get(userVerification, async (req, res) => {
        let funds, usedMargin, positionValue = 0, holdingValue = 0;
        let user = await User.findOne({_id:req.user.id});
        funds = user.funds;
        usedMargin = user.usedMargin;

        let holding = await Holding.find({customer:req.user._id});
        // console.log(holding);

      for (const h of holding) {
        const stock = await Stock.findOne({ name: h.name });
        holdingValue += h.qty * stock.currentPrice;
      }

     


       let position = await Position.find({customer:req.user._id});
      //  console.log(position);
      
         for (const p of position) {
           const stock = await Stock.findOne({ name: p.name });
           positionValue += p.qty * stock.currentPrice;
         }

         res.send({
           funds,
           usedMargin,
           holdingValue,
           positionValue,
         });
        
     });

module.exports = router;
