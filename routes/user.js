const express = require('express');

const router = express.Router();

const userHandle = require('../routes_handle/user')

router.post('/upload_avatar',  userHandle.uploadAvatar)

module.exports = router