// const db = require("../db/index");
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
    data: await tronApi.GetTransactionInfoById(req.body.hxID),
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
  console.log(resData);
  res.send({
    code: 0,
    data: resData,
  });
};

exports.sendAddressTransaction = async (req, res) => {
  const tronApi = new Tron_helper();
  const resData = await tronApi.SendAddressTransaction(req.body.privateKey, req.body.contractAddress, req.body.toAddress, req.body.quantity);
  console.log(resData);
  res.send({
    code: 0,
    data: resData,
  });
};

exports.getTransactionList = async (req, res) => {
  const tronApi = new Tron_helper();
  const resData = await tronApi.GetTransactionList(req.body.address);
  console.log(resData);
  res.send({
    code: 0,
    data: resData,
  });
};
