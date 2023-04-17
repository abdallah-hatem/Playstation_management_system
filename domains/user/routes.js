const express = require("express");
const {
  getAllUsers,
  signUp,
  deleteUser,
  login,
  getUserByEmail,
  EditUser,
} = require("./controller");

const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signUp);
router.route("/user").get(getAllUsers, getUserByEmail).put(EditUser);
router.route("/user/:id").delete(deleteUser);

module.exports = router;
