// const { database } = require("../database");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

// Get Users
async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.send({ message: error });
  }
}

// Sign Up
async function signUp(req, res) {
  try {
    const { username, email, password, devices, hourRate } = req.body;

    // find if email already exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      devices,
      hourRate,
    });

    // const accessToken = newUser.generateAccessToken(newUser._id);
    // res.cookie("jwt", accessToken, { maxAge: 150 });

    res.status(201).json({ message: "succefully added", data: newUser });
  } catch (error) {
    res.status(401).json({
      message: "User not successful created",
      error: error.mesage,
    });
  }
}

// Get a User
async function getUserByEmail(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.find({ email, password });
    res.send(user);
  } catch (error) {
    res.send({ message: error });
  }
}

// Delete a user
async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: `no user found with id: ${id}` });
    }
    res.status(200).json({ message: "succefully deleted", deleted_user: user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
// Edit a user
async function EditUser(req, res) {
  const { id, devices, hourRate } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { devices, hourRate });
    if (!user) {
      return res.status(404).send({ message: "no user found" });
    }
    res.status(200).json({ message: "succefully Updated" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

// Login
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // check if user exists
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      });
    }
    // check if password is accurate
    else if (!(await user.validatePassword(password, user.password))) {
      res.status(400).json({
        message: "Wrong password",
      });
    } else {
      // const accessToken = user.generateAccessToken(user._id);
      // res.cookie("jwt", accessToken, { maxAge: 150 });

      res.status(200).json({
        message: "Login successful",
        user,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
}

module.exports = {
  getAllUsers,
  signUp,
  deleteUser,
  login,
  getUserByEmail,
  EditUser,
};
