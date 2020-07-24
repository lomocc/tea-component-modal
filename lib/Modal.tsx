import React, {
  ComponentType,
  createRef,
  PureComponent,
  ReactElement,
  ReactType,
  RefObject,
} from 'react';
import { ModalComponentProps, ModalProps } from './interfaces';
import mergeRefs from './mergeRefs';

interface Props extends ModalProps {
  itemRenderer?: ComponentType<ModalProps>;
}
interface State {
  children: ReactElement[];
}
/**
 * 弹窗管理器，可以随父组件一同关闭，也可以获得父组件状态（Context）
 * <Modal ref={ModalRef} />
 *
 * let flag = await ModalRef.current.show(
 * {
 *   title: "确定要删除码规格？",
 *   size: "s",
 *   children: "此操作不可撤销，请谨慎操作"
 * }
 *   );
 */
export default class Modal extends PureComponent<Props, State> {
  static defaultProps: Props;
  /**
   * 无任何选择
   */
  static NONE = 0x0000;
  /**
   * 无任何选择，阻止窗口关闭
   */
  static PREVENT_DEFAULT = 0x0000;
  /**
   * 点击 '是'
   */
  static YES = 0x0001;
  /**
   * 选择 '否'
   */
  static NO = 0x0002;
  /**
   * 选择 '确定'
   */
  static OK = 0x0004;
  /**
   * 选择 '取消'
   */
  static CANCEL = 0x0008;
  /**
   * 选择 '关闭'
   */
  static CLOSE = 0x0010;

  state: State = {
    children: [],
  };
  /**
   * 打开弹窗
   * @param modalProps
   * @param ref
   */
  show(
    modalProps?: Partial<ModalProps>,
    ref?: RefObject<ModalComponentProps>
  ): Promise<number> {
    return new Promise<number>((resolve) => {
      const { itemRenderer, onClose, ...remainingProps } = this.props;
      const innerRef: RefObject<Modal> = createRef();
      const ModalItemRenderer: ReactType = itemRenderer!;
      const modal: ReactElement = (
        <ModalItemRenderer
          {...remainingProps}
          {...modalProps}
          key={Date.now()}
          ref={mergeRefs([ref, innerRef])}
          onCloseCallback={resolve}
          onExited={() => {
            this.setState(({ children }) => ({
              children: children.filter((child) => child !== modal),
            }));
          }}
        />
      );
      this.setState(({ children }) => ({
        children: [...children, modal],
      }));
    });
  }
  /**
   * API 的方式唤起一个确认对话框
   * @returns 异步返回布尔值，为 `true` 则表示用户确认，为 `false` 则表示用户取消
   */
  confirm = (modalProps?: ModalProps, ref?: RefObject<ModalComponentProps>) =>
    this.show(
      {
        flags: Modal.OK | Modal.CANCEL | Modal.CLOSE,
        ...modalProps,
      },
      ref
    );
  /**
   * 成功弹窗
   */
  success = (modalProps?: ModalProps, ref?: RefObject<ModalComponentProps>) =>
    this.show(
      {
        flags: Modal.OK,
        icon: 'success',
        ...modalProps,
      },
      ref
    );
  /**
   * 错误弹窗
   */
  error = (modalProps?: ModalProps, ref?: RefObject<ModalComponentProps>) =>
    this.show(
      {
        flags: Modal.OK,
        icon: 'error',
        ...modalProps,
      },
      ref
    );
  /**
   * 提醒信息
   */
  alert = (modalProps?: ModalProps, ref?: RefObject<ModalComponentProps>) =>
    this.show(
      {
        flags: Modal.OK,
        ...modalProps,
      },
      ref
    );
  /**
   * 警告信息
   */
  warning = (modalProps?: ModalProps, ref?: RefObject<ModalComponentProps>) =>
    this.show(
      {
        flags: Modal.OK,
        icon: 'warning',
        ...modalProps,
      },
      ref
    );
  /**
   * 警告信息
   */
  warn = (modalProps?: ModalProps, ref?: RefObject<ModalComponentProps>) =>
    this.warning(modalProps, ref);

  render() {
    const { children } = this.state;
    return children;
  }
}
