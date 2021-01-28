export const enum Flag {
  /**
   * 无任何选择
   */
  NONE = 0x0000,
  /**
   * 无任何选择，阻止窗口关闭
   */
  PREVENT_DEFAULT = 0x0000,
  /**
   * 点击 '是'
   */
  YES = 0x0001,
  /**
   * 选择 '否'
   */
  NO = 0x0002,
  /**
   * 选择 '确定'
   */
  OK = 0x0004,
  /**
   * 选择 '取消'
   */
  CANCEL = 0x0008,
  /**
   * 选择 '关闭'
   */
  CLOSE = 0x0010,
  /**
   * 拒绝，会附带播放 shakeX 动画
   */
  REJECT = 0x0020,
}
