const mongoose = require('mongoose');

const {holdingsSchema} = require("../schemas/holdingsSchema");


const HoldingsModel = mongoose.model("Holding", holdingsSchema);

module.exports = { HoldingsModel };

