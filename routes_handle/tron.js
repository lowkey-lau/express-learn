const db = require("../db/index");
const { Tron_helper } = require("../utils/tron_helper");

exports.createAccount = async (req, res) => {
  const tronApi = new Tron_helper();
  const resData = await tronApi.CreateAccount();

  res.send({
    code: 0,
    data: {
      ...resData,
      privateKey: resData.privateKey.slice(2),
    },
  });
};

exports.importMnemonic = async (req, res) => {
  const tronApi = new Tron_helper();
  const resData = await tronApi.importMnemonic(req.body.mnemonic);

  res.send({
    code: 0,
    data: {
      ...resData,
      privateKey: resData.privateKey.slice(2),
    },
  });
};

exports.importPrivateKey = async (req, res) => {
  const tronApi = new Tron_helper();
  res.send({
    code: 0,
    data: await tronApi.importPrivateKey(req.body.privateKey),
  });
};

exports.getBalance = async (req, res) => {
  const tronApi = new Tron_helper();
  const resData = await tronApi.GetBalance(req.body.address);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.getAddressBalance = async (req, res) => {
  const tronApi = new Tron_helper();
  const resData = await tronApi.GetAddressBalance(req.body.contractAddress, req.body.address);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.getTransactionInfoById = async (req, res) => {
  const tronApi = new Tron_helper();

  res.send({
    code: 0,
    data: await tronApi.GetTransactionById(req.body.hxID),
  });
};

exports.getTransactionInfoByBlockNum = async (req, res) => {
  const tronApi = new Tron_helper();

  res.send({
    code: 0,
    data: await tronApi.GetTransactionInfoByBlockNum(req.body.blockNum),
  });
};

exports.getNowBlock = async (req, res) => {
  const tronApi = new Tron_helper();

  res.send({
    code: 0,
    data: await tronApi.GetNowBlock(req.body.blockNum),
  });
};

exports.sendTransaction = async (req, res) => {
  const tronApi = new Tron_helper();
  const resData = await tronApi.SendTransaction(req.body.privateKey, req.body.toAddress, req.body.quantity);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.sendAddressTransaction = async (req, res) => {
  const tronApi = new Tron_helper();
  const resData = await tronApi.SendAddressTransaction(req.body.privateKey, req.body.contractAddress, req.body.toAddress, req.body.quantity);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.getTransactionList = async (req, res) => {
  const tronApi = new Tron_helper();
  const resData = await tronApi.GetTransactionList(req.body.address);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.getApiTradeLog = async (req, res) => {
  const { pageNum = 1, pageSize = 20 } = req.body;

  const sql_select = `select * from users_trade_log order by id ASC limit ${pageSize} offset ${(pageNum - 1) * pageSize}`;

  db.query(sql_select, "", (err, results) => {
    if (err) return res.cc(err);

    db.query("SELECT COUNT(*) FROM users_trade_log", (err, count) => {
      if (err) return res.cc(err);
      res.send({
        data: {
          total: count[0]["COUNT(*)"],
          pageNum,
          pageSize,
          list: results,
        },
        code: 0,
      });
    });
  });
};
