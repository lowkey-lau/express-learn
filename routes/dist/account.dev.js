"use strict";

var router = require("express").Router();

var account = require("../routes_handle/account"); // const { register_limit } = require("../limit/account");
// router.post('/register', expressJoi(register_limit), account.register)
// router.post('/account', expressJoi(account_limit), account.account)


router.post("/register", account.register);
router.post("/login", account.login); // router.post("/delete", account.delete);
// router.post("/test", account.test);

module.exports = router;