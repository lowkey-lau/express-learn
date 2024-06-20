"use strict";

var express = require("express");

var router = express.Router();

var ethHandle = require("../routes_handle/eth");

router.post("/createAccount", ethHandle.createAccount);
router.post("/importMnemonic", ethHandle.importMnemonic);
router.post("/importPrivateKey", ethHandle.importPrivateKey);
router.post("/getBalance", ethHandle.getBalance);
router.post("/getContractBalance", ethHandle.getContractBalance);
router.post("/getTransactionInfoById", ethHandle.getTransactionInfoById);
router.post("/getTransactionInfoByBlockNum", ethHandle.getTransactionInfoByBlockNum);
router.post("/getLatestBlock", ethHandle.getLatestBlock);
router.post("/sendTransaction", ethHandle.sendTransaction);
router.post("/sendContractTransaction", ethHandle.sendContractTransaction);
router.post("/getTransactionList", ethHandle.getTransactionList);
module.exports = router;