const express = require("express");
const router = express.Router();

const userRoutes = require("../domains/user");
const receiptsRoutes = require("../domains/receipts");

router.use(userRoutes);
router.use(receiptsRoutes);

module.exports = router;
