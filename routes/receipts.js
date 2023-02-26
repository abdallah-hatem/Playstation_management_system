const express = require("express");
const {
  getAllReceipts,
  addReceipt,
  deleteReceipt,
  getUserReceipts,
} = require("../controllers/receipts");

const router = express.Router();

router.route("/receipts").post(addReceipt);
router.route("/get-receipts").post(getUserReceipts);
router.route("/receipts/:id").delete(deleteReceipt);

module.exports = router;
