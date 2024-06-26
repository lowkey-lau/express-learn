const db = require("../db/index");
const fetch = require("node-fetch");
const TronWeb = require("tronweb");
const ethers = require("ethers");
const { Query_helper } = require("./query_helper");
var _ = require("lodash");

const API_KEY = "96848c40-7cf5-4011-a930-05d2a09e5aab";
const REQUEST_NET = "https://nile.trongrid.io";
class Tron_helper {
  tronWeb;

  constructor() {
    address: "";
    blockConfirmQuantity: 20;

    this.tronWeb = new TronWeb({
      fullHost: "https://nile.trongrid.io",
      headers: { "TRON-PRO-API-KEY": API_KEY },
    });
  }

  //验证输入地址是否规范
  Validateaddress = async (address = "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn") => {
    const url = `${REQUEST_NET}/wallet/validateaddress`;
    return await fetchFun(url, { address });
  };

  // 创建地址，包含助记词/私钥/公钥
  CreateAccount = async () => {
    return await this.tronWeb.createRandom();
  };

  // 根据助记词生成钱包地址
  importMnemonic = (mnemonic) => {
    return this.tronWeb.fromMnemonic(mnemonic);
  };

  // 根据私钥生成钱包地址
  importPrivateKey = (privateKey) => {
    return this.tronWeb.address.fromPrivateKey(privateKey);
  };

  GetBalance = async (address = "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn", block_num = "latest") => {
    const formatAddress = `0x${this.tronWeb.address.toHex(address)}`;

    let raw = JSON.stringify({
      method: "eth_getBalance",
      params: [formatAddress, block_num],
      id: 1,
      jsonrpc: "2.0",
    });

    try {
      const res = await formatFetch(raw);
      return Number(this.tronWeb.fromSun(res));
    } catch (error) {
      console.log(error);
    }
  };

  GetContractBalance = async (contractAddress = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs", address = "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn") => {
    this.tronWeb.setAddress(address);

    try {
      const { abi } = await this.tronWeb.trx.getContract(contractAddress);

      // 获取代币合约实例
      const trc20Contract = await this.tronWeb.contract(abi.entrys, contractAddress);

      // 调用代币合约的balanceOf方法获取余额
      let balance = await trc20Contract.methods.balanceOf(address).call();

      // 格式化余额为代币数值
      let trc20Balance = this.tronWeb.toDecimal(this.tronWeb.fromSun(balance));

      console.log(`代币余额: ${balance}`);
      console.log(`代币格式化余额: ${trc20Balance}`);

      return trc20Balance;
    } catch (error) {
      console.error("获取代币余额出错:", error);
    }
  };

  GetTransactionById = async (value = "921cb9f044ab87e8c38870db9dece424a9e7f6c2c1e2159645ff6322cf49e391") => {
    return this.tronWeb.trx.getTransaction(value);
  };

  GetTransactionInfoById = async (value = "921cb9f044ab87e8c38870db9dece424a9e7f6c2c1e2159645ff6322cf49e391") => {
    return this.tronWeb.trx.getTransactionInfo(value);
  };

  GetTransactionInfoByBlockNum = async (num = 44870674) => {
    let res = [];
    try {
      res = await this.tronWeb.trx.getTransactionFromBlock(num);
    } catch (error) {}

    return res;
  };

  GetLatestBlock = async () => {
    return this.tronWeb.trx.getCurrentBlock();
    // const url = `${REQUEST_NET}/wallet/getnowblock`;
    // return await fetchFun(url);
  };

  SendTransaction = async (privateKey, toAddress, quantity) => {
    this.tronWeb.setPrivateKey(privateKey);
    return this.tronWeb.trx.sendTransaction(toAddress, this.tronWeb.toSun(quantity), privateKey);
  };

  SendContractTransaction = async (privateKey, contractAddress, toAddress, quantity) => {
    this.tronWeb.setPrivateKey(privateKey);
    try {
      const { abi } = await this.tronWeb.trx.getContract(contractAddress);
      // 获取代币合约实例
      const trc20Contract = await this.tronWeb.contract(abi.entrys, contractAddress);

      // 调用代币合约Transfer方法
      let result = await trc20Contract.methods.transfer(toAddress, this.tronWeb.toSun(quantity)).send();

      return this.tronWeb.trx.getTransaction(result);
    } catch (error) {
      console.log(error);
    }
  };

  GetTransactionList = async (address = "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn") => {
    return new Promise((resolve, reject) => {
      const url = `${REQUEST_NET}/v1/accounts/${address}/transactions`;
      const options = { method: "GET", headers: { accept: "application/json" } };

      fetch(url, options)
        .then((res) => res.json())
        .then((json) => resolve(json))
        .catch((err) => reject("error:" + err));
    });
  };

  ScanningBlock = async () => {
    const tron_helper = new Tron_helper();
    const query_helper = new Query_helper();
    // let blockArray = [];
    // let blockNum = 47671460;

    clearInterval(timer);
    let timer = setInterval(async () => {
      let latestBlock = await tron_helper.GetLatestBlock();
      let blockNum = latestBlock.block_header.raw_data.number;
      const count = await query_helper.checkBlockNumDB(blockNum);

      if (count == 0) {
        db.query("insert into users_block_num set ?", {
          block_num: blockNum,
        });

        const TradeList = await tron_helper.GetTransactionInfoByBlockNum(blockNum);

        // :) 首先筛选出 TRX转账 及 TRC-20转账
        const filterTradeList = TradeList.filter((item) => {
          return item.raw_data.contract[0].type == "TransferContract" || item.raw_data.contract[0].type == "TriggerSmartContract";
        });

        if (filterTradeList.length > 0) {
          for (let i = 0; i < filterTradeList.length; i++) {
            let from_address = this.tronWeb.address.fromHex(filterTradeList[i].raw_data.contract[0].parameter.value.owner_address),
              to_address = "",
              value = 0,
              unit = "TRX";

            // :) 这里 TRX转账 或者 TRC-20转账
            if (filterTradeList[i].raw_data.contract[0].type == "TransferContract") {
              to_address = this.tronWeb.address.fromHex(filterTradeList[i].raw_data.contract[0].parameter.value.to_address);
              value = this.tronWeb.fromSun(filterTradeList[i].raw_data.contract[0].parameter.value.amount);
              unit = "TRX";
            } else if (filterTradeList[i].raw_data.contract[0].type == "TriggerSmartContract") {
              // :) 合约返回数据加工处理
              const data = filterTradeList[i].raw_data.contract[0].parameter.value.data;

              // const iface = ethers.Interface;
              // const result = iface.decodeFunctionResult("Transfer", data);
              // console.log(result);

              const transferMethodId = "a9059cbb";
              const methodId = data.slice(0, 8);
              if (transferMethodId != methodId) continue; //判断是否为Transfer()

              const toInHex = "0x" + data.slice(32, 72);
              to_address = this.tronWeb.address.fromHex(toInHex);

              const amountHex = "0x" + data.slice(72);
              value = this.tronWeb.fromSun(this.tronWeb.toDecimal(amountHex));
              unit = "代币";
            }

            // :) 判断是否跟数据库账户地址有关联
            let count = await query_helper.checkAddressDB(from_address, to_address);
            if (count == 0) continue;

            console.log("From -> ", from_address);
            console.log("To -> ", to_address);
            console.log("Value -> ", value, unit);
            console.log("符合条件区块 ->", blockNum);
            console.log("----");

            db.query("insert into users_trade_log set ?", {
              from: from_address,
              to: to_address,
              txid: filterTradeList[i].txID,
              amount: value,
              block_num: blockNum,
              type: unit,
              status: 0,
            });
          }
        }
      }

      // blockNum++;
    }, 1000);
  };
}

module.exports = {
  Tron_helper,
};

const fetchFun = (url, params = {}, option = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json" },
      body: JSON.stringify({ ...params, visible: true }),
    };

    fetch(url, { ...options, ...option })
      .then((res) => res.json())
      .then((json) => resolve(json))
      .catch((err) => reject("error:" + err));
  });
};

function mySplit(str, leng) {
  let arr = [];

  let index = 0;
  while (index < str.length) {
    arr.push(str.slice(index, (index += leng)));
  }

  console.log(arr);
}

const AbiCoder = ethers.AbiCoder;
const ADDRESS_PREFIX_REGEX = /^(41)/;
const ADDRESS_PREFIX = "41";

async function decodeParamsFunc(types, output, ignoreMethodHash) {
  // if (!output || typeof output === "boolean") {
  //   ignoreMethodHash = output;
  //   output = types;
  // }

  // if (ignoreMethodHash && output.replace(/^0x/, "").length % 64 === 8) output = "0x" + output.replace(/^0x/, "").substring(8);

  // const abiCoder = new AbiCoder();

  // console.log("output->", output);

  // if (output.replace(/^0x/, "").length % 64) throw new Error("The encoded string is not valid. Its length must be a multiple of 64.");
  // return abiCoder.decode(types, output).reduce((obj, arg, index) => {
  //   console.log(arg);

  //   if (types[index] == "address") arg = ADDRESS_PREFIX + arg.substr(2).toLowerCase();
  //   obj.push(arg);
  //   return obj;
  // }, []);

  const toInHex = "0x" + data.slice(32, 72);
  const to = provider.address.fromHex(toInHex);
  const amountHex = "0x" + data.slice(72);
  const amount = ethers.toBigInt(amountHex).toString();
  return {
    amount,
    to,
  };
}

function decode(data) {
  const transferMethodId = "a9059cbb";
  const methodId = data.slice(0, 8);
  if (transferMethodId == methodId) {
    const toInHex = "0x" + data.slice(32, 72);
    const to = provider.address.fromHex(toInHex);
    const amountHex = "0x" + data.slice(72);
    const amount = ethers.toBigInt(amountHex).toString();
    return {
      amount,
      to,
    };
  }
}

const formatFetch = (raw) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return new Promise((resolve, reject) => {
    fetch(`${REQUEST_NET}/jsonrpc`, requestOptions)
      .then((response) => response.text())
      .then((result) => resolve(JSON.parse(result).result))
      .catch((error) => reject(error));
  });
};
