const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "secert2020";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
    },
    devices: {
      type: Number,
      required: [true, "can't be blank"],
    },
    hourRate: {
      type: Number,
      required: [true, "can't be blank"],
    },
    recepits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Receipt" }],
  },
  { timestamps: true }
);

UserSchema.methods.validatePassword = async function (userPassword, hash) {
  return bcrypt.compare(userPassword, hash);
};

UserSchema.methods.generateAccessToken = function (id) {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: "15s" });
};

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model("User", UserSchema);
