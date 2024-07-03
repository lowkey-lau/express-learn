"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// src/routes/user.js
var express = require("express");

var router = express.Router();

var Users = require("../models/users.model"); // Create a new user


router.post("/", function _callee(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Users.create(req.body));

        case 3:
          user = _context.sent;
          res.json(user);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Failed to create user."
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Get all users

router.get("/", function _callee2(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Users.findAll());

        case 3:
          users = _context2.sent;
          res.json(users);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Failed to fetch users."
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Get user by ID

router.get("/:id", function _callee3(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Users.findByPk(req.params.id));

        case 3:
          user = _context3.sent;

          if (!user) {
            res.status(404).json({
              message: "Users not found."
            });
          } else {
            res.json(user);
          }

          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: "Failed to fetch user."
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Update user by ID

router.put("/:id", function _callee4(req, res) {
  var _ref, _ref2, updatedRowsCount, user;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Users.update(req.body, {
            where: {
              id: req.params.id
            }
          }));

        case 3:
          _ref = _context4.sent;
          _ref2 = _slicedToArray(_ref, 1);
          updatedRowsCount = _ref2[0];

          if (!(updatedRowsCount === 0)) {
            _context4.next = 10;
            break;
          }

          res.status(404).json({
            message: "Users not found."
          });
          _context4.next = 14;
          break;

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(Users.findByPk(req.params.id));

        case 12:
          user = _context4.sent;
          res.json(user);

        case 14:
          _context4.next = 19;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: "Failed to update user."
          });

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
}); // Delete user by ID

router["delete"]("/:id", function _callee5(req, res) {
  var deletedRowsCount;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Users.destroy({
            where: {
              id: req.params.id
            }
          }));

        case 3:
          deletedRowsCount = _context5.sent;

          if (deletedRowsCount === 0) {
            res.status(404).json({
              message: "Users not found."
            });
          } else {
            res.json({
              message: "Users deleted successfully."
            });
          }

          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: "Failed to delete user."
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;