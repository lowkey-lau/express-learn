const db = require("../db/index");

class Query_helper {
  constructor() {}

  getUserAddressList = () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT account,address FROM users_address_tron", (err, result) => {
        if (err) reject(err);
        resolve(Object.values(JSON.parse(JSON.stringify(result))));
      });
    });
  };

  getBlockNumList = () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users_block_num", (err, result) => {
        if (err) reject(err);
        resolve(Object.values(JSON.parse(JSON.stringify(result))));
      });
    });
  };

  checkAddressDB = (from_address, to_address) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) FROM users_address_tron WHERE FIND_IN_SET(?, address) OR FIND_IN_SET(?, address)",
        [from_address, to_address],
        (err, result) => {
          if (err) reject(err);
          resolve(Object.values(JSON.parse(JSON.stringify(result)))[0]["COUNT(*)"]);
        }
      );
    });
  };

  checkBlockNumDB = (num) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) FROM users_block_num WHERE block_num = ?", num, (err, result) => {
        if (err) reject(err);
        resolve(Object.values(JSON.parse(JSON.stringify(result)))[0]["COUNT(*)"]);
      });
    });
  };
}

module.exports = {
  Query_helper,
};
