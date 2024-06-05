const express = require('express');

const router = express.Router();

const userHandle = require('../routes_handle/user')

router.post('/uploadAvatar',  userHandle.uploadAvatar)
router.post('/bindAccount',  userHandle.bindAccount)
router.post('/getUserList',  userHandle.getUserList)
router.post('/getUserInfo',  userHandle.getUserInfo)
router.post('/deleteAccount',  userHandle.deleteAccount)

module.exports = router