const mongoose = require("mongoose");
const { stockSchema } = require("../schemas/stockSchema");

const Stock = new mongoose.model("Stock", stockSchema);

module.exports = Stock;
