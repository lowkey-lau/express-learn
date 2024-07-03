"use strict";

module.exports = function (sequelize, Sequelize) {
  return sequelize.define("Currency", {
    currencyId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: "币种配置ID"
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: "币种全称"
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: "币种简称"
    },
    icon: {
      type: Sequelize.STRING,
      comment: "币种图片地址"
    }
  }, {
    timestamps: false
  });
};