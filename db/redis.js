import { createClient } from "redis";

// 创建客户端
let redisClient = createClient();
redisClient.connect().catch(console.error);

// const redisClient = redis.createClient("127.0.0.1", "6379");

redisClient.on("ready", () => {
  console.log("redis启动成功");
});

redisClient.on("error", () => {
  console.log("redis启动失败");
});

module.exports = {
  redisClient,
};
