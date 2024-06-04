const joi = require('joi');

//string 判断是否为字符串
//alphanum 判断是否a-z A-Z 0-9
//min 最小
//max 最大
//required 必填
//pattern 正则

const account = joi.string().alphanum().min(6).max(12).required()

const password = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required()

exports.login_limit = {
    body: {
        account,
        password
    }
}