const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../jwt_config/index");
const crypto = require("crypto");
const Result = require("../common/ResultCode");
const async = require("async");
// const fs = require("fs");
// const { Tron_helper } = require("../utils/tron_helper");

const { useSqlQuery, useVerifyToken } = require("../hooks/index");

exports.getUserAsset = async (req, res) => {
  try {
    const userRes = await useVerifyToken(req, res);
    const assetsRes = await useSqlQuery(
      `select
          d.*, e.*
        from users_asset_spot e
        INNER JOIN currency_info d
        ON e.currency_id = d.id
        where user_id = ?`,
      userRes.user_id
    );

    // const res = new Promise.all(
    //   assetsRes.map(async (item) => { }
    // ))

    // async.map(
    //   [
    //     fetch("https:data-api.binance.vision/api/v3/ticker/price?symbol=ETHUSDT").then((res) => res.json()),
    //     fetch("https:data-api.binance.vision/api/v3/ticker/price?symbol=ETHUSDT").then((res) => res.json()),
    //     fetch("https:data-api.binance.vision/api/v3/ticker/price?symbol=ETHUSDT").then((res) => res.json()),
    //   ],
    //   fs.stat,
    //   function (err, results) {
    //     console.log(results);
    //     // results is now an array of stats for each file
    //   }
    // );

    // const res = assetsRes.map(async (item) => {
    //   return {
    //     valuation: await fetch("https:data-api.binance.vision/api/v3/ticker/price?symbol=ETHUSDT").then((res) => res.json()),
    //   };
    // });

    // console.log(res);

    //https:data-api.binance.vision/api/v3/ticker/price?symbol=ETHUSDT

    return res.json(Result.success(assetsRes));
  } catch (error) {
    return res.json(Result.fail(error));
  }
};

exports.getCurrencyConfig = async (req, res) => {
  const info = req.body;

  // const
};
