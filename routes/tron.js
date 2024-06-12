const express = require("express");

const router = express.Router();

const tronHandle = require("../routes_handle/tron");

router.post("/createAccount", tronHandle.createAccount);
router.post("/importMnemonic", tronHandle.importMnemonic);
router.post("/importPrivateKey", tronHandle.importPrivateKey);
router.post("/getBalance", tronHandle.getBalance);
router.post("/getAddressBalance", tronHandle.getAddressBalance);
router.post("/getTransactionInfoById", tronHandle.getTransactionInfoById);
router.post("/getTransactionInfoByBlockNum", tronHandle.getTransactionInfoByBlockNum);
router.post("/getNowBlock", tronHandle.getNowBlock);
router.post("/sendTransaction", tronHandle.sendTransaction);
router.post("/sendAddressTransaction", tronHandle.sendAddressTransaction);

module.exports = router;
