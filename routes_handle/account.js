// const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const jwtConfig = require("../jwt_config/index");
// const crypto = require("crypto");
const Result = require("../common/ResultCode");
// const fs = require("fs");
// const { Tron_helper } = require("../utils/tron_helper");

const { useSqlQuery, useSqlConnection } = require("../hooks/index");

const db = require("../app/models");
const Users = db.users;
const AssetSpot = db.asset_spot;
const Currency = db.currency;

exports.register = async (req, res) => {
  const info = req.body;
  const account = info.account;
  const password = bcrypt.hashSync(info.password, 10);
  const tradePassword = bcrypt.hashSync(info.tradePassword, 10);

  try {
    const result = await db.sequelize.transaction(async (t) => {
      // const user = await Users.create(
      //   {
      //     account,
      //     password,
      //     tradePassword,
      //   },
      //   { transaction: t }
      // );

      const currency = await Currency.findAll();

      await AssetSpot.bulkCreate(
        currency.map((item) => {
          return {
            userId: 1,
            currencyId: item.currencyId,
            available: 0,
            freeze: 0,
          };
        })
      );

      return currency;
    });

    return res.json(Result.success(result));
  } catch (error) {
    return res.json(Result.fail(error.message || "Some error occurred while creating the Tutorial."));
  }
};

exports.login = async (req, res) => {
  const info = req.body;
  const account = info.account;
  const password = info.password;

  try {
    const accountRes = await Users.findOne({
      where: {
        account,
      },
    });

    if (accountRes === null) {
      res.json(Result.fail("用户不存在"));
    } else {
      const userParse = JSON.parse(JSON.stringify(accountRes, null, 2));
      const compareResult = bcrypt.compareSync(password, userParse.password);

      if (!compareResult) return res.json(Result.fail("密码不正确"));

      const userJWT = {
        user_id: userParse.id,
        account: userParse.account,
      };

      const tokenStr = jwt.sign(userJWT, process.env.ACCESS_TOKEN_SECRET);

      return res.json(
        Result.success({
          userId: userParse.id,
          account: userParse.account,
          token: tokenStr,
        })
      );
    }
  } catch (error) {
    return res.json(Result.fail(error));
  }
};
