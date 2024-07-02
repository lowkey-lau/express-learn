import { Web3 } from "web3";
import * as bip39 from "bip39";
import * as util from "ethereumjs-util";
import { hdkey } from "ethereumjs-wallet";
import erc20 from "../abi/erc20";
var JSONbig = require("json-bigint");
// import Wallet from "ethereumjs-wallet";

const API_KEY = "SETC6XSJ2HAX97669NN5Q5ZQ7YSM2MSPXH";
const CHECK_API_URL = "https://api-sepolia.etherscan.io/api";
const provider = "https://sepolia.infura.io/v3/a332c6aedf5f4a0da6b3e7ea57540c14";
var web3Provider = new Web3.providers.HttpProvider(provider);

class EVM_HELPER {
  web3;

  constructor() {
    address: "";
    blockConfirmQuantity: 10;
    // const provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/a332c6aedf5f4a0da6b3e7ea57540c14");
    this.web3 = new Web3(web3Provider);
  }

  // 创建地址，包含助记词/私钥/公钥
  CreateAccount = async () => {
    let mnemonic = bip39.generateMnemonic();
    return this.MnemonicToAddressInfo(mnemonic);
  };

  CreateMnemonic = async () => {
    return bip39.generateMnemonic();
  };

  MnemonicToAddressInfo = async (mnemonic, order = 0) => {
    let seed = await bip39.mnemonicToSeed(mnemonic);
    let hdWallet = hdkey.fromMasterSeed(seed);

    let key = hdWallet.derivePath("m/44'/60'/0'/0/" + order);
    //5.从keypair中获取私钥
    // console.log("私钥：" + util.bufferToHex(key._hdkey._privateKey));
    //6.从keypair中获取公钥
    // console.log("公钥：" + util.bufferToHex(key._hdkey._publicKey));
    //7.使用keypair中的公钥生成地址
    let address = util.pubToAddress(key._hdkey._publicKey, true);
    //编码地址
    address = util.toChecksumAddress(`0x${address.toString("hex")}`);
    // console.log("地址：" + address, "\n");

    return {
      mnemonic,
      address,
      privateKey: util.bufferToHex(key._hdkey._privateKey),
      publicKey: util.bufferToHex(key._hdkey._publicKey),
    };
  };

  // 根据助记词生成钱包地址
  ImportMnemonic = (mnemonic) => {
    return this.MnemonicToAddressInfo(mnemonic);
  };

  // 根据私钥生成钱包地址
  ImportPrivateKey = (privateKey) => {
    return this.web3.eth.accounts.privateKeyToAccount(privateKey);
  };

  GetBalance = async (address = "0x13af0a25C8EA8d45A3E20B4f6b987035e01ED302") => {
    try {
      const balance = await this.web3.eth.getBalance(address);
      return this.web3.utils.fromWei(balance, "ether");
    } catch (error) {
      console.log(error);
    }
  };

  GetContractBalance = async (contractAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789", address = "0x13af0a25C8EA8d45A3E20B4f6b987035e01ED302") => {
    this.web3.eth.defaultAccount = address;

    try {
      // 获取代币合约实例
      const erc20Contract = new this.web3.eth.Contract(erc20, contractAddress);

      // 调用代币合约的balanceOf方法获取余额
      let balance = await erc20Contract.methods.balanceOf(address).call();

      // 格式化余额为代币数值
      let erc20Balance = this.web3.utils.fromWei(balance, "ether");

      console.log(`代币余额: ${balance}`);
      console.log(`代币格式化余额: ${erc20Balance}`);

      return erc20Balance;
    } catch (error) {
      console.error("获取代币余额出错:", error);
    }
  };

  GetTransactionById = async (value = "0x5c06763f204d4b33cb9f0311537a44af01e926aaeb9dcc73958ba82cacf16437") => {
    try {
      const res = await this.web3.eth.getTransactionReceipt(value);
      return toObject(res);
    } catch (error) {
      console.log(error);
    }
  };

  GetTransactionInfoByBlockNum = async (num = 6139215) => {
    try {
      const res = await this.web3.eth.getBlock(num);
      return toObject(res);
    } catch (error) {
      console.log(error);
    }
  };

  GetLatestBlock = async () => {
    try {
      const res = await this.web3.eth.getBlockNumber();
      return toObject(res);
    } catch (error) {
      console.log(error);
    }
  };

  SendTransaction = async (privateKey, toAddress, quantity) => {
    try {
      const sender = this.web3.eth.accounts.wallet.add(privateKey)[0];

      return new Promise((resolve, reject) => {
        this.web3.eth
          .sendTransaction({
            from: sender.address,
            to: toAddress,
            value: this.web3.utils.toWei(quantity, "ether"),
          })
          .on("transactionHash", function (hash) {
            console.log("transactionHash", hash);
          })
          .on("receipt", function (receipt) {
            // console.log("receipt", receipt);
            resolve(toObject(receipt));
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            // console.log("confirmation", confirmationNumber, receipt);
          })
          .on("error", () => {
            // console.log(error);
            reject(error);
          }); // If a out of gas error, the second parameter is the receipt.
      });
    } catch (error) {
      console.log(error);
    }

    // return this.web3.eth.sendTransaction(toAddress, this.tronWeb.toSun(quantity), privateKey);
  };

  SendContractTransaction = async (privateKey, contractAddress, toAddress, quantity) => {
    try {
      const sender = this.web3.eth.accounts.wallet.add(privateKey)[0];
      // 获取代币合约实例
      const erc20Contract = new this.web3.eth.Contract(erc20, contractAddress, {
        from: sender.address,
      });

      // 调用代币合约Transfer方法
      let result = await erc20Contract.methods.transfer(toAddress, this.web3.utils.toWei(quantity, "ether")).send();

      return toObject(result);
    } catch (error) {
      console.log(error);
    }
  };

  GetTransactionList = async (address = "0x13af0a25C8EA8d45A3E20B4f6b987035e01ED302") => {
    return new Promise((resolve, reject) => {
      fetch(
        `${CHECK_API_URL}?${new URLSearchParams({
          module: "account",
          action: "txlist",
          address,
          startblock: "0",
          endblock: "99999999",
          page: "1",
          offset: "10",
          sort: "asc",
          apikey: API_KEY,
        }).toString()}`
      )
        .then((res) => res.json())
        .then((json) => resolve(json))
        .catch((err) => reject("error:" + err));
    });
  };
}

const toObject = (e) => {
  return JSON.parse(
    JSON.stringify(
      e,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    )
  );
};

module.exports = {
  EVM_HELPER,
};
