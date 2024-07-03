"use strict";

var _require = require("../config"),
    DB_CONF = _require.DB_CONF;

var Sequelize = require("sequelize");

var sequelize = new Sequelize(DB_CONF.DB, DB_CONF.USER, DB_CONF.PASSWORD, {
  host: DB_CONF.HOST,
  dialect: DB_CONF.dialect,
  operatorsAliases: false,
  pool: {
    max: DB_CONF.pool.max,
    min: DB_CONF.pool.min,
    acquire: DB_CONF.pool.acquire,
    idle: DB_CONF.pool.idle
  }
});
var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./users.model.js")(sequelize, Sequelize);
db.asset_spot = require("./asset.spot.model.js")(sequelize, Sequelize);
db.asset_funding = require("./asset.funding.model.js")(sequelize, Sequelize);
db.currency = require("./currency.model.js")(sequelize, Sequelize); // db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);

module.exports = db;