const express = require("express");
const cors = require("cors");
const { dbConnect } = require("./database");
const receiptsRoutes = require("./routes/receipts");
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// routes
app.use(receiptsRoutes);
app.use(userRoutes);

const PORT = 8000;
async function start() {
  dbConnect().then(() =>
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    })
  );
}

start();
