"use strict";

var _require = require("../utils/eth_helper"),
    Eth_helper = _require.Eth_helper;

exports.createAccount = function _callee(req, res) {
  var eth_helper, resData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(eth_helper);
          eth_helper = new Eth_helper();
          _context.next = 4;
          return regeneratorRuntime.awrap(eth_helper.CreateAccount());

        case 4:
          resData = _context.sent;
          res.send({
            code: 0,
            data: resData
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.importMnemonic = function _callee2(req, res) {
  var eth_helper, resData;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          eth_helper = new Eth_helper();
          _context2.next = 3;
          return regeneratorRuntime.awrap(eth_helper.ImportMnemonic(req.body.mnemonic));

        case 3:
          resData = _context2.sent;
          res.send({
            code: 0,
            data: resData
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.importPrivateKey = function _callee3(req, res) {
  var eth_helper;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          eth_helper = new Eth_helper();
          _context3.t0 = res;
          _context3.next = 4;
          return regeneratorRuntime.awrap(eth_helper.ImportPrivateKey(req.body.privateKey));

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
  var eth_helper, resData;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          eth_helper = new Eth_helper();
          _context4.next = 3;
          return regeneratorRuntime.awrap(eth_helper.GetBalance(req.body.address));

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
  var eth_helper, resData;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          eth_helper = new Eth_helper();
          _context5.next = 3;
          return regeneratorRuntime.awrap(eth_helper.GetContractBalance(req.body.contractAddress, req.body.address));

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
  var eth_helper;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          eth_helper = new Eth_helper();
          _context6.t0 = res;
          _context6.next = 4;
          return regeneratorRuntime.awrap(eth_helper.GetTransactionById(req.body.hxID));

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
  var eth_helper;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          eth_helper = new Eth_helper();
          _context7.t0 = res;
          _context7.next = 4;
          return regeneratorRuntime.awrap(eth_helper.GetTransactionInfoByBlockNum(req.body.blockNum));

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
  var eth_helper;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          eth_helper = new Eth_helper();
          _context8.t0 = res;
          _context8.next = 4;
          return regeneratorRuntime.awrap(eth_helper.GetLatestBlock());

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
  var eth_helper, resData;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          eth_helper = new Eth_helper();
          _context9.next = 3;
          return regeneratorRuntime.awrap(eth_helper.SendTransaction(req.body.privateKey, req.body.toAddress, req.body.quantity));

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
  var eth_helper, resData;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          eth_helper = new Eth_helper();
          _context10.next = 3;
          return regeneratorRuntime.awrap(eth_helper.SendContractTransaction(req.body.privateKey, req.body.contractAddress, req.body.toAddress, req.body.quantity));

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
  var eth_helper, resData;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          eth_helper = new Eth_helper();
          _context11.next = 3;
          return regeneratorRuntime.awrap(eth_helper.GetTransactionList(req.body.address));

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