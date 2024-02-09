var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var offersRouter = require("./routers/offers");
var userRouter = require("./routers/user");
var agencyRouter = require("./routers/agency");

var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", offersRouter);
app.use("/user", userRouter);
app.use("/agency", agencyRouter);

module.exports = app;
