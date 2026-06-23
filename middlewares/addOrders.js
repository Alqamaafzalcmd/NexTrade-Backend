const Order = require("../models/ordersModel");
const User = require("../models/usersModel");
const Holding = require("../models/holdingsModel");

module.exports.addOrders = async (req, res, next) => {

  // status --> Pending, Completed, Failed
  // console.log("adding order");

  let status = req.body.product === "MIS" ? "Pending" : "Completed";
  // console.log(req.user);
  let user = await User.findOne({_id: req.user._id });
  let holding = await Holding.findOne({customer:req.user._id, name:req.body.name});

  if (req.body.mode === "BUY" && user.funds < req.body.price) {
    status = "Rejected";
  }

  if(req.body.mode === "SELL" && holding.qty < req.body.qty){
    status = "Rejected";
  }
  

  let newOrder = new Order({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
    status:status,
  });

  newOrder.customer = req.user._id;

  newOrder.save().catch(() => {});

  next();
};
