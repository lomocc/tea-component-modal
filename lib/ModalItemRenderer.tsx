import {
  Button,
  ButtonProps,
  Modal as ModalImpl,
} from '@tencent/tea-component';
import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { ModalContextProps, ModalProps } from './interfaces';
import Modal from './Modal';
import { ModalProvider } from './ModalContext';

interface ItemButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: (flag: number) => void;
  flag: number;
}
class ItemButton extends Component<ItemButtonProps> {
  private onClick = () => {
    let { onClick, flag } = this.props;
    onClick?.(flag);
  };
  render() {
    let { flag, onClick, ...props } = this.props;
    return <Button {...props} onClick={this.onClick} />;
  }
}

export interface ItemRendererProps extends ModalProps {
  /**
   * 关闭弹窗的回调
   */
  onCloseCallback?: ((flag: number) => void) | null;
}

interface State {
  /**
   * 当前点击选中的按钮 flag
   */
  flag: number | null;
  /**
   * 是否显示弹窗
   */
  visible: boolean;
  /**
   * 正在点击加载的按钮 flag
   */
  loadingFlag: number;
  readonly componentProps: ModalContextProps;
}

/**
 * 全局 Modal 弹框，需要和 ModalContext 搭配使用
 */
export default class ModalItemRenderer extends PureComponent<
  ItemRendererProps,
  State
> {
  static defaultProps = {
    root: document.body,
    flags: Modal.OK,
    yesLabel: '是',
    noLabel: '否',
    okLabel: '确定',
    cancelLabel: '取消',
  };
  private container: HTMLElement = document.createElement('div');
  constructor(props: ModalProps) {
    super(props);
    this.state = {
      flag: null,
      visible: false, // 默认打开
      loadingFlag: Modal.NONE,
      componentProps: {
        close: this.close,
      },
    };
  }
  /**
   * 点击某个 flag 时触发关闭弹窗
   * @param flag
   */
  private onFlag = async (flag: number) => {
    let { onClose, onCloseCallback } = this.props;

    this.setState({ loadingFlag: flag });
    if (typeof onClose === 'function') {
      const pFlag = await onClose(flag);
      // 如果返回了新的 pFlag 那就使用新的
      if (typeof pFlag === 'number') {
        flag = pFlag;
      }
    }
    if (flag & 0xffffff) {
      await onCloseCallback?.(flag);
      this.setState({
        visible: false,
        flag,
        loadingFlag: Modal.NONE,
      });
    } else {
      this.setState({ loadingFlag: Modal.NONE });
    }
  };
  private onClose = async () => {
    await this.onFlag(Modal.CLOSE);
  };
  /**
   * 弹窗关闭（动画完成）
   */
  private onExited = async () => {
    let { flag } = this.state;
    let { onExited } = this.props;
    await onExited?.(flag!);
  };
  /**
   * 关闭弹窗
   */
  close = async (flag: number = Modal.CANCEL) => {
    await this.onFlag(flag);
  };
  componentDidMount() {
    const { root } = this.props;
    root!.appendChild(this.container);

    this.setState({ visible: true });
  }
  componentWillUnmount() {
    const { root } = this.props;
    root!.removeChild(this.container);
  }
  render() {
    const { visible, loadingFlag, componentProps } = this.state;

    const {
      root,
      title,
      icon,
      message,
      description,
      children,
      flags,
      yesLabel,
      noLabel,
      okLabel,
      cancelLabel,
      yesProps,
      noProps,
      okProps,
      cancelProps,
      onClose,
      onCloseCallback,
      onExited,
      ...remainingProps
    } = this.props;

    const buttons = [
      !!(flags! & Modal.OK) && (
        <ItemButton
          key={`${Modal.OK}`}
          flag={Modal.OK}
          onClick={this.onFlag}
          type="primary"
          loading={Boolean(loadingFlag & Modal.OK)}
          {...okProps}
        >
          {okLabel}
        </ItemButton>
      ),
      !!(flags! & Modal.CANCEL) && (
        <ItemButton
          key={`${Modal.CANCEL}`}
          flag={Modal.CANCEL}
          onClick={this.onFlag}
          loading={Boolean(loadingFlag & Modal.CANCEL)}
          {...cancelProps}
        >
          {cancelLabel}
        </ItemButton>
      ),
      !!(flags! & Modal.YES) && (
        <ItemButton
          key={`${Modal.YES}`}
          flag={Modal.YES}
          onClick={this.onFlag}
          loading={Boolean(loadingFlag & Modal.YES)}
          {...yesProps}
        >
          {yesLabel}
        </ItemButton>
      ),
      !!(flags! & Modal.NO) && (
        <ItemButton
          key={`${Modal.NO}`}
          flag={Modal.NO}
          onClick={this.onFlag}
          loading={Boolean(loadingFlag & Modal.NO)}
          {...noProps}
        >
          {noLabel}
        </ItemButton>
      ),
    ].filter(Boolean);

    return (
      <ModalProvider value={componentProps}>
        {ReactDOM.createPortal(
          <ModalImpl
            {...remainingProps}
            disableCloseIcon={!(flags! & Modal.CLOSE)}
            caption={title}
            visible={visible}
            onClose={this.onClose}
            onExited={this.onExited}
          >
            {children ? (
              <ModalImpl.Body>{children}</ModalImpl.Body>
            ) : (
              (icon || message || description) && (
                <ModalImpl.Message
                  icon={icon}
                  message={message}
                  description={description}
                />
              )
            )}
            <ModalImpl.Footer>{buttons}</ModalImpl.Footer>
          </ModalImpl>,
          this.container
        )}
      </ModalProvider>
    );
  }
}
