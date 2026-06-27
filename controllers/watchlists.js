const Stock = require("../models/stockModel");

module.exports.getAll = async (req, res) => {
  let stock = await Stock.find({});
  res.send(stock);
};
