import fetch from "node-fetch";
import { Web3 } from "web3";
import * as bip39 from "bip39";
import * as util from "ethereumjs-util";
import { hdkey } from "ethereumjs-wallet";
// import Wallet from "ethereumjs-wallet";

const API_KEY = "96848c40-7cf5-4011-a930-05d2a09e5aab";
class Eth_helper {
  web3;

  constructor() {
    address: "";
    blockConfirmQuantity: 10;

    this.web3 = new Web3("https://mainnet.infura.io/v3/");
  }

  // 创建地址，包含助记词/私钥/公钥
  CreateAccount = async () => {
    let mnemonic = bip39.generateMnemonic();
    console.log(mnemonic);

    //2.将助记词转成seed
    let seed = await bip39.mnemonicToSeed(mnemonic);
    console.log("seed -> ", seed);
    console.log("seed：" + util.bufferToHex(seed));
    // return await this.tronWeb.createRandom();

    let hdWallet = hdkey.fromMasterSeed(seed);

    let wallets = [];

    for (let i = 0; i < 1; i++) {
      //4.生成钱包中在m/44'/60'/0'/0/i路径的keypair
      let key = hdWallet.derivePath("m/44'/60'/0'/0/" + i);
      //5.从keypair中获取私钥
      console.log("私钥：" + util.bufferToHex(key._hdkey._privateKey));
      //6.从keypair中获取公钥
      console.log("公钥：" + util.bufferToHex(key._hdkey._publicKey));
      //7.使用keypair中的公钥生成地址
      let address = util.pubToAddress(key._hdkey._publicKey, true);
      //编码地址
      address = util.toChecksumAddress(`0x${address.toString("hex")}`);
      console.log("地址：" + address, "\n");

      wallets.push({
        address,
        privateKey: util.bufferToHex(key._hdkey._privateKey),
        publicKey: util.bufferToHex(key._hdkey._publicKey),
      });
    }

    return {
      mnemonic,
      address: wallets[0].address,
      privateKey: wallets[0].privateKey,
      publicKey: wallets[0].publicKey,
    };
  };

  // 根据助记词生成钱包地址
  ImportMnemonic = (mnemonic) => {
    return this.web3.eth.accounts.wallet.add(mnemonic);
    // return this.web3.fromMnemonic(mnemonic);
  };

  // // 根据私钥生成钱包地址
  // importPrivateKey = (privateKey) => {
  //   return this.tronWeb.address.fromPrivateKey(privateKey);
  // };

  // GetBalance = async (address = "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn") => {
  //   const balance = await this.tronWeb.trx.getBalance(address);
  //   return Number(this.tronWeb.fromSun(balance));
  //   // try {
  //   //   const url = `${REQUEST_NET}/wallet/getaccount`;
  //   //   let res = await fetchFun(url, { address });
  //   //   const balance = Number(this.tronWeb.fromSun(res.balance));
  //   //   console.log(res.balance);
  //   //   console.log(balance);
  //   //   return balance;
  //   // } catch (error) {
  //   //   console.error("获取TRC余额出错:", error);
  //   // }
  // };

  // GetAddressBalance = async (contractAddress = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs", address = "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn") => {
  //   this.tronWeb.setAddress(address);

  //   try {
  //     const { abi } = await this.tronWeb.trx.getContract(contractAddress);

  //     // 获取USDT合约实例
  //     const usdtContract = await this.tronWeb.contract(abi.entrys, contractAddress);

  //     // 调用USDT合约的balanceOf方法获取余额
  //     let balance = await usdtContract.methods.balanceOf(address).call();

  //     // 格式化余额为USDT数值
  //     let usdtBalance = this.tronWeb.toDecimal(this.tronWeb.fromSun(balance));

  //     console.log(`USDT余额: ${balance}`);
  //     console.log(`USDT格式化余额: ${usdtBalance}`);

  //     return usdtBalance;
  //   } catch (error) {
  //     console.error("获取USDT余额出错:", error);
  //   }
  // };

  // GetTransactionById = async (value = "921cb9f044ab87e8c38870db9dece424a9e7f6c2c1e2159645ff6322cf49e391") => {
  //   return this.tronWeb.trx.getTransaction(value);
  // };

  // GetTransactionInfoByBlockNum = async (num = 44870674) => {
  //   return this.tronWeb.trx.getBlock(num);
  // };

  // GetNowBlock = async () => {
  //   return this.tronWeb.trx.getCurrentBlock();
  //   // const url = `${REQUEST_NET}/wallet/getnowblock`;
  //   // return await fetchFun(url);
  // };

  // SendTransaction = async (privateKey, toAddress, quantity) => {
  //   this.tronWeb.setPrivateKey(privateKey);
  //   return this.tronWeb.trx.sendTransaction(toAddress, this.tronWeb.toSun(quantity), privateKey);
  // };

  // SendAddressTransaction = async (privateKey, contractAddress, toAddress, quantity) => {
  //   this.tronWeb.setPrivateKey(privateKey);
  //   try {
  //     const { abi } = await this.tronWeb.trx.getContract(contractAddress);
  //     // 获取USDT合约实例
  //     const usdtContract = await this.tronWeb.contract(abi.entrys, contractAddress);

  //     // 调用USDT合约Transfer方法
  //     let result = await usdtContract.methods.transfer(toAddress, this.tronWeb.toSun(quantity)).send();

  //     return this.tronWeb.trx.getTransaction(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // GetTransactionList = async (address = "TXpQpC14yYKbjdmXR5W6p3vLsrAn4MwXzn") => {
  //   return new Promise((resolve, reject) => {
  //     const url = `${REQUEST_NET}/v1/accounts/${address}/transactions`;
  //     const options = { method: "GET", headers: { accept: "application/json" } };

  //     fetch(url, options)
  //       .then((res) => res.json())
  //       .then((json) => resolve(json))
  //       .catch((err) => reject("error:" + err));
  //   });
  // };
}

module.exports = {
  Eth_helper,
};
