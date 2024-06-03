const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../jwt_config/index')

exports.register = (req, res) => {
    const regInfo = req.body;

    if (!regInfo.account || !regInfo.password) {
        return res.send({
            status: 1,
            message: '账号或者密码不能为空'
        })
    }

    const sql = 'select * from users where account = ?';

    db.query(sql, regInfo.account, (err, results) => {

        if (results.length > 0) {
            return res.send({
                status: 1,
                message: '账号已存在'
            })
        }

        regInfo.password = bcrypt.hashSync(regInfo.password, 10);

        const identity = '用户'
        
        const create_time = new Date();
        
        const sql_inset = 'insert into users set ?';
        
        db.query(sql_inset, {
            account: regInfo.account,
            password: regInfo.password,
            identity,
            create_time,
            status: 0
        }, (err, results) => {
            if (results.affectedRows !== 1) {
                return res.send({
                    status: 1,
                    message: '注册失败'
                })
            }

            return res.send({
                status: 0,
                message: '注册成功'
            })
        })
    })
}

exports.login = (req, res) => {
    const logInfo = req.body;

    const sql = 'select * from users where account = ?'

    db.query(sql, logInfo.account, (err, results) => {

        if (err) {
            return res.send({
                status: 1,
                message: err
            })
        }
        if (results.length <= 0) {
            return res.send({
                status: 1,
                message: '登陆失败'
            })
        }
        
        const compareResult = bcrypt.compareSync(logInfo.password, results[0].password)

        if (!compareResult) {
            return res.send({
                status: 1,
                message: '密码不正确'
            })
        }

        if (results.status == 1) {
            return res.send({
                status: 1,
                message: '账号被冻结'
            })
        }

        const user = {
            ...results[0],
        }

        console.log(jwtConfig.jwtSecretKey)

        const tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey)

        res.send({
            data: results[0],
            token: tokenStr,
            status: 0,
            message: '登录成功'
        })

    })
}