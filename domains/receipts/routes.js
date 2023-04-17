const express = require("express");
const {
  getAllReceipts,
  addReceipt,
  deleteReceipt,
  getUserReceipts,
} = require("./controller");

const router = express.Router();

router.route("/receipts").post(addReceipt).get(getAllReceipts);
router.route("/get-receipts").post(getUserReceipts);
router.route("/receipts/:id").delete(deleteReceipt);

module.exports = router;
