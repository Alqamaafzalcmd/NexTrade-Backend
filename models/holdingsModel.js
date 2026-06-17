const mongoose = require('mongoose');

const {holdingsSchema} = require("../schemas/holdingsSchema");

const Holding = mongoose.model("Holding", holdingsSchema);

module.exports = Holding;
