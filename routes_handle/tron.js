const db = require("../db/index");
const { Tron_helper } = require("../utils/tron_helper");

exports.createAccount = async (req, res) => {
  const tron_helper = new Tron_helper();
  const resData = await tron_helper.CreateAccount();

  res.send({
    code: 0,
    data: {
      ...resData,
      privateKey: resData.privateKey.slice(2),
    },
  });
};

exports.importMnemonic = async (req, res) => {
  const tron_helper = new Tron_helper();
  const resData = await tron_helper.importMnemonic(req.body.mnemonic);

  res.send({
    code: 0,
    data: {
      ...resData,
      privateKey: resData.privateKey.slice(2),
    },
  });
};

exports.importPrivateKey = async (req, res) => {
  const tron_helper = new Tron_helper();
  res.send({
    code: 0,
    data: await tron_helper.importPrivateKey(req.body.privateKey),
  });
};

exports.getBalance = async (req, res) => {
  const tron_helper = new Tron_helper();
  const resData = await tron_helper.GetBalance(req.body.address);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.getContractBalance = async (req, res) => {
  const tron_helper = new Tron_helper();
  const resData = await tron_helper.GetContractBalance(req.body.contractAddress, req.body.address);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.getTransactionInfoById = async (req, res) => {
  const tron_helper = new Tron_helper();

  res.send({
    code: 0,
    data: await tron_helper.GetTransactionById(req.body.hxID),
  });
};

exports.getTransactionInfoByBlockNum = async (req, res) => {
  const tron_helper = new Tron_helper();

  res.send({
    code: 0,
    data: await tron_helper.GetTransactionInfoByBlockNum(req.body.blockNum),
  });
};

exports.getLatestBlock = async (req, res) => {
  const tron_helper = new Tron_helper();

  res.send({
    code: 0,
    data: await tron_helper.GetLatestBlock(),
  });
};

exports.sendTransaction = async (req, res) => {
  const tron_helper = new Tron_helper();
  const resData = await tron_helper.SendTransaction(req.body.privateKey, req.body.toAddress, req.body.quantity);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.sendContractTransaction = async (req, res) => {
  const tron_helper = new Tron_helper();
  const resData = await tron_helper.SendContractTransaction(req.body.privateKey, req.body.contractAddress, req.body.toAddress, req.body.quantity);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.getTransactionList = async (req, res) => {
  const tron_helper = new Tron_helper();
  const resData = await tron_helper.GetTransactionList(req.body.address);

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
