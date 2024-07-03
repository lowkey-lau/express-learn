"use strict";

module.exports = function (sequelize, Sequelize) {
  var Currency = sequelize.define("currency", {
    currencyId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    symbol: {
      type: Sequelize.STRING
    },
    icon: {
      type: Sequelize.STRING
    }
  });
  return Currency;
};