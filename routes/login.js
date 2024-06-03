const express = require('express');
const router = express.Router();

const loginHandle = require('../routes_handle/login')

router.post('/register', loginHandle.register)
router.post('/login', loginHandle.login)

module.exports = router;