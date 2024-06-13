const express = require("express");

const router = express.Router();

const ethHandle = require("../routes_handle/eth");

router.post("/createAccount", ethHandle.createAccount);
router.post("/importMnemonic", ethHandle.importMnemonic);

module.exports = router;
