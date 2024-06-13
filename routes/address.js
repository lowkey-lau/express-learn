const express = require("express");

const router = express.Router();

const addressHandle = require("../routes_handle/address");

router.post("/getAddressList", addressHandle.getAddressList);

module.exports = router;
