import {
  ButtonProps,
  ModalMessageProps,
  ModalProps as ModalImplProps,
} from '@tencent/tea-component';

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
  root?: Node;
  /** Modal title */
  title?: ModalImplProps['caption'];
  /** ModalMessage icon */
  icon?: ModalMessageProps['icon'];
  /** ModalMessage message */
  message?: ModalMessageProps['message'];
  /** ModalMessage description */
  description?: ModalMessageProps['description'];
  /** 需要展示哪些按钮 */
  flags?: number;
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
  onClose?: (flag: number) => number | void | PromiseLike<number | void>;
  /**
   * 完全关闭时调用的回调
   */
  onExited?: (flag: number) => void;
}
