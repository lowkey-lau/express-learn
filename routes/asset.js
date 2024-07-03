const express = require("express");
const router = express.Router();
const asset = require("../routes_handle/asset");

router.get("/getUserAsset", asset.getUserAsset);
router.get("/getCurrencyConfig", asset.getCurrencyConfig);

module.exports = router;
