require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');



const { HoldingsModel } = require("./models/holdingsModel");
const { PositionsModel } = require("./models/positionsModel");
const { OrdersModel } = require("./models/ordersModel");
const {
  holdings,
  positions,
  watchlist,
} = require("../dashboard/src/data/data");


const holdingsRouter = require('./routes/holdings');
const positionsRouter = require('./routes/positions');
const userRouter = require('./routes/users');


const PORT = process.env.PORT || 8080;
const url = process.env.MONGO_URL;

// parsing data and security
// app.use(cors());

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());




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


app.get("/", (req, res, next) => {
  res.send("You are on root Path!!");
  console.log("welcome to root path");
});


app.use("/holdings", holdingsRouter);
app.use("/positions", positionsRouter);

// Authenticatin (login, logout, signup)
app.use("/", userRouter);




// adding new Order 
app.post('/newOrder', async (req, res) => {
       let newOrder =  new OrdersModel({
         name:req.body.name,
         qty: req.body.qty,
         price: req.body.price,
         mode: req.body.mode,
       });

      newOrder.save()
      .then(()=> {
        console.log("saved");
      })
      .catch((err) => {
        console.log(err.message);
      })
      //  res.send("Order saved");
});


app.listen(PORT, () => {
  console.log(`app is started on port ${PORT} ....`);
});



