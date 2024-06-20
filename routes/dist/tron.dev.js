"use strict";

var express = require("express");

var router = express.Router();

var tronHandle = require("../routes_handle/tron");

router.post("/createAccount", tronHandle.createAccount);
router.post("/importMnemonic", tronHandle.importMnemonic);
router.post("/importPrivateKey", tronHandle.importPrivateKey);
router.post("/getBalance", tronHandle.getBalance);
router.post("/getContractBalance", tronHandle.getContractBalance);
router.post("/getTransactionInfoById", tronHandle.getTransactionInfoById);
router.post("/getTransactionInfoByBlockNum", tronHandle.getTransactionInfoByBlockNum);
router.post("/getLatestBlock", tronHandle.getLatestBlock);
router.post("/sendTransaction", tronHandle.sendTransaction);
router.post("/sendContractTransaction", tronHandle.sendContractTransaction);
router.post("/getTransactionList", tronHandle.getTransactionList);
router.post("/getApiTradeLog", tronHandle.getApiTradeLog);
module.exports = router;