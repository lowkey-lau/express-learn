"use strict";

require("babel-polyfill");

require("babel-register");

var createError = require("http-errors");

var express = require("express"); // const dotenv = require("dotenv");


var path = require("path");

var cookieParser = require("cookie-parser");

var logger = require("morgan");

var cors = require("cors");

var bodyParser = require("body-parser");

var db = require("./app/models");

db.sequelize.sync({
  alter: true // force: true,

}).then(function () {
  console.log("Drop and re-sync db.");
})["catch"](function (err) {
  console.log("Failed to sync db: " + err.message);
});

var indexRouter = require("./routes/index");

var usersRouter = require("./routes/users");

var accountRouter = require("./routes/account");

var assetsRouter = require("./routes/asset");

var userRouter = require("./routes/user");

var addressRouter = require("./routes/address");

var tronRouter = require("./routes/tron");

var ethRouter = require("./routes/eth");

var demoRouter = require("./routes/demo");

var app = express();

require("dotenv").config(); // view engine setup


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, PUT, DELETE");
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  next();
}); // app.use(upload.any())

app.use(express["static"]("./public")); // app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var jwtConfig = require("./jwt_config/index.js");

var _require = require("express-jwt"),
    jwt = _require.expressjwt;

var Joi = require("joi");

var _require2 = require("./utils/tron_helper.js"),
    Tron_helper = _require2.Tron_helper; // app.use(jwt({
//   secret: jwtConfig.jwtSecretKey, algorithms: ['HS256']
// }).unless({
//   path: [/^\/api\//]
// }))


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/user", userRouter);
app.use("/api/address", addressRouter);
app.use("/api/tron", tronRouter);
app.use("/api/eth", ethRouter);
app.use("/api/demo", demoRouter);
app.use("/api/account", accountRouter);
app.use("/api/asset", assetsRouter);
app.use(function (err, req, res, next) {
  if (err instanceof Joi.ValidationError) return res.cc(err);
}); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render("error");
});
app.listen(3007, function () {
  console.clear();
  console.log("Project run at port 3007"); //   console.log(`
  //   ______   ________  ______   _______   ________
  //  /      \ /        |/      \ /       \ /          /
  // /$$$$$$  |$$$$$$$$//$$$$$$  |$$$$$$$  |$$$$$$$$/
  // $$ \__$$/    $$ |  $$ |__$$ |$$ |__$$ |   $$ |
  // $$      \    $$ |  $$    $$ |$$    $$<    $$ |
  //  $$$$$$  |  $$ |  $$$$$$$$ |$$$$$$$  |   $$ |
  // /   \__$$ |  $$ |  $$ |  $$ |$$ |$$ |     $$ |
  // $$ /  $$/   $$ |  $$ |  $$ |$$ | $$ |    $$ |
  //  $$$$$$/    $$/   $$/   $$/ $$/   $$/    $$/
  // `);
  // const tron_helper = new Tron_helper();
  // tron_helper.ScanningBlock();
});
module.exports = app;