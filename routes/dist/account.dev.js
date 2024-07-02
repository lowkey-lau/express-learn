"use strict";

var express = require("express");

var router = express.Router();

var accountHandle = require("../routes_handle/account"); // const { register_limit } = require("../limit/account");
// router.post('/register', expressJoi(register_limit), accountHandle.register)
// router.post('/account', expressJoi(account_limit), accountHandle.account)


router.post("/register", accountHandle.register);
router.post("/login", accountHandle.login); // router.post("/delete", accountHandle.delete);
// router.post("/test", accountHandle.test);

module.exports = router;