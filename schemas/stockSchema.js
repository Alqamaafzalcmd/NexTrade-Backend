const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  symbol: String,
  name: String,
  currentPrice: Number,
  previousClose: Number,
  change: Number,
  changePercent: Number,
  high:Number,
  low:Number,
  open:Number,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {stockSchema};