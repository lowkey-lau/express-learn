"use strict";

var express = require("express");

var router = express.Router();

var assetsHandle = require("../routes_handle/assets"); // const { register_limit } = require("../limit/assets");
// router.post('/register', expressJoi(register_limit), assetsHandle.register)
// router.post('/assets', expressJoi(assets_limit), assetsHandle.assets)


router.get("/getUserAsset", assetsHandle.getUserAsset);
router.post("/login", assetsHandle.login); // router.post("/delete", assetsHandle.delete);
// router.post("/test", assetsHandle.test);

module.exports = router;