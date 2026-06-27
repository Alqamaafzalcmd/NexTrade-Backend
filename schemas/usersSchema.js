const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Your email is required"],
    // unique: true,
  },
  username: {
    type: String,
    required: [true, "Your name is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  funds: {
    type: Number,
    default:0,
  },
  usedMargin:{
    type:Number,
    default:0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = userSchema;
