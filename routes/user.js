const express = require('express');

const router = express.Router();

const userHandle = require('../routes_handle/user')

const multer = require('multer');
const upload = multer({ dest: './public/upload' })

router.post('/uploadAvatar',  userHandle.uploadAvatar)
router.post('/bindAccount',  userHandle.bindAccount)
router.post('/getUserList',  userHandle.getUserList)
router.post('/getUserInfo',  userHandle.getUserInfo)
router.post('/updateUserInfo', upload.any(),   userHandle.updateUserInfo)
router.post('/deleteAccount',  userHandle.deleteAccount)

module.exports = router