"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = require("../models");

var Tutorial = db.tutorials;
var Op = db.Sequelize.Op; // Create and Save a new Tutorial

exports.create = function (req, res) {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  } // Create a Tutorial


  var tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  }; // Save Tutorial in the database

  Tutorial.create(tutorial).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Tutorial."
    });
  });
}; // Retrieve all Tutorials from the database.


exports.findAll = function (req, res) {
  var title = req.query.title;
  var condition = title ? {
    title: _defineProperty({}, Op.like, "%".concat(title, "%"))
  } : null;
  Tutorial.findAll({
    where: condition
  }).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials."
    });
  });
}; // Find a single Tutorial with an id


exports.findOne = function (req, res) {
  var id = req.params.id;
  Tutorial.findByPk(id).then(function (data) {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: "Cannot find Tutorial with id=".concat(id, ".")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Error retrieving Tutorial with id=" + id
    });
  });
}; // Update a Tutorial by the id in the request


exports.update = function (req, res) {
  var id = req.params.id;
  Tutorial.update(req.body, {
    where: {
      id: id
    }
  }).then(function (num) {
    if (num == 1) {
      res.send({
        message: "Tutorial was updated successfully."
      });
    } else {
      res.send({
        message: "Cannot update Tutorial with id=".concat(id, ". Maybe Tutorial was not found or req.body is empty!")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Error updating Tutorial with id=" + id
    });
  });
}; // Delete a Tutorial with the specified id in the request


exports["delete"] = function (req, res) {
  var id = req.params.id;
  Tutorial.destroy({
    where: {
      id: id
    }
  }).then(function (num) {
    if (num == 1) {
      res.send({
        message: "Tutorial was deleted successfully!"
      });
    } else {
      res.send({
        message: "Cannot delete Tutorial with id=".concat(id, ". Maybe Tutorial was not found!")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Could not delete Tutorial with id=" + id
    });
  });
}; // Delete all Tutorials from the database.


exports.deleteAll = function (req, res) {
  Tutorial.destroy({
    where: {},
    truncate: false
  }).then(function (nums) {
    res.send({
      message: "".concat(nums, " Tutorials were deleted successfully!")
    });
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all tutorials."
    });
  });
}; // Find all published Tutorials


exports.findAllPublished = function (req, res) {
  Tutorial.findAll({
    where: {
      published: true
    }
  }).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials."
    });
  });
};