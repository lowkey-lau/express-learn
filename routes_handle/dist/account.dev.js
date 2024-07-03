"use strict";

// const db = require("../db/index");
var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken"); // const jwtConfig = require("../jwt_config/index");
// const crypto = require("crypto");


var Result = require("../common/ResultCode"); // const fs = require("fs");
// const { Tron_helper } = require("../utils/tron_helper");


var _require = require("../hooks/index"),
    useSqlQuery = _require.useSqlQuery,
    useSqlConnection = _require.useSqlConnection;

var db = require("../app/models");

var Users = db.users;
var AssetSpot = db.asset_spot;
var Currency = db.currency;

exports.register = function _callee2(req, res) {
  var info, account, password, tradePassword, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          info = req.body;
          account = info.account;
          password = bcrypt.hashSync(info.password, 10);
          tradePassword = bcrypt.hashSync(info.tradePassword, 10);
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(db.sequelize.transaction(function _callee(t) {
            var currency;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(Currency.findAll());

                  case 2:
                    currency = _context.sent;
                    _context.next = 5;
                    return regeneratorRuntime.awrap(AssetSpot.bulkCreate(currency.map(function (item) {
                      return {
                        userId: 1,
                        currencyId: item.currencyId,
                        available: 0,
                        freeze: 0
                      };
                    })));

                  case 5:
                    return _context.abrupt("return", currency);

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }));

        case 7:
          result = _context2.sent;
          return _context2.abrupt("return", res.json(Result.success(result)));

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](4);
          return _context2.abrupt("return", res.json(Result.fail(_context2.t0.message || "Some error occurred while creating the Tutorial.")));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 11]]);
};

exports.login = function _callee3(req, res) {
  var info, account, password, accountRes, userParse, compareResult, userJWT, tokenStr;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          info = req.body;
          account = info.account;
          password = info.password;
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(Users.findOne({
            where: {
              account: account
            }
          }));

        case 6:
          accountRes = _context3.sent;

          if (!(accountRes === null)) {
            _context3.next = 11;
            break;
          }

          res.json(Result.fail("用户不存在"));
          _context3.next = 18;
          break;

        case 11:
          userParse = JSON.parse(JSON.stringify(accountRes, null, 2));
          compareResult = bcrypt.compareSync(password, userParse.password);

          if (compareResult) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", res.json(Result.fail("密码不正确")));

        case 15:
          userJWT = {
            user_id: userParse.id,
            account: userParse.account
          };
          tokenStr = jwt.sign(userJWT, process.env.ACCESS_TOKEN_SECRET);
          return _context3.abrupt("return", res.json(Result.success({
            userId: userParse.id,
            account: userParse.account,
            token: tokenStr
          })));

        case 18:
          _context3.next = 23;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](3);
          return _context3.abrupt("return", res.json(Result.fail(_context3.t0)));

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 20]]);
};