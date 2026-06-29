require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const session = require("express-session");
const flash = require("connect-flash");

const Stock = require("./models/stockModel");
const Order = require("./models/ordersModel");

const holdingsRouter = require("./routes/holdings");
const positionsRouter = require("./routes/positions");
const authRouter = require("./routes/auth");
const orderRouter = require("./routes/orders");
const watchlistRouter = require("./routes/watchlist");
const userRouter = require("./routes/users");
const ExpressError = require("./utils/ExpressError");

// storage -----
const {MongoStore} = require("connect-mongo");

// symbols of stock
const symbols = require("./symbols");

const PORT = process.env.PORT;
const url = process.env.MONGO_URL;
const sessionSecret = process.env.SECRET || process.env.TOKEN_KEY;

if (!sessionSecret) {
  throw new Error("Session secret is required");
}

// parsing data and security
app.use(
  cors({
    origin: [`${process.env.FRONTEND_URL}`, `${process.env.DASHBOARD_URL}`],
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());



const store = MongoStore.create({
  mongoUrl: url,
  crypto: {
    secret: sessionSecret,
  },
  touchAfter: 24 * 3600, // time period in seconds
  ttl: 60 * 60 * 24 * 7,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store, // session storage
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // for security purpose , to prevent from crossscripting attack
    secure: true,
    sameSite: "none",
  },
};

app.use(session(sessionOptions));

app.use(flash());

async function main() {
  await mongoose.connect(url);
}

main()
  .then(() => {
    console.log("database connection successfull....");
  })
  .catch((err) => {
    console.log("database connection failed !!!");
    process.exit(1);
  });

app.get("/", (req, res, next) => {
  res.send("You are on root Path!!");
});

app.get("/flash-message", (req, res) => {
  const success = req.flash("success");
  const error = req.flash("error");

  res.json({
    success: success[0] || null,
    error: error[0] || null,
  });
});

app.get("/set-flash", (req, res, next) => {
  req.flash("sucess", "flash message sent successfully");

  res.json({
    success: success[0] || null,
    error: error[0] || null,
  });
});


let updateStockPrices = async () => {
  try {
    for (const { symbol, companyName } of symbols) {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_KEY}`,
      );

      const stock = await response.json();

      await Stock.findOneAndUpdate(
        { symbol },
        {
          name: companyName,
          symbol,
          currentPrice: stock.c,
          previousClose: stock.pc,
          change: stock.d,
          high: stock.h,
          low: stock.l,
          open: stock.o,
          changePercent: stock.dp,
          updatedAt: new Date(),
        },
        {
          upsert: true,
          returnDocument: "after",
        },
      );
    }
  } catch (err) {}
};

setInterval(updateStockPrices, 15000);


app.use("/holdings", holdingsRouter);
app.use("/positions", positionsRouter);
app.use("/orders", orderRouter);
app.use("/watchlist", watchlistRouter);
app.use("/users", userRouter);

// Authentication (login, logout, signup)
app.use("/auth", authRouter);


app.listen(PORT, () => {
  console.log("app is started ......");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;
  res.status(statusCode).send(message);
});
