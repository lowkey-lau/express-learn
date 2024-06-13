const { Eth_helper } = require("../utils/eth_helper");

exports.createAccount = async (req, res) => {
  const ethApi = new Eth_helper();
  const resData = await ethApi.CreateAccount();

  res.send({
    code: 0,
    data: resData,
  });
};

exports.importMnemonic = async (req, res) => {
  const ethApi = new Eth_helper();
  const resData = await ethApi.ImportMnemonic(req.body.privateKey);

  res.send({
    code: 0,
    data: resData,
  });
};
