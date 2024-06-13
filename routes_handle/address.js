const db = require("../db/index");

const crypto = require("crypto");
const fs = require("fs");

const sqlQuery = (sqlStr, option) => {
  return new Promise((resolve, reject) => {
    db.query(sqlStr, option, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

exports.getAddressList = (req, res) => {
  const { pageNum = 1, pageSize = 20 } = req.body;

  const sql_select = `select * from users_address_tron limit ${pageSize} offset ${(pageNum - 1) * pageSize}`;

  db.query(sql_select, "", (err, result) => {
    if (err) return res.cc(err);

    db.query("SELECT COUNT(*) FROM users_address_tron", (err, count) => {
      if (err) return res.cc(err);
      res.send({
        code: 0,
        data: {
          total: count[0]["COUNT(*)"],
          pageNum,
          pageSize,
          list: result,
        },
      });
    });
  });
};
