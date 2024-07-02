"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = require("../db/index");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var jwtConfig = require("../jwt_config/index");

var crypto = require("crypto");

var Result = require("../common/ResultCode"); // const fs = require("fs");
// const { Tron_helper } = require("../utils/tron_helper");


var _require = require("../hooks/index"),
    useSqlQuery = _require.useSqlQuery,
    useSqlConnection = _require.useSqlConnection;

exports.register = function _callee(req, res, next) {
  var info, account, password, trade_password, accountRes;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          info = req.body;
          account = info.account;
          password = bcrypt.hashSync(info.password, 10);
          trade_password = bcrypt.hashSync(info.trade_password, 10);
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(useSqlQuery("select * from users_account where account = ?", account));

        case 7:
          accountRes = _context.sent;

          if (accountRes[0].length) {
            _context.next = 14;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap(useSqlQuery("insert into users_account set ?", {
            account: account,
            password: password,
            trade_password: trade_password
          }));

        case 11:
          return _context.abrupt("return", res.json(Result.success("注册成功")));

        case 14:
          return _context.abrupt("return", res.json(Result.fail("该用户已注册")));

        case 15:
          _context.next = 20;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](4);
          return _context.abrupt("return", next(_context.t0));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 17]]);
};

exports.login = function _callee2(req, res, next) {
  var info, account, password, accountRes, compareResult, user, tokenStr;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          info = req.body;
          account = info.account;
          password = info.password;
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(useSqlQuery("select * from users_account where account = ?", account));

        case 6:
          accountRes = _context2.sent;

          if (!accountRes[0]) {
            _context2.next = 16;
            break;
          }

          compareResult = bcrypt.compareSync(password, accountRes[0].password);

          if (compareResult) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.json(Result.fail("密码不正确")));

        case 11:
          // if (results.status == 1) return res.cc("账号被冻结");
          user = _objectSpread({}, accountRes[0]);
          tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey, {
            expiresIn: "3h"
          });
          return _context2.abrupt("return", res.json(Result.success({
            user_id: accountRes[0].id,
            account: accountRes[0].account,
            token: tokenStr
          })));

        case 16:
          return _context2.abrupt("return", res.json(Result.fail("找不到该用户")));

        case 17:
          _context2.next = 23;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](3);
          console.log(_context2.t0);
          return _context2.abrupt("return", res.json(Result.fail(_context2.t0)));

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 19]]);
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