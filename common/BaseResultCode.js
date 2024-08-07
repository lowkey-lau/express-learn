/**
 * @description 业务异常通用code
 *
 */
class BaseResultCode {
  /***********************************/
  /**
   * code
   */
  code;
  /**
   * 说明
   */
  msg;

  constructor(code, msg) {
    this.code = code;
    this.msg = msg;
  }

  /************************************/
  static SUCCESS = new BaseResultCode(0, "成功");
  static FAILED = new BaseResultCode(1, "失败");
  static VALIDATE_FAILED = new BaseResultCode(400, "参数校验失败");
  static API_NOT_FOUNT = new BaseResultCode(404, "接口不存在");
  static API_BUSY = new BaseResultCode(429, "操作过于频繁");
}

module.exports = BaseResultCode;
