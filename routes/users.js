var express = require("express");
var router = express.Router();

/* GET users_info  listing. */
// router.get('/', function (req, res, next) {
//   const params = req.query
//   res.send(params)
// });

router.get("/", function (req, res) {
  res.render("users", {
    title: "EJS example",
    header: "Some users ",
  });
});

module.exports = router;
