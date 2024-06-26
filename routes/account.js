const express = require('express');
const Joi = require('joi')
const router = express.Router();

const accountHandle = require('../routes_handle/account')

const expressJoi = require('@escook/express-joi')

const multer = require('multer');
const upload = multer({ dest: './public/upload' })

const {
    register_limit
} = require('../limit/account')

// router.post('/register', expressJoi(register_limit), accountHandle.register)
// router.post('/account', expressJoi(account_limit), accountHandle.account)
router.post('/register',  upload.any(), expressJoi(register_limit), accountHandle.register)
router.post('/login',  accountHandle.login)
router.post('/delete',  accountHandle.delete)
router.post('/test',  accountHandle.test)

module.exports = router;