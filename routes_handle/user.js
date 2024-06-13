const db = require("../db/index");

const crypto = require("crypto");
const fs = require("fs");

const sqlQuery = (sqlStr, option) => {
  return new Promise((resolve, reject) => {
    db.query(sqlStr, option, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

exports.uploadAvatar = async (req, res) => {
  const onlyId = crypto.randomUUID();
  let oldName = req.files[0].filename;
  let newName = Buffer.from(req.files[0].originalname, "latin1").toString("utf8");

  fs.renameSync("./public/upload/" + oldName, "./public/upload/" + newName);

  try {
    await sqlQuery("insert into users_avatar set ?", {
      image_url: `http://127.0.0.1:3007/upload/${newName}`,
      onlyId,
    });

    res.send({
      onlyId,
      code: 0,
      url: "http://127.0.0.1:3007/upload/" + newName,
    });
  } catch (error) {
    res.cc(error);
  }
};

exports.bindAccount = (req, res) => {
  const { account, onlyId, url } = req.body;

  const sql_update = "update users_avatar set account = ? where onlyId = ?";

  db.query(sql_update, [account, onlyId], (err, result) => {
    if (err) return res.cc(err);

    if (result.affectedRows == 1) {
      const sql_select = "update users_info set image_url = ? where account = ?";

      db.query(sql_select, [url, account], (err, result) => {
        if (err) return res.cc(err);

        res.send({
          code: 0,
          msg: "修改成功",
        });
      });
    }
  });
};

exports.getUserList = (req, res) => {
  const { pageNum = 1, pageSize = 20 } = req.body;

  const sql_select = `select * from users_info order by id ASC limit ${pageSize} offset ${(pageNum - 1) * pageSize}`;

  db.query(sql_select, "", (err, result) => {
    if (err) return res.cc(err);

    db.query("SELECT COUNT(*) FROM users_info", (err, count) => {
      if (err) return res.cc(err);
      res.send({
        data: {
          total: count[0]["COUNT(*)"],
          pageNum,
          pageSize,
          list: result,
        },
        code: 0,
      });
    });
  });
};

exports.getUserInfo = (req, res) => {
  const info = req.body;

  const sql_select = "select * from users_info where account = ?";

  db.query(sql_select, info.account, (err, result) => {
    if (err) return res.cc(err);

    if (result.length == 0) return res.cc("未找到用户");

    res.send({
      data: result[0],
      code: 0,
    });
  });
};

exports.updateUserInfo = async (req, res) => {
  const info = req.body;

  const update_time = new Date();

  db.query("BEGIN TRAN");

  try {
    const selectUserRes = await sqlQuery("select * from users_info where account = ?", info.account);

    if (selectUserRes.length == 0) return res.cc("账号不存在");

    const updateUserRes = await sqlQuery("update users_info set ? where account = ?", [
      {
        nickname: info.nickname,
        email: info.email,
        sex: info.sex,
        update_time,
      },
      info.account,
    ]);
    if (updateUserRes.affectedRows !== 1) {
      db.query("ROLLBACK TRAN");
      return res.cc("修改失败");
    }

    if (req.files.length != 0) {
      const onlyId = crypto.randomUUID();
      const oldName = req.files[0].filename;
      const newName = Buffer.from(req.files[0].originalname, "latin1").toString("utf8");
      fs.renameSync("./public/upload/" + oldName, "./public/upload/" + newName);
      const image_url = `http://127.0.0.1:3007/upload/${newName}`;

      const insertImgRes = await sqlQuery("insert into users_avatar set ?", {
        image_url,
        onlyId,
      });
      if (insertImgRes.affectedRows !== 1) {
        db.query("ROLLBACK TRAN");
        return res.cc("修改失败");
      } else {
        await sqlQuery("update users_info set image_url = ? where account = ?", [image_url, info.account]);

        db.query("COMMIT");

        res.send({
          status: 0,
          msg: "修改成功",
        });
      }
    } else {
      db.query("COMMIT");
      res.send({
        status: 0,
        msg: "修改成功",
      });
    }
  } catch (error) {
    db.query("ROLLBACK TRAN");
    return res.cc(error);
  }
};

exports.deleteAccount = (req, res, next) => {
  const sql_delete = "delete from users_info where account = ?";

  db.query(sql_delete, req.body.account, (err, results) => {
    if (err) return res.cc(err);

    if (results.affectedRows !== 1) return res.cc("删除失败");

    res.send({
      code: 0,
      msg: "删除成功",
    });
  });
};
