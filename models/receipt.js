const mongoose = require("mongoose");
const User = require("../models/user");

const ReceiptSchema = mongoose.Schema({
  date: { type: String, required: [true, "can't be blank"] },
  charge: { type: Number, required: [true, "can't be blank"] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Receipt", ReceiptSchema);
