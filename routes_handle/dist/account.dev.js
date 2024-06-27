"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = require("../db/index");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var jwtConfig = require("../jwt_config/index");

var crypto = require("crypto");

var fs = require("fs");

var _require = require("../utils/tron_helper"),
    Tron_helper = _require.Tron_helper;

var xss = require("xss");

var sqlQuery = function sqlQuery(sqlStr, option) {
  return new Promise(function (resolve, reject) {
    db.query(sqlStr, option, function (err, res) {
      if (err) reject(err);
      resolve(res);
    });
  });
};

exports.test = function (req, res) {
  var account = db.escape(req.body.account);
  var email = db.escape(req.body.email);
  console.log(account);
  console.log(email);
  console.log(db.escape(account));
  console.log(db.escape(email)); // const account = db.escape(req.account);
  // const email = db.escape(req.password);

  var sqls = [// "insert into goods set ?", // 删除 语句
  // "delete from goods where goods_id = ?", // 删除 语句
  "select account from users_info where account = ".concat(account, " and email = ").concat(email) // 更新语句
  ];
  transaction(sqls, params).then(function (resData) {
    // do anything ....
    res.send({
      code: 0,
      data: resData[0] || []
    });
  })["catch"](function (err) {
    // error
    console.log(err);
  });
};

function transaction(sqls, params) {
  return new Promise(function (resolve, reject) {
    db.getConnection(function (err, connection) {
      // 连接失败 promise直接返回失败
      if (err) {
        return reject(err);
      } // 如果 语句和参数数量不匹配 promise直接返回失败
      // if (sqls.length !== params.length) {
      //   connection.release(); // 释放掉
      //   return reject(new Error("语句与传值不匹配"));
      // }
      // 开始执行事务


      connection.beginTransaction(function (beginErr) {
        // 创建事务失败
        if (beginErr) {
          connection.release();
          return reject(beginErr);
        }

        console.log("开始执行事务，共执行" + sqls.length + "条语句"); // 返回一个promise 数组

        var funcAry = sqls.map(function (sql, index) {
          return new Promise(function (sqlResolve, sqlReject) {
            var data = params[index];
            connection.query(sql, data, function (sqlErr, result) {
              if (sqlErr) {
                return sqlReject(sqlErr);
              }

              sqlResolve(result);
            });
          });
        }); // 使用all 方法 对里面的每个promise执行的状态 检查

        Promise.all(funcAry).then(function (arrResult) {
          // 若每个sql语句都执行成功了 才会走到这里 在这里需要提交事务，前面的sql执行才会生效
          // 提交事务
          connection.commit(function (commitErr, info) {
            if (commitErr) {
              // 提交事务失败了
              console.log("提交事务失败:" + commitErr); // 事务回滚，之前运行的sql语句不生效

              connection.rollback(function (err) {
                if (err) console.log("回滚失败：" + err);
                connection.release();
              }); // 返回promise失败状态

              return reject(commitErr);
            }

            connection.release(); // 事务成功 返回 每个sql运行的结果 是个数组结构

            resolve(arrResult);
          });
        })["catch"](function (error) {
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

exports.register = function _callee(req, res) {
  var tron_helper, info, bcryptPwd, create_time, onlyId, oldName, newName, image_url, addressInfo, sqls, params;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          tron_helper = new Tron_helper();
          info = req.body;
          bcryptPwd = bcrypt.hashSync(info.password, 10);
          create_time = new Date();
          onlyId = crypto.randomUUID();
          oldName = req.files[0].filename;
          newName = Buffer.from(req.files[0].originalname, "latin1").toString("utf8");
          fs.renameSync("./public/upload/" + oldName, "./public/upload/" + newName);
          image_url = "http://127.0.0.1:3007/upload/".concat(newName);
          _context.next = 11;
          return regeneratorRuntime.awrap(tron_helper.CreateAccount());

        case 11:
          addressInfo = _context.sent;
          console.log(addressInfo);
          sqls = [// "insert into goods set ?", // 删除 语句
          // "delete from goods where goods_id = ?", // 删除 语句
          "select * from users_info where account = ?", // 查询是否有此账户
          "insert into users_info set ?", "insert into users_address_tron set ?", "insert into users_avatar set ?", "update users_info set image_url = ? where account = ?"];
          params = [// {'num': Math.random()}, // parmas 是数组格式 与sqls里的sql语句里 ? 一一对应
          // [1],
          [info.account], {
            account: info.account,
            password: bcryptPwd,
            nickname: info.nickname,
            email: info.email,
            sex: info.sex,
            identity: "用户",
            identityId: 0,
            create_time: create_time,
            update_time: create_time,
            status: 0
          }, {
            account: info.account,
            address: addressInfo.address,
            mnemonic: addressInfo.mnemonic.phrase,
            private_key: addressInfo.privateKey.slice(2),
            create_time: create_time
          }, {
            image_url: image_url,
            onlyId: onlyId
          }, [image_url, info.account]];
          transaction(sqls, params).then(function (arrResult) {
            // do anything ....
            console.log(arrResult);
            res.send({
              status: 0,
              msg: "注册成功"
            });
          })["catch"](function (err) {
            // error
            console.log(err);
          }); // db.query("BEGIN TRAN");
          // try {
          //   const selectUserRes = await sqlQuery("select * from users_info where account = ?", info.account);
          //   if (selectUserRes.length > 0) return res.cc("账号已存在");
          //   const insertUserRes = await sqlQuery("insert into users_info set ?", {
          //     account: info.account,
          //     password: bcryptPwd,
          //     nickname: info.nickname,
          //     email: info.email,
          //     sex: info.sex,
          //     identity: "用户",
          //     identityId: 0,
          //     create_time,
          //     update_time: create_time,
          //     status: 0,
          //   });
          //   if (insertUserRes.affectedRows !== 1) {
          //     db.query("ROLLBACK TRAN");
          //     return res.cc("注册失败");
          //   }
          //   const insertImgRes = await sqlQuery("insert into users_avatar set ?", {
          //     image_url,
          //     onlyId,
          //   });
          //   if (insertImgRes.affectedRows !== 1) {
          //     db.query("ROLLBACK TRAN");
          //     return res.cc("注册失败");
          //   } else {
          //     await sqlQuery("update users_info set image_url = ? where account = ?", [image_url, info.account]);
          //     db.query("COMMIT");
          //     res.send({
          //       status: 0,
          //       msg: "注册成功",
          //     });
          //   }
          // } catch (error) {
          //   db.query("ROLLBACK TRAN");
          //   return res.cc(error);
          // }

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.login = function (req, res, next) {
  var info = req.body;
  var sql = "select * from users_info where account = ?";
  db.query(sql, encodeURIComponent(info.account), function (err, results) {
    if (err) return res.cc(err);
    if (results.length <= 0) return res.cc("找不到该用户");
    var compareResult = bcrypt.compareSync(encodeURIComponent(info.password), results[0].password);
    if (!compareResult) return res.cc("密码不正确");
    if (results.status == 1) return res.cc("账号被冻结");

    var user = _objectSpread({}, results[0]);

    var tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey);
    res.send({
      data: {
        token: tokenStr
      },
      code: 0,
      msg: "登录成功"
    });
  });
};

exports["delete"] = function (req, res, next) {
  var info = req.body;
  var sql_select = "select * from users_info where account = ?";
  db.query(sql_select, info.account, function (err, results) {
    if (err) return res.cc(err);
    if (results.length <= 0) return res.cc("找不到该用户");
    var compareResult = bcrypt.compareSync(info.password, results[0].password);
    if (!compareResult) return res.cc("密码不正确");
    var sql_delete = "delete from users_info where account = ?";
    db.query(sql_delete, info.account, function (err, results) {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("删除失败");
      res.send({
        code: 0,
        msg: "删除成功"
      });
    });
  });
};