const sdk = require("@api/tron");
const API_KEY = "96848c40-7cf5-4011-a930-05d2a09e5aab";

const TronWeb = require("tronweb");

class Tron_helper {
  tronWeb;

  constructor() {
    address: "";

    this.tronWeb = new TronWeb({
      fullHost: "https://api.shasta.trongrid.io",
      headers: { "TRON-PRO-API-KEY": API_KEY },
    });
  }

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

  //验证输入地址是否规范
  Validateaddress(address = "TZ4UXDV5ZhNW7fb2AMSbgfAEZ7hWsnYS2g") {
    return new Promise((resolve, reject) => {
      sdk
        .validateaddress({ address, visible: true })
        .then(({ data }) => {
          if (data.result) {
            resolve(data);
          }

          reject(data);
        })
        .catch((err) => reject(err));
    });
  }

  //获取用户
  GetAccount(address = "TZ4UXDV5ZhNW7fb2AMSbgfAEZ7hWsnYS2g") {
    return new Promise((resolve, reject) => {
      sdk
        .accountGetaccount({ address, visible: true })
        .then(({ data }) => resolve(data.address))
        .catch((err) => reject(err));
    });
  }

  GetBalance(address = "TZ4UXDV5ZhNW7fb2AMSbgfAEZ7hWsnYS2g") {
    return new Promise((resolve, reject) => {
      sdk
        .accountGetaccount({ address, visible: true })
        .then(({ data }) => resolve(data.balance))
        .catch((err) => reject(err));
    });
  }

  GetTransactionInfoById(value = "8d1f8cc67cb3797a19e93c7bfdc90434a4c63d9301d47745e8f668aa4ef24bb8") {
    return new Promise((resolve, reject) => {
      sdk
        .gettransactioninfobyid1({ value })
        .then(({ data }) => resolve(data))
        .catch((err) => console.error(err));
    });
  }

  GetTransactionInfoByBlockNum(num = "44842895") {
    return new Promise((resolve, reject) => {
      sdk
        .gettransactioninfobyblocknum1({ num })
        .then(({ data }) => resolve(data))
        .catch((err) => console.error(err));
    });
  }
}

module.exports = {
  Tron_helper,
};
