const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const holdingsSchema = new Schema({
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});


module.exports = {holdingsSchema};
