"use strict";

var express = require("express");

var router = express.Router();

var asset = require("../routes_handle/asset");

router.get("/getUserAsset", asset.getUserAsset);
router.get("/getCurrencyConfig", asset.getCurrencyConfig);
module.exports = router;