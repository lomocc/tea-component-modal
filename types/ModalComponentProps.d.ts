export interface ModalComponentProps {
  /**
   * 关闭弹窗
   * @param flag
   */
  close?(flag?: number): Promise<void>;
}
