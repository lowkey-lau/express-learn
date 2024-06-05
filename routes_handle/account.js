const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../jwt_config/index')
const crypto = require('crypto');
const fs = require('fs')

exports.register = (req, res) => {
    const info = req.body;
    const files = res.files;

    const sql = 'select * from users where account = ?';

    db.query(sql, info.account, (err, results) => {
        if (err) return res.cc(err);
        if (results.length > 0) return res.cc('账号已存在')
        
        info.password = bcrypt.hashSync(info.password, 10);
        
        const create_time = new Date();
        
        const sql_inset_acccount = 'insert into users set ?';
        
        db.query(sql_inset_acccount, { 
            account: info.account,
            password: info.password,
            nickname: info.nickname,
            email: info.email,
            sex: info.sex,
            identity: '用户',
            identityId: 0,
            create_time,
            update_time: create_time,
            status: 0
        }, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('注册失败')
            
            const onlyId = crypto.randomUUID();
            let oldName = req.files[0].filename;
            let newName = Buffer.from(req.files[0].originalname, 'latin1').toString('utf8');
            fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName);

            const sql_inset_img = 'insert into images set ?';

            const url = `http://127.0.0.1:3007/upload/${newName}`

            db.query(sql_inset_img, {
                image_url: url,
                onlyId
            }, (err, result) => {
                if (err) return res.cc(err);

                const sql_update = 'update images set account = ? where onlyId = ?'
                db.query(sql_update, [info.account, onlyId], (err, result) => {
                    if (err) return res.cc(err);

                    if (result.affectedRows == 1) {
                        const sql_select = 'update users set image_url = ? where account = ?'
                        
                        db.query(sql_select, [url, info.account], (err, result) => {
                            if (err) return res.cc(err);

                            return res.send({
                                status: 0,
                                msg: '注册成功'
                            })
                        })
                    }
                })
            })
        })
    })
}

exports.login = (req, res, next) => {
    const info = req.body;

    console.log(info)

    const sql = 'select * from users where account = ?'

    db.query(sql, info.account, (err, results) => {

        if (err) return res.cc(err)
        
        if (results.length <= 0) return res.cc('找不到该用户')
        
        const compareResult = bcrypt.compareSync(info.password, results[0].password)

        if (!compareResult) return res.cc('密码不正确')

        if (results.status == 1) return res.cc('账号被冻结')

        const user = {
            ...results[0],
        }

        const tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey)

        res.send({
            data: {
                token: tokenStr
            },
            code: 0,
            msg: '登录成功'
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
                code: 0,
                msg: '删除成功'
            })
        })
    })
}