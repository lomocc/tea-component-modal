import React, {
  ComponentType,
  PureComponent,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';
import { ModalComponentProps } from '../types/ModalComponentProps';
import { ModalProps } from '../types/ModalProps';
import { ModalProvider } from './context';
import { Flag } from './Flag';

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
export class Modal extends PureComponent<Props, State> {
  /**
   * 无任何选择
   */
  static NONE: number;
  /**
   * 无任何选择，阻止窗口关闭
   */
  static PREVENT_DEFAULT: number;
  /**
   * 点击 '是'
   */
  static YES: number;
  /**
   * 选择 '否'
   */
  static NO: number;
  /**
   * 选择 '确定'
   */
  static OK: number;
  /**
   * 选择 '取消'
   */
  static CANCEL: number;
  /**
   * 选择 '关闭'
   */
  static CLOSE: number;

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
  ): Promise<number> => {
    return new Promise<number>(resolve => {
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
              children: children.filter(child => child !== modal),
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
Object.assign(Modal, Flag);
