const express = require('express');
const Joi = require('joi')
const router = express.Router();

const accountHandle = require('../routes_handle/account')

const expressJoi = require('@escook/express-joi')

const {
    account_limit
} = require('../limit/account')

// router.post('/register', expressJoi(account_limit), accountHandle.register)
// router.post('/account', expressJoi(account_limit), accountHandle.account)
router.post('/register',  accountHandle.register)
router.post('/login',  accountHandle.login)
router.post('/delete',  accountHandle.delete)

module.exports = router;