"use strict";

module.exports = function (sequelize, Sequelize) {
  return sequelize.define("asset_funding", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "用户ID"
    },
    currencyId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "币种ID"
    },
    available: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "可用数量"
    },
    freeze: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "冻结数量"
    }
  }, {
    timestamps: true,
    createdAt: false
  });
};