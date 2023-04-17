const Receipt = require("./model");

// Get Receipts
async function getAllReceipts(req, res) {
  try {
    const receipts = await Receipt.find({});
    res.send(receipts);
  } catch (error) {
    res.send({ message: error });
  }
}

// Get user receipts
async function getUserReceipts(req, res) {
  const { user } = req.body;
  try {
    const receipts = await Receipt.find({ user });
    res.send(receipts);
  } catch (error) {
    res.send({ message: error });
  }
}

// Add a receipt
async function addReceipt(req, res) {
  try {
    const { date, charge, user } = req.body;
    const newReceipt = await Receipt.create({ date, charge, user });
    res.send({ message: "succefully added", data: newReceipt });
  } catch (error) {
    res.send({ message: error });
  }
}

// Delete a receipt
async function deleteReceipt(req, res) {
  const id = req.params.id;
  try {
    const receipt = await Receipt.findByIdAndDelete(id);
    if (!receipt) {
      return res.status(404).send({ message: "no task found with that id" });
    }
    res
      .status(200)
      .json({ message: "succefully deleted", deleted_receipt: receipt });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = { getAllReceipts, addReceipt, getUserReceipts, deleteReceipt };
