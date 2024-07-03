"use strict";

var db = require("../db/index");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var jwtConfig = require("../jwt_config/index");

var crypto = require("crypto");

var Result = require("../common/ResultCode"); // const fs = require("fs");
// const { Tron_helper } = require("../utils/tron_helper");


var _require = require("../hooks/index"),
    useSqlQuery = _require.useSqlQuery,
    useVerifyToken = _require.useVerifyToken;

exports.getUserAsset = function _callee(req, res) {
  var userRes, assetsRes;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(useVerifyToken(req, res));

        case 3:
          userRes = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(useSqlQuery("select\n          d.*, e.*\n        from users_asset_spot e\n        INNER JOIN currency_info d\n        ON e.currency_id = d.id\n        where user_id = ?", userRes.user_id));

        case 6:
          assetsRes = _context.sent;
          return _context.abrupt("return", res.json(Result.success(assetsRes)));

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.json(Result.fail(_context.t0)));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getCurrencyConfig = function _callee2(req, res) {
  var info;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          info = req.body; // const

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};