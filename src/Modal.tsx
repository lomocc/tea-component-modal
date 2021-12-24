import React, {
  PureComponent,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';
import {
  ButtonProps,
  ModalMessageProps,
  ModalProps as ModalImplProps,
} from 'tea-component';
import { ModalProvider } from './context';
import { Flag } from './Flag';

export interface ModalComponentProps {
  /**
   * 关闭弹窗
   * @param flag
   */
  close?(flag?: Flag): Promise<void>;
}

export interface ModalProps
  extends Omit<
    ModalImplProps,
    | 'caption'
    | 'visible'
    | 'onClose'
    | 'onExited'
    | 'destroyOnClose'
    | 'disableCloseIcon'
  > {
  /** Modal title */
  title?: ModalImplProps['caption'];
  /** ModalMessage icon */
  icon?: ModalMessageProps['icon'];
  /** ModalMessage message */
  message?: ModalMessageProps['message'];
  /** ModalMessage description */
  description?: ModalMessageProps['description'];
  /** 需要展示哪些按钮 */
  flags?: Flag;
  yesLabel?: string;
  noLabel?: string;
  okLabel?: string;
  cancelLabel?: string;
  yesProps?: Omit<ButtonProps, 'onClick'>;
  noProps?: Omit<ButtonProps, 'onClick'>;
  okProps?: Omit<ButtonProps, 'onClick'>;
  cancelProps?: Omit<ButtonProps, 'onClick'>;
  /**
   * 点选确认/取消/是/否按钮时触发，可以返回新的 flag
   */
  onClose?: (
    flag: Flag,
    ref?: RefObject<any>
  ) => Flag | void | PromiseLike<Flag | void>;
  /**
   * 完全关闭时调用的回调
   */
  onExited?: (flag: Flag) => void;
}

interface Props extends ModalProps {}
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
export class Modal extends PureComponent<Props, State> {
  /**
   * 无任何选择
   */
  static NONE = Flag.NONE;
  /**
   * 无任何选择，阻止窗口关闭
   */
  static PREVENT_DEFAULT = Flag.PREVENT_DEFAULT;
  /**
   * 点击 '是'
   */
  static YES = Flag.YES;
  /**
   * 选择 '否'
   */
  static NO = Flag.NO;
  /**
   * 选择 '确定'
   */
  static OK = Flag.OK;
  /**
   * 选择 '取消'
   */
  static CANCEL = Flag.CANCEL;
  /**
   * 选择 '关闭'
   */
  static CLOSE = Flag.CLOSE;
  /**
   * 拒绝，会附带播放 shakeX 动画
   */
  static REJECT = Flag.REJECT;

  state: State = {
    children: [],
  };
  /**
   * 打开弹窗通用方法  flags = Modal.OK
   * @param modalProps
   * @param children
   */
  show = (
    modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
    children?: ReactNode
  ): Promise<Flag> => {
    return new Promise<Flag>((resolve) => {
      const remainingProps = this.props;
      const modal = (
        <ModalProvider
          {...remainingProps}
          {...modalProps}
          key={Date.now()}
          ref={modalProps?.ref as RefObject<ModalProvider>}
          onCloseCallback={resolve}
          onExited={() => {
            this.setState(({ children }) => ({
              children: children.filter((child) => child !== modal),
            }));
          }}
        >
          {children ?? modalProps?.children ?? remainingProps?.children}
        </ModalProvider>
      );
      this.setState(({ children }) => ({
        children: [...children, modal],
      }));
    });
  };
  /**
   * 确认弹窗 flags = Modal.OK | Modal.CANCEL | Modal.CLOSE
   */
  confirm = (
    modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
    children?: ReactNode
  ) =>
    this.show(
      {
        flags: Flag.OK | Flag.CANCEL | Flag.CLOSE,
        icon: 'infoblue',
        size: 's',
        ...modalProps,
      },
      children
    );
  /**
   * 成功弹窗 flags = Modal.OK
   */
  success = (
    modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
    children?: ReactNode
  ) =>
    this.show(
      {
        flags: Flag.OK,
        icon: 'success',
        size: 's',
        ...modalProps,
      },
      children
    );
  /**
   * 错误弹窗 flags = Modal.OK
   */
  error = (
    modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
    children?: ReactNode
  ) =>
    this.show(
      {
        flags: Flag.OK,
        icon: 'error',
        size: 's',
        ...modalProps,
      },
      children
    );
  /**
   * 提醒信息 flags = Modal.OK
   */
  alert = (
    modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
    children?: ReactNode
  ) =>
    this.show(
      {
        flags: Flag.OK,
        size: 's',
        ...modalProps,
      },
      children
    );
  /**
   * 警告信息 flags = Modal.OK
   */
  warning = (
    modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
    children?: ReactNode
  ) =>
    this.show(
      {
        flags: Flag.OK,
        icon: 'warning',
        size: 's',
        ...modalProps,
      },
      children
    );
  /**
   * 警告信息 flags = Modal.OK
   */
  warn = (
    modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
    children?: ReactNode
  ) => this.warning(modalProps, children);

  render() {
    const { children } = this.state;
    return children;
  }
}
