const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../jwt_config/index");
const crypto = require("crypto");
const Result = require("../common/ResultCode");
// const fs = require("fs");
// const { Tron_helper } = require("../utils/tron_helper");

const { useSqlQuery, useSqlConnection } = require("../hooks/index");

exports.register = async (req, res, next) => {
  const info = req.body;
  const account = info.account;
  const password = bcrypt.hashSync(info.password, 10);
  const trade_password = bcrypt.hashSync(info.trade_password, 10);

  try {
    const accountRes = await useSqlQuery("select * from users_account where account = ?", account);
    if (!accountRes[0].length) {
      await useSqlQuery("insert into users_account set ?", { account, password, trade_password });
      return res.json(Result.success("注册成功"));
    } else {
      return res.json(Result.fail("该用户已注册"));
    }
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  const info = req.body;
  const account = info.account;
  const password = info.password;

  try {
    const accountRes = await useSqlQuery("select * from users_account where account = ?", account);

    if (accountRes[0]) {
      const compareResult = bcrypt.compareSync(password, accountRes[0].password);
      if (!compareResult) return res.json(Result.fail("密码不正确"));
      // if (results.status == 1) return res.cc("账号被冻结");
      const user = {
        ...accountRes[0],
      };

      const tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey, { expiresIn: "3h" });
      return res.json(
        Result.success({
          user_id: accountRes[0].id,
          account: accountRes[0].account,
          token: tokenStr,
        })
      );
    } else {
      return res.json(Result.fail("找不到该用户"));
    }

    // db.query(sql, encodeURIComponent(info.account), (err, results) => {
    //   if (err) return res.cc(err);
    //   const compareResult = bcrypt.compareSync(encodeURIComponent(info.password), results[0].password);
    //   if (!compareResult) return res.cc("密码不正确");
    //   if (results.status == 1) return res.cc("账号被冻结");
    //   const user = {
    //     ...results[0],
    //   };
    // }
  } catch (error) {
    console.log(error);
    return res.json(Result.fail(error));
  }

  //   const user = {
  //     ...results[0],
  //   };

  // const tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey);

  // const sqls = [
  //   "select * from users_account where account = ?", // 查询是否有此账户
  //   "insert into users_account set ?",
  // ];
  // const params = [
  //   [info.account],
  //   {
  //     account,
  //     password,
  //     trade_password,
  //   },
  // ];

  // const sql_query = [
  //   "select * from users_account where account = ?", // 查询是否有此账户
  //   "insert into users_account set ?",
  // ];

  // const sql = "select * from users_account where account = ?";

  // db.query(sql, encodeURIComponent(info.account), (err, results) => {
  //   if (err) return res.cc(err);

  //   if (results.length <= 0) return res.cc("找不到该用户");

  //   const compareResult = bcrypt.compareSync(encodeURIComponent(info.password), results[0].password);

  //   if (!compareResult) return res.cc("密码不正确");

  //   if (results.status == 1) return res.cc("账号被冻结");

  //   const user = {
  //     ...results[0],
  //   };

  // const tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey);

  //   res.send({
  //     data: {
  //       token: tokenStr,
  //     },
  //     code: 0,
  //     msg: "登录成功",
  //   });
  // });
};

exports.delete = (req, res, next) => {
  const info = req.body;

  const sql_select = "select * from users_info where account = ?";

  db.query(sql_select, info.account, (err, results) => {
    if (err) return res.cc(err);

    if (results.length <= 0) return res.cc("找不到该用户");

    const compareResult = bcrypt.compareSync(info.password, results[0].password);

    if (!compareResult) return res.cc("密码不正确");

    const sql_delete = "delete from users_info where account = ?";

    db.query(sql_delete, info.account, (err, results) => {
      if (err) return res.cc(err);

      if (results.affectedRows !== 1) return res.cc("删除失败");

      res.send({
        code: 0,
        msg: "删除成功",
      });
    });
  });
};
