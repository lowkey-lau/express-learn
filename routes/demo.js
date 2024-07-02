const express = require("express");

const router = express.Router();

const handle = require("../routes_handle/demo");

router.get("/getMnemonic", handle.getMnemonic);
router.post("/createAccount", handle.createAccount);
router.post("/importMnemonic", handle.importMnemonic);

module.exports = router;
