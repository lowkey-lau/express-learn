const { ETH_HELPER } = require("../utils/eth_helper");

exports.createAccount = async (req, res) => {
  console.log(eth_helper);

  const eth_helper = new ETH_HELPER();
  const resData = await eth_helper.CreateAccount();

  res.send({
    code: 0,
    data: resData,
  });
};

exports.importMnemonic = async (req, res) => {
  const eth_helper = new ETH_HELPER();
  const resData = await eth_helper.ImportMnemonic(req.body.mnemonic);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.importPrivateKey = async (req, res) => {
  const eth_helper = new ETH_HELPER();

  res.send({
    code: 0,
    data: await eth_helper.ImportPrivateKey(req.body.privateKey),
  });
};

exports.getBalance = async (req, res) => {
  const eth_helper = new ETH_HELPER();
  const resData = await eth_helper.GetBalance(req.body.address);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.getContractBalance = async (req, res) => {
  const eth_helper = new ETH_HELPER();
  const resData = await eth_helper.GetContractBalance(req.body.contractAddress, req.body.address);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.getTransactionInfoById = async (req, res) => {
  const eth_helper = new ETH_HELPER();

  res.send({
    code: 0,
    data: await eth_helper.GetTransactionById(req.body.hxID),
  });
};

exports.getTransactionInfoByBlockNum = async (req, res) => {
  const eth_helper = new ETH_HELPER();

  res.send({
    code: 0,
    data: await eth_helper.GetTransactionInfoByBlockNum(req.body.blockNum),
  });
};

exports.getLatestBlock = async (req, res) => {
  const eth_helper = new ETH_HELPER();

  res.send({
    code: 0,
    data: await eth_helper.GetLatestBlock(),
  });
};

exports.sendTransaction = async (req, res) => {
  const eth_helper = new ETH_HELPER();
  const resData = await eth_helper.SendTransaction(req.body.privateKey, req.body.toAddress, req.body.quantity);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.sendContractTransaction = async (req, res) => {
  const eth_helper = new ETH_HELPER();
  const resData = await eth_helper.SendContractTransaction(req.body.privateKey, req.body.contractAddress, req.body.toAddress, req.body.quantity);

  res.send({
    code: 0,
    data: resData,
  });
};

exports.getTransactionList = async (req, res) => {
  const eth_helper = new ETH_HELPER();
  const resData = await eth_helper.GetTransactionList(req.body.address);

  res.send({
    code: 0,
    data: resData,
  });
};
