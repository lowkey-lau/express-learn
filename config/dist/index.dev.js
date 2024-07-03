"use strict";

var REDIS_CONF = {
  host: "127.0.0.1",
  port: 6379
};
var DB_CONF = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "a123456A",
  database: "express_database"
};
module.exports = {
  REDIS_CONF: REDIS_CONF,
  DB_CONF: DB_CONF
};