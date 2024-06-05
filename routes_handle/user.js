const db = require('../db/index')

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
            code: 0,
            url: 'http://127.0.0.1:3007/upload/' + newName
        })
    })
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
                    code: 0,
                    msg: '修改成功'
                })
            })
        }
    })
}

exports.getUserList = (req, res) => {
    const {pageNum = 1, pageSize = 20} = req.body;

    const sql_select = `select * from users order by id ASC limit ${pageSize} offset ${(pageNum - 1) * pageSize}`

    db.query(sql_select, '', (err, result) => {
        if (err) return res.cc(err);

        db.query('SELECT COUNT(*) FROM users', (err, count) => {
        if (err) return res.cc(err);
            res.send({
                data: {
                    total: count[0]['COUNT(*)'],
                    pageNum,
                    pageSize,
                    list: result
                },
                code: 0
            })
        });

    })
}

exports.getUserInfo = (req, res) => {
    const info = req.body;

    const sql_select = 'select * from users where account = ?'

    db.query(sql_select, info.account, (err, result) => {
        if (err) return res.cc(err);

        if (result.length == 0) return res.cc('未找到用户')
        
        res.send({
            data: result[0],
            code: 0
        })
    })
}

exports.deleteAccount = (req, res, next) => {
    const info = req.body;

    const sql_delete = 'delete from users where account = ?'

    db.query(sql_delete, info.account, (err, results) => {

        if (err) return res.cc(err)
        
        if (results.affectedRows !== 1) return res.cc('删除失败')
        
        res.send({
            code: 0,
            msg: '删除成功'
        })
    })
}