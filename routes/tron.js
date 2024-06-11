const express = require("express");

const router = express.Router();

const tronHandle = require("../routes_handle/tron");

router.post("/getAccount", tronHandle.getAccount);
router.post("/getBalance", tronHandle.getBalance);

module.exports = router;
