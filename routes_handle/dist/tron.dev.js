"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = require("../db/index");

var _require = require("../utils/tron_helper"),
    Tron_helper = _require.Tron_helper;

exports.createAccount = function _callee(req, res) {
  var tron_helper, resData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context.next = 3;
          return regeneratorRuntime.awrap(tron_helper.CreateAccount());

        case 3:
          resData = _context.sent;
          res.send({
            code: 0,
            data: _objectSpread({}, resData, {
              privateKey: resData.privateKey.slice(2)
            })
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.importMnemonic = function _callee2(req, res) {
  var tron_helper, resData;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context2.next = 3;
          return regeneratorRuntime.awrap(tron_helper.importMnemonic(req.body.mnemonic));

        case 3:
          resData = _context2.sent;
          res.send({
            code: 0,
            data: _objectSpread({}, resData, {
              privateKey: resData.privateKey.slice(2)
            })
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.importPrivateKey = function _callee3(req, res) {
  var tron_helper;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context3.t0 = res;
          _context3.next = 4;
          return regeneratorRuntime.awrap(tron_helper.importPrivateKey(req.body.privateKey));

        case 4:
          _context3.t1 = _context3.sent;
          _context3.t2 = {
            code: 0,
            data: _context3.t1
          };

          _context3.t0.send.call(_context3.t0, _context3.t2);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getBalance = function _callee4(req, res) {
  var tron_helper, resData;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context4.next = 3;
          return regeneratorRuntime.awrap(tron_helper.GetBalance(req.body.address));

        case 3:
          resData = _context4.sent;
          res.send({
            code: 0,
            data: resData
          });

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.getContractBalance = function _callee5(req, res) {
  var tron_helper, resData;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context5.next = 3;
          return regeneratorRuntime.awrap(tron_helper.GetContractBalance(req.body.contractAddress, req.body.address));

        case 3:
          resData = _context5.sent;
          res.send({
            code: 0,
            data: resData
          });

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.getTransactionInfoById = function _callee6(req, res) {
  var tron_helper;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context6.t0 = res;
          _context6.next = 4;
          return regeneratorRuntime.awrap(tron_helper.GetTransactionById(req.body.hxID));

        case 4:
          _context6.t1 = _context6.sent;
          _context6.t2 = {
            code: 0,
            data: _context6.t1
          };

          _context6.t0.send.call(_context6.t0, _context6.t2);

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.getTransactionInfoByBlockNum = function _callee7(req, res) {
  var tron_helper;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context7.t0 = res;
          _context7.next = 4;
          return regeneratorRuntime.awrap(tron_helper.GetTransactionInfoByBlockNum(req.body.blockNum));

        case 4:
          _context7.t1 = _context7.sent;
          _context7.t2 = {
            code: 0,
            data: _context7.t1
          };

          _context7.t0.send.call(_context7.t0, _context7.t2);

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.getLatestBlock = function _callee8(req, res) {
  var tron_helper;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context8.t0 = res;
          _context8.next = 4;
          return regeneratorRuntime.awrap(tron_helper.GetLatestBlock());

        case 4:
          _context8.t1 = _context8.sent;
          _context8.t2 = {
            code: 0,
            data: _context8.t1
          };

          _context8.t0.send.call(_context8.t0, _context8.t2);

        case 7:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.sendTransaction = function _callee9(req, res) {
  var tron_helper, resData;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context9.next = 3;
          return regeneratorRuntime.awrap(tron_helper.SendTransaction(req.body.privateKey, req.body.toAddress, req.body.quantity));

        case 3:
          resData = _context9.sent;
          res.send({
            code: 0,
            data: resData
          });

        case 5:
        case "end":
          return _context9.stop();
      }
    }
  });
};

exports.sendContractTransaction = function _callee10(req, res) {
  var tron_helper, resData;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context10.next = 3;
          return regeneratorRuntime.awrap(tron_helper.SendContractTransaction(req.body.privateKey, req.body.contractAddress, req.body.toAddress, req.body.quantity));

        case 3:
          resData = _context10.sent;
          res.send({
            code: 0,
            data: resData
          });

        case 5:
        case "end":
          return _context10.stop();
      }
    }
  });
};

exports.getTransactionList = function _callee11(req, res) {
  var tron_helper, resData;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          tron_helper = new Tron_helper();
          _context11.next = 3;
          return regeneratorRuntime.awrap(tron_helper.GetTransactionList(req.body.address));

        case 3:
          resData = _context11.sent;
          res.send({
            code: 0,
            data: resData
          });

        case 5:
        case "end":
          return _context11.stop();
      }
    }
  });
};

exports.getApiTradeLog = function _callee12(req, res) {
  var _req$body, _req$body$pageNum, pageNum, _req$body$pageSize, pageSize, sql_select;

  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _req$body = req.body, _req$body$pageNum = _req$body.pageNum, pageNum = _req$body$pageNum === void 0 ? 1 : _req$body$pageNum, _req$body$pageSize = _req$body.pageSize, pageSize = _req$body$pageSize === void 0 ? 20 : _req$body$pageSize;
          sql_select = "select * from users_trade_log order by id ASC limit ".concat(pageSize, " offset ").concat((pageNum - 1) * pageSize);
          db.query(sql_select, "", function (err, results) {
            if (err) return res.cc(err);
            db.query("SELECT COUNT(*) FROM users_trade_log", function (err, count) {
              if (err) return res.cc(err);
              res.send({
                data: {
                  total: count[0]["COUNT(*)"],
                  pageNum: pageNum,
                  pageSize: pageSize,
                  list: results
                },
                code: 0
              });
            });
          });

        case 3:
        case "end":
          return _context12.stop();
      }
    }
  });
};