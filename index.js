require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const { HoldingsModel } = require("./models/holdingsModel");
const { PositionsModel } = require("./models/positionsModel");
const {
  holdings,
  positions,
  watchlist,
} = require("../dashboard/src/data/data");

const PORT = process.env.PORT || 8080;
const url = process.env.MONGO_URL;

async function main() {
  await mongoose.connect(url);
}

main()
  .then(() => {
    console.log("connected to database succesfully....");
  })
  .catch((err) => {
    console.log("database connection failed !!!");
    console.log(err.message);
  });

  // inserting temp data ::::::::::::::::::::
// app.get("/addPostions", async (req, res) => {
// //   console.log(positions);
//   try {
//     positions.forEach((item) => {
//       let newPositions = new PositionsModel({
//         product: item.product,
//         name: item.name,
//         qty: item.qty,
//         avg: item.avg,
//         price: item.price,
//         net: item.net,
//         day: item.day,
//         isLoss: item.isLoss,
//       });

//       newPositions.save();
//     });

    
//   } catch (err) {
//     console.log(err.message);
//   }

//   res.send("data inserted!");
// });



// app.get("/addHoldings", async (req, res) => {
//   try {
//     await HoldingsModel.insertMany(holdings);
//     res.send("Data inserted successfully");
//   } catch (err) {
//     console.error("Failed to insert holdings:", err.message);
//     res.status(500).send("Failed to insert holdings");
//   }
// });

app.listen(PORT, () => {
  console.log(`app is started on port ${PORT} ....`);
});

app.get("/", (req, res, next) => {
  res.send("You are on root Path!!");
  console.log("welcome to root path");
});
