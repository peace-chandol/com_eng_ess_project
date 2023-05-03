const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const AppError = require("./utils/appError");
const itemsRoutes = require("./routes/itemsroutes");
const mycoursevilleRoutes = require("./routes/mycoursevilleRoutes");

const app = express();

const sessionOptions = {
  secret: "my-secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    // setting this false for http connections
    secure: false,
  },
};

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(express.static("static"));
app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/items", itemsRoutes);
app.use("/courseville", mycoursevilleRoutes);
app.get("/", (req, res) => {
  res.send("Congratulation. This server is successfully run.");
  console.log("RUN!!!!");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.get('/favicon.ico', (req, res) => res.status(204));
module.exports = app;