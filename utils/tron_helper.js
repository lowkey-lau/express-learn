const fetch = require("node-fetch");
const TronWeb = require("tronweb");

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

  GetTransactionInfoById = async (value = "921cb9f044ab87e8c38870db9dece424a9e7f6c2c1e2159645ff6322cf49e391") => {
    return this.tronWeb.trx.getTransaction(value);
  };

  GetTransactionInfoByBlockNum = async (num = 44870674) => {
    return this.tronWeb.trx.getTransactionFromBlock(num);
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
    let array = [];

    clearInterval(timer);
    let timer = setInterval(async () => {
      let result = await tronApi.GetNowBlock();
      let blockNum = result.block_header.raw_data.number;
      if (array.indexOf(blockNum) == -1) {
        array.push(blockNum);

        // const res = await tronApi.GetTransactionInfoByBlockNum(blockNum);
        // console.log(res);
      }
      if (array.length == 20) clearInterval(timer);
      console.log("object -> ", result.block_header.raw_data.number, array);
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
