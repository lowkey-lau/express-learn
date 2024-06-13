const db = require("../db/index");
const fetch = require("node-fetch");
const TronWeb = require("tronweb");
const ethers = require("ethers");

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

  GetBalance = async (address = "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn") => {
    const balance = await this.tronWeb.trx.getBalance(address);
    return Number(this.tronWeb.fromSun(balance));
    // try {
    //   const url = `${REQUEST_NET}/wallet/getaccount`;
    //   let res = await fetchFun(url, { address });
    //   const balance = Number(this.tronWeb.fromSun(res.balance));
    //   console.log(res.balance);
    //   console.log(balance);
    //   return balance;
    // } catch (error) {
    //   console.error("获取TRC余额出错:", error);
    // }
  };

  GetAddressBalance = async (contractAddress = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs", address = "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn") => {
    this.tronWeb.setAddress(address);

    try {
      const { abi } = await this.tronWeb.trx.getContract(contractAddress);

      // 获取USDT合约实例
      const usdtContract = await this.tronWeb.contract(abi.entrys, contractAddress);

      // 调用USDT合约的balanceOf方法获取余额
      let balance = await usdtContract.methods.balanceOf(address).call();

      // 格式化余额为USDT数值
      let usdtBalance = this.tronWeb.toDecimal(this.tronWeb.fromSun(balance));

      console.log(`USDT余额: ${balance}`);
      console.log(`USDT格式化余额: ${usdtBalance}`);

      return usdtBalance;
    } catch (error) {
      console.error("获取USDT余额出错:", error);
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

  GetNowBlock = async () => {
    return this.tronWeb.trx.getCurrentBlock();
    // const url = `${REQUEST_NET}/wallet/getnowblock`;
    // return await fetchFun(url);
  };

  SendTransaction = async (privateKey, toAddress, quantity) => {
    this.tronWeb.setPrivateKey(privateKey);
    return this.tronWeb.trx.sendTransaction(toAddress, this.tronWeb.toSun(quantity), privateKey);
  };

  SendAddressTransaction = async (privateKey, contractAddress, toAddress, quantity) => {
    this.tronWeb.setPrivateKey(privateKey);
    try {
      const { abi } = await this.tronWeb.trx.getContract(contractAddress);
      // 获取USDT合约实例
      const usdtContract = await this.tronWeb.contract(abi.entrys, contractAddress);

      // 调用USDT合约Transfer方法
      let result = await usdtContract.methods.transfer(toAddress, this.tronWeb.toSun(quantity)).send();

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

  ScanningBlock = () => {
    const tronApi = new Tron_helper();
    let blockArray = [];
    // let users = [];
    // const ddd = db.query("SELECT account FROM users_info", (err, result) => {
    //   users = result.account;
    // });

    // console.log(users);

    // let blockNum = 47671479;

    clearInterval(timer);
    let timer = setInterval(async () => {
      let result = await tronApi.GetNowBlock();
      let blockNum = result.block_header.raw_data.number;

      if (blockArray.indexOf(blockNum) == -1) {
        const res = await tronApi.GetTransactionInfoByBlockNum(blockNum);

        // console.log("res ->", res);

        if (res.length > 0) {
          res.forEach(async (item) => {
            // console.log(item.raw_data.contract[0].type);
            // console.log(item.raw_data.contract[0].parameter.value.owner_address);
            // console.log(this.tronWeb.address.fromHex(item.raw_data.contract[0].parameter.value.owner_address));
            // console.log(fromHexAddress == "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn");
            // console.log();
            // 4577ffb80e0a1d6903b01343bc288abd1fc6384805ae62681abee2f4b368debf
            if (this.tronWeb.address.fromHex(item.raw_data.contract[0].parameter.value.owner_address) == "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn") {
              console.log(item.raw_data.contract[0].type);
              console.log(item.txID);
              if (item.raw_data.contract[0].type == "TransferContract") {
                // console.log(item.raw_data.contract[0].parameter.value.owner_address);
                console.log("From -> ", this.tronWeb.address.fromHex(item.raw_data.contract[0].parameter.value.owner_address));
                console.log("To -> ", this.tronWeb.address.fromHex(item.raw_data.contract[0].parameter.value.to_address));
                console.log("Value -> ", this.tronWeb.fromSun(item.raw_data.contract[0].parameter.value.amount), "TRX");
              } else if (item.raw_data.contract[0].type == "TriggerSmartContract") {
                console.log("From -> ", this.tronWeb.address.fromHex(item.raw_data.contract[0].parameter.value.owner_address));
                console.log("Contract -> ", this.tronWeb.address.fromHex(item.raw_data.contract[0].parameter.value.contract_address));
                console.log("Data -> ", item.raw_data.contract[0].parameter.value.data);
                const data = item.raw_data.contract[0].parameter.value.data;
                const formatData = await decodeParamsFunc(["address", "uint256"], data, true);
                // console.log(this.tronWeb.toAscii(data));
                console.log(formatData);
                console.log("To -> ", this.tronWeb.address.fromHex(formatData[0]));
                console.log("Value -> ", this.tronWeb.fromSun(formatData[1]), "USDT");

                // console.log("Value -> ", this.tronWeb.fromSun(item.raw_data.contract[0].parameter.value.amount));
                // let ddd = await tronApi.GetTransactionInfoById(item.txID);
                // console.log("Value ->", this.tronWeb.fromSun(this.tronWeb.toDecimal(`0x${ddd.log[0].data}`)));
              }
              blockArray.push(blockNum);
              console.log("BLOCK->", blockNum, blockArray);
              console.log("----------------------");
            }

            // TransferContract TRX转账
            // TriggerSmartContract 合约地址转账
            // if(item.raw_data.contract[0].type)
          });
        }
      }
      // if (blockArray.length == 20) clearInterval(timer);

      // blockNum++;

      // console.log("object -> ", result.block_header.raw_data.number, array);
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
  if (!output || typeof output === "boolean") {
    ignoreMethodHash = output;
    output = types;
  }

  if (ignoreMethodHash && output.replace(/^0x/, "").length % 64 === 8) output = "0x" + output.replace(/^0x/, "").substring(8);

  const abiCoder = new AbiCoder();

  if (output.replace(/^0x/, "").length % 64) throw new Error("The encoded string is not valid. Its length must be a multiple of 64.");
  return abiCoder.decode(types, output).reduce((obj, arg, index) => {
    if (types[index] == "address") arg = ADDRESS_PREFIX + arg.substr(2).toLowerCase();
    obj.push(arg);
    return obj;
  }, []);
}
