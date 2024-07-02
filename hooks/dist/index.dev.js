"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSqlConnection = exports.useSqlQuery = void 0;

var db = require("../db/index");

var useSqlQuery = function useSqlQuery(sql, params) {
  return new Promise(function (resolve, reject) {
    db.query(sql, params, function (err, results) {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.useSqlQuery = useSqlQuery;

var useSqlConnection = function useSqlConnection(sqls, params) {
  return new Promise(function (resolve, reject) {
    db.getConnection(function (err, connection) {
      // 连接失败 promise直接返回失败
      if (err) return reject(err); // 如果 语句和参数数量不匹配 promise直接返回失败
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
};

exports.useSqlConnection = useSqlConnection;