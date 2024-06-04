const express = require('express');
const Joi = require('joi')
const router = express.Router();

const loginHandle = require('../routes_handle/login')

const expressJoi = require('@escook/express-joi')

const {
    login_limit
} = require('../limit/login')

router.post('/register', expressJoi(login_limit), loginHandle.register)
router.post('/login', expressJoi(login_limit), loginHandle.login)

module.exports = router;