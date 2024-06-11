// const db = require("../db/index");
const { Tron_helper } = require("../utils/tron_helper");

exports.getAccount = async (req, res) => {
  const tronApi = new Tron_helper();
  res.send({
    status: 0,
    data: await tronApi.getAccount(),
  });
};

exports.getBalance = async (req, res) => {
  const tronApi = new Tron_helper();
  res.send({
    status: 0,
    data: await tronApi.getBalance(req.body.address),
  });
};
