const Order = require("../models/ordersModel");
const User = require("../models/usersModel");
const Holding = require("../models/holdingsModel");
const Position = require("../models/positionsModel");

module.exports.addOrders = async (req, res, next) => {

  // status --> Pending, Completed, Failed
  // console.log("adding order");

  // let status = req.body.product === "MIS" ? "Pending" : "Completed";

  let status = "Completed";
  console.log(req.body);
  
  let user = await User.findOne({_id: req.user._id });

  if (req.body.mode === "BUY" &&
     user.funds < req.body.price) {
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
