const db = require('../db/index')
const bcrypt = require('bcrypt')

exports.register = (req, res) => {
    const regInfo = req.query;

    if (!regInfo.account || !regInfo.password) {
        return res.send({
            status: 1,
            message: '账号或者密码不能为空'
        })
    }

    const sql = 'select * from users where account = ?';

    db.query(sql, regInfo.account, (err, results) => {
        console.log(results)

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
        }, (err, results => {
            if (results.affectedRows !== 1) {
                return res.send({
                    status: 1,
                    message: '注册失败'
                })
            }

            res.send({
                status: 0,
                message: '注册成功'
            })
        }))
    })
}

exports.login = (req, res) => {
    res.send('登陆')
}