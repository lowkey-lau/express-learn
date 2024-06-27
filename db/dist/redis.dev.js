"use strict";

var _redis = require("redis");

// 创建客户端
var redisClient = (0, _redis.createClient)();
redisClient.connect()["catch"](console.error); // const redisClient = redis.createClient("127.0.0.1", "6379");

redisClient.on("ready", function () {
  console.log("redis启动成功");
});
redisClient.on("error", function () {
  console.log("redis启动失败");
});
module.exports = {
  redisClient: redisClient
};