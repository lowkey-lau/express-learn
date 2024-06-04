const db = require('../db/index')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const jwtConfig = require('../jwt_config/index')

const crypto = require('crypto');
const fs = require('fs')

exports.uploadAvatar = (req, res) => {
    const onlyId = crypto.randomUUID();
    let oldName = req.files[0].filename;
    let newName = Buffer.from(req.files[0].originalname, 'latin1').toString('utf8');
    
    fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName);

    const sql_inset = 'insert into images set ?';

    db.query(sql_inset, {
        image_url: `http://127.0.0.1:3007/upload/${newName}`,
        onlyId
    }, (err, result) => {
        if (err) return res.cc(err);

        res.send({
            onlyId,
            status: 0,
            url: 'http://127.0.0.1:3007/upload/' + newName
        })
    })

    // console.log(req.body.file[0])

    // res.send('我再上传图片')
}

exports.bindAccount = (req, res) => {
    const { account, onlyId, url } = req.body;

    const sql_update = 'update images set account = ? where onlyId = ?'

    db.query(sql_update, [account, onlyId], (err, result) => {
        if (err) return res.cc(err);

        if (result.affectedRows == 1) {
            const sql_select = 'update users set image_url = ? where account = ?'
            
            db.query(sql_select, [url, account], (err, result) => {
                if (err) return res.cc(err);

                res.send({
                    status: 0,
                    message: '修改成功'
                })
            })
        }
    })
} 