const sdk = require("@api/tron");

const API_KEY = "96848c40-7cf5-4011-a930-05d2a09e5aab";

class Tron_helper {
  constructor() {
    address: "";
  }
  //获取用户
  getAccount(address = "TZ4UXDV5ZhNW7fb2AMSbgfAEZ7hWsnYS2g") {
    return new Promise((resolve, reject) => {
      sdk
        .accountGetaccount({ address, visible: true })
        .then(({ data }) => resolve(data.address))
        .catch((err) => reject(err));
    });
  }

  getBalance(address = "TZ4UXDV5ZhNW7fb2AMSbgfAEZ7hWsnYS2g") {
    return new Promise((resolve, reject) => {
      sdk
        .accountGetaccount({ address, visible: true })
        .then(({ data }) => resolve(data.balance))
        .catch((err) => reject(err));
    });
  }
}

module.exports = {
  Tron_helper,
};
