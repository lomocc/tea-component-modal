import {
  Button,
  ButtonProps,
  Modal as ModalImpl,
} from '@tencent/tea-component';
import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Flag from './Flag';
import { ModalComponentProps, ModalProps } from './interfaces';

const ModalContext = React.createContext<Pick<
  ModalComponentProps,
  'close'
> | null>(null);
const { Consumer: ModalConsumer, Provider } = ModalContext;

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

export interface Props extends ModalProps {
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
  readonly modalComponentProps: ModalComponentProps;
}

/**
 * 弹框 Provider
 */
class ModalProvider extends PureComponent<Props, State> {
  static defaultProps = {
    root: document.body,
    flags: Flag.OK,
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
      loadingFlag: Flag.NONE,
      modalComponentProps: {
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
        loadingFlag: Flag.NONE,
      });
    } else {
      this.setState({ loadingFlag: Flag.NONE });
    }
  };
  private onClose = async () => {
    await this.onFlag(Flag.CLOSE);
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
  close = async (flag: number = Flag.CANCEL) => {
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
    const { visible, loadingFlag, modalComponentProps } = this.state;

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
      !!(flags! & Flag.OK) && (
        <ItemButton
          key={`${Flag.OK}`}
          flag={Flag.OK}
          onClick={this.onFlag}
          type="primary"
          loading={Boolean(loadingFlag & Flag.OK)}
          {...okProps}
        >
          {okLabel}
        </ItemButton>
      ),
      !!(flags! & Flag.CANCEL) && (
        <ItemButton
          key={`${Flag.CANCEL}`}
          flag={Flag.CANCEL}
          onClick={this.onFlag}
          loading={Boolean(loadingFlag & Flag.CANCEL)}
          {...cancelProps}
        >
          {cancelLabel}
        </ItemButton>
      ),
      !!(flags! & Flag.YES) && (
        <ItemButton
          key={`${Flag.YES}`}
          flag={Flag.YES}
          onClick={this.onFlag}
          loading={Boolean(loadingFlag & Flag.YES)}
          {...yesProps}
        >
          {yesLabel}
        </ItemButton>
      ),
      !!(flags! & Flag.NO) && (
        <ItemButton
          key={`${Flag.NO}`}
          flag={Flag.NO}
          onClick={this.onFlag}
          loading={Boolean(loadingFlag & Flag.NO)}
          {...noProps}
        >
          {noLabel}
        </ItemButton>
      ),
    ].filter(Boolean);

    return (
      <Provider value={modalComponentProps}>
        {ReactDOM.createPortal(
          <ModalImpl
            {...remainingProps}
            disableCloseIcon={!(flags! & Flag.CLOSE)}
            caption={title}
            visible={visible}
            onClose={this.onClose}
            onExited={this.onExited}
          >
            {(children || icon || message || description) && (
              <ModalImpl.Body>
                {(icon || message || description) && (
                  <ModalImpl.Message
                    icon={icon}
                    message={message}
                    description={description}
                  />
                )}
                {children}
              </ModalImpl.Body>
            )}
            {buttons && <ModalImpl.Footer>{buttons}</ModalImpl.Footer>}
          </ModalImpl>,
          this.container
        )}
      </Provider>
    );
  }
}
export { ModalContext, ModalConsumer, ModalProvider };
