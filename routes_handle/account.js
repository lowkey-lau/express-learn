const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../jwt_config/index')
const crypto = require('crypto');
const fs = require('fs');

const sqlQuery = (sqlStr, option) => {
    return new Promise((resolve, reject) => {
        db.query(sqlStr, option, (err, res) => { 
            if (err)
                reject(err);
                resolve(res)
        })
    })
}

const transactionQuery = (connection, sqlStr, option) => {
    return new Promise((sqlResolve, sqlReject) => {
          const data = params[index];
          connection.query(sqlStr, data, (sqlErr, result) => {
            if (sqlErr) {
              return sqlReject(sqlErr);
            }
            sqlResolve(result);
          });
        });
}

exports.test = (req, res) => {
   var sqls = [
    // "insert into goods set ?", // 删除 语句
    // "delete from goods where goods_id = ?", // 删除 语句
    "update goods set num = ? where goods_id = ?;", // 更新语句
    ];
    var params = [
      // {'num': Math.random()}, // parmas 是数组格式 与sqls里的sql语句里 ? 一一对应
      // [1],
      [Math.random(), 1],
    ];

    transaction(sqls, params)
    .then((arrResult) => {
        // do anything ....
        res.send(arrResult)
        console.log(arrResult)
    })
    .catch((err) => {
        // error
        console.log(err);
    });
}
 
function transaction(sqls, params) { 
 return new Promise((resolve, reject) => {
    db.getConnection(function (err, connection) {
      // 连接失败 promise直接返回失败
      if (err) {
        return reject(err);
      }
      // 如果 语句和参数数量不匹配 promise直接返回失败
      if (sqls.length !== params.length) {
        connection.release(); // 释放掉
        return reject(new Error("语句与传值不匹配"));
      }
      // 开始执行事务
      connection.beginTransaction((beginErr) => {
        // 创建事务失败
        if (beginErr) {
          connection.release();
          return reject(beginErr);
        }
        console.log("开始执行事务，共执行" + sqls.length + "条语句");
        // 返回一个promise 数组
        let funcAry = sqls.map((sql, index) => {
          return new Promise((sqlResolve, sqlReject) => {
            const data = params[index];
            connection.query(sql, data, (sqlErr, result) => {
              if (sqlErr) {
                return sqlReject(sqlErr);
              }
              sqlResolve(result);
            });
          });
        });
        // 使用all 方法 对里面的每个promise执行的状态 检查
        Promise.all(funcAry)
          .then((arrResult) => {
            // 若每个sql语句都执行成功了 才会走到这里 在这里需要提交事务，前面的sql执行才会生效
            // 提交事务
            connection.commit(function (commitErr, info) {
              if (commitErr) {
                // 提交事务失败了
                console.log("提交事务失败:" + commitErr);
                // 事务回滚，之前运行的sql语句不生效
                connection.rollback(function (err) {
                  if (err) console.log("回滚失败：" + err);
                  connection.release();
                });
                // 返回promise失败状态
                return reject(commitErr);
              }

              connection.release();
              // 事务成功 返回 每个sql运行的结果 是个数组结构
              resolve(arrResult);
            });
          })
          .catch((error) => {
            // 多条sql语句执行中 其中有一条报错 直接回滚
            connection.rollback(function () {
              console.log("sql运行失败： " + error);
              connection.release();
              reject(error);
            });
          });
      });
    });
 });
}

exports.register = async (req, res) => {
    const info = req.body;
    const bcryptPwd = bcrypt.hashSync(info.password, 10);
    const create_time = new Date();
    const onlyId = crypto.randomUUID();
    const oldName = req.files[0].filename;
    const newName = Buffer.from(req.files[0].originalname, 'latin1').toString('utf8');
    fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName);
    const image_url = `http://127.0.0.1:3007/upload/${newName}`

    db.query('BEGIN TRAN');

    try {
        const selectUserRes = await sqlQuery('select * from users where account = ?', info.account)

        if (selectUserRes.length > 0) return res.cc('账号已存在')

        const insertUserRes = await sqlQuery('insert into users set ?', { 
            account: info.account,
            password: bcryptPwd,
            nickname: info.nickname,
            email: info.email,
            sex: info.sex,
            identity: '用户',
            identityId: 0,
            create_time,
            update_time: create_time,
            status: 0
        })
        if (insertUserRes.affectedRows !== 1) {
            db.query('ROLLBACK TRAN')
            return res.cc('注册失败')
        }
        const insertImgRes = await sqlQuery('insert into images set ?', {
            image_url,
            onlyId
        })
        if (insertImgRes.affectedRows !== 1) {
            db.query('ROLLBACK TRAN')
            return res.cc('注册失败')
        } else {
            await sqlQuery('update users set image_url = ? where account = ?', [image_url, info.account])

            db.query('COMMIT')

            res.send({
                status: 0,
                msg: '注册成功'
            })
        }
    } catch (error) {
        db.query('ROLLBACK TRAN')
        return res.cc(error)
    }
}

exports.login = (req, res, next) => {
    const info = req.body;

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