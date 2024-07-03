"use strict";

module.exports = function (sequelize, Sequelize) {
  return sequelize.define("User", {
    account: {
      // 欄位名稱
      type: Sequelize.STRING,
      //  資料型態
      allowNull: false // 能不能為空，預設是 true

    },
    password: {
      type: Sequelize.STRING,
      allowNull: false // 能不能為空，預設是 true

    },
    tradePassword: {
      type: Sequelize.STRING,
      allowNull: false // 能不能為空，預設是 true

    },
    accessToken: {
      type: Sequelize.STRING
    }
  });
};