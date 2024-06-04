const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../jwt_config/index')

exports.register = (req, res) => {
    const regInfo = req.body;

    if (!regInfo.account || !regInfo.password) return res.cc('账号或者密码不能为空')

    const sql = 'select * from users where account = ?';

    db.query(sql, regInfo.account, (err, results) => {

        if (results.length > 0) return res.cc('账号已存在')

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
            if (results.affectedRows !== 1) return res.cc('注册失败')

            return res.send({
                status: 0,
                message: '注册成功'
            })
        })
    })
}

exports.login = (req, res, next) => {
    const logInfo = req.body;

    const sql = 'select * from users where account = ?'

    db.query(sql, logInfo.account, (err, results) => {

        if (err) res.cc(err)
        
        if (results.length <= 0) res.cc('找不到该用户')
        
        const compareResult = bcrypt.compareSync(logInfo.password, results[0].password)

        if (!compareResult) return res.cc('密码不正确')

        if (results.status == 1) res.cc('账号被冻结')

        const user = {
            ...results[0],
        }

        const tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey)

        res.send({
            data: results[0],
            token: tokenStr,
            status: 0,
            message: '登录成功'
        })

    })
}

exports.delete = (req, res, next) => {
    const info = req.body;

    const sql_select = 'select * from users where account = ?'

    db.query(sql_select, info.account, (err, results) => {

        if (err) return res.cc(err)
        
        if (results.length <= 0) return res.cc('找不到该用户')
        
        const compareResult = bcrypt.compareSync(info.password, results[0].password)

        if (!compareResult) return res.cc('密码不正确')

        const sql_delete = 'delete from users where account = ?'

        db.query(sql_delete, info.account, (err, results) => {

            if (err) return res.cc(err)
            
            if (results.affectedRows !== 1) return res.cc('删除失败')
            
            res.send({
                status: 0,
                message: '删除成功'
            })
        })
    })
}