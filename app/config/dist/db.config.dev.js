"use strict";

var DB_CONF = {
  HOST: "127.0.0.1",
  USER: "root",
  PASSWORD: "a123456A",
  DB: "express_test",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
module.exports = {
  DB_CONF: DB_CONF
};