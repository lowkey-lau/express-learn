module.exports = (sequelize, Sequelize) => {
  return sequelize.define("Users", {
    account: {
      type: Sequelize.STRING, //  資料型態
      allowNull: false, // 能不能為空，預設是 true
      unique: true, // 唯一值
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false, // 能不能為空，預設是 true
    },
    tradePassword: {
      type: Sequelize.STRING,
      allowNull: false, // 能不能為空，預設是 true
    },
    accessToken: {
      type: Sequelize.STRING,
    },
  });
};
