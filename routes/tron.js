const express = require("express");

const router = express.Router();

const tronHandle = require("../routes_handle/tron");

router.post("/createAccount", tronHandle.createAccount);
router.post("/importMnemonic", tronHandle.importMnemonic);
router.post("/importPrivateKey", tronHandle.importPrivateKey);
router.post("/getAccount", tronHandle.getAccount);
router.post("/getBalance", tronHandle.getBalance);

module.exports = router;
