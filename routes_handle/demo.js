const db = require("../db/index");
const bcrypt = require("bcryptjs");
const { EVM_HELPER } = require("../utils/evm_helper");
const crypto = require("crypto");
const fs = require("fs");

const evm_helper = new EVM_HELPER();

export async function getMnemonic(req, res) {
  const resData = await evm_helper.CreateMnemonic();
  res.send({
    code: 0,
    data: resData,
  });
}

export async function createAccount(req, res) {
  const mnemonic = req.body.mnemonic;
  const walletName = req.body.walletName;

  const selectSQL = `select * from users_account_info where mnemonic = "${mnemonic}"`;
  const currentTime = new Date();

  db.query(selectSQL, async (err, result) => {
    if (err) return res.cc(err);
    if (result.length > 0) return res.cc("该助记词已使用");

    const addressInfo = await evm_helper.MnemonicToAddressInfo(mnemonic);

    const sqls = ["insert into users_account_info set ?"];
    const params = [
      {
        wallet_name: walletName,
        mnemonic: mnemonic,
        private_key: addressInfo.privateKey,
        access_token: "test",
        access_token_expired: 600000,
        create_time: currentTime,
        update_time: currentTime,
      },
    ];

    transaction(sqls, params).then((arrResult) => {
      // do anything ....
      res.send({
        status: 0,
        msg: "注册成功",
        data: {
          address: addressInfo.address,
        },
      });
    });
  });
}

export async function importMnemonic(req, res) {
  const mnemonic = req.body.mnemonic;
  const walletName = req.body.walletName;

  const selectSQL = `select * from users_account_info where mnemonic = "${mnemonic}"`;
  const currentTime = new Date();
  const addressInfo = await evm_helper.MnemonicToAddressInfo(mnemonic);
  let pk = addressInfo.privateKey;
  let num = pk.slice(2);
  console.log(num);
  let splitData = [num.substring(0, num.length / 2), num.substring(num.length / 2, num.length)].reverse().join("");
  console.log(splitData);

  // const secret = Buffer.from(addressInfo.privateKey);
  // const shares = sss.splitData(secret, { shares: 10, threshold: 3 });
  // const recovered = sss.combine(shares.slice(3, 7));
  // console.log(parseInt(shares.slice(3, 7)).toString());

  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 1024,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "lowkey",
    },
  });

  console.log(publicKey, privateKey);

  // 公钥加密
  const encryptData = crypto.publicEncrypt(publicKey, Buffer.from(splitData)).toString("base64");
  // console.log("encode", encryptData);

  console.log(Buffer.from(encryptData.toString("base64"), "base64"));
  // 私钥解密
  const decryptData = crypto.privateDecrypt(privateKey, Buffer.from(encryptData.toString("base64"), "base64"));
  // console.log('decode', decryptData.toString());

  res.send({ encryptData, pk, num, splitData });

  // try {
  //   db.query(selectSQL, async (err, result) => {
  //     if (err) return res.cc(err);

  //     if (result.length > 0) {
  //       console.log("has address");
  //       db.query(`update users_account_info set wallet_name = "${walletName}" where mnemonic = "${mnemonic}"`, (err, result) => {
  //         if (err) return res.cc(err);

  //         return res.send({
  //           status: 0,
  //           data: {
  //             walletName: walletName,
  //             address: addressInfo.address,
  //           },
  //         });
  //       });
  //     } else {
  //       const sqls = ["insert into users_account_info set ?"];
  //       const params = [
  //         {
  //           wallet_name: walletName,
  //           mnemonic: mnemonic,
  //           private_key: addressInfo.privateKey,
  //           access_token: "test",
  //           access_token_expired: 600000,
  //           create_time: currentTime,
  //           update_time: currentTime,
  //         },
  //       ];

  //       transaction(sqls, params).then((arrResult) => {
  //         res.send({
  //           status: 0,
  //           data: {
  //             walletName: walletName,
  //             address: addressInfo.address,
  //           },
  //         });
  //       });
  //     }
  //   });
  // } catch (error) {
  //   console.log("error ---> ", error);
  // }
}

function transaction(sqls, params) {
  return new Promise((resolve, reject) => {
    db.getConnection(function (err, connection) {
      // 连接失败 promise直接返回失败
      if (err) {
        return reject(err);
      }
      // 如果 语句和参数数量不匹配 promise直接返回失败
      // if (sqls.length !== params.length) {
      //   connection.release(); // 释放掉
      //   return reject(new Error("语句与传值不匹配"));
      // }
      // 开始执行事务
      connection.beginTransaction((beginErr) => {
        // 创建事务失败
        if (beginErr) {
          connection.release();
          return reject(beginErr);
        }
        console.log("开始执行事务，共执行" + sqls.length + "条语句");
        // 返回一个promise 数组
        let funcAry = sqls.map((sql, index) => {
          return new Promise((sqlResolve, sqlReject) => {
            const data = params[index];
            connection.query(sql, data, (sqlErr, result) => {
              if (sqlErr) {
                return sqlReject(sqlErr);
              }
              sqlResolve(result);
            });
          });
        });
        // 使用all 方法 对里面的每个promise执行的状态 检查
        Promise.all(funcAry)
          .then((arrResult) => {
            // 若每个sql语句都执行成功了 才会走到这里 在这里需要提交事务，前面的sql执行才会生效
            // 提交事务
            connection.commit(function (commitErr, info) {
              if (commitErr) {
                // 提交事务失败了
                console.log("提交事务失败:" + commitErr);
                // 事务回滚，之前运行的sql语句不生效
                connection.rollback(function (err) {
                  if (err) console.log("回滚失败：" + err);
                  connection.release();
                });
                // 返回promise失败状态
                return reject(commitErr);
              }

              connection.release();
              // 事务成功 返回 每个sql运行的结果 是个数组结构
              resolve(arrResult);
            });
          })
          .catch((error) => {
            // 多条sql语句执行中 其中有一条报错 直接回滚
            connection.rollback(function () {
              console.log("sql运行失败： " + error);
              connection.release();
              reject(error);
            });
          });
      });
    });
  });
}
