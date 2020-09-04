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

export interface ModalComponentProps {
  /**
   * 关闭弹窗
   * @param flag
   */
  close?(flag?: number): Promise<void>;
}
// interface ModalInterface {
//   /**
//    * 打开弹窗
//    * @param modalProps
//    * @param ref
//    */
//   show?(
//     modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
//     children?: ReactNode
//   ): Promise<number>;
//   /**
//    * API 的方式唤起一个确认对话框
//    * @returns 异步返回布尔值，为 `true` 则表示用户确认，为 `false` 则表示用户取消
//    */
//   confirm?(
//     modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
//     children?: ReactNode
//   ): Promise<number>;
//   /**
//    * 成功弹窗
//    */
//   success?(
//     modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
//     children?: ReactNode
//   ): Promise<number>;
//   /**
//    * 错误弹窗
//    */
//   error?(
//     modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
//     children?: ReactNode
//   ): Promise<number>;
//   /**
//    * 提醒信息
//    */
//   alert?(
//     modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
//     children?: ReactNode
//   ): Promise<number>;
//   /**
//    * 警告信息
//    */
//   warning?(
//     modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
//     children?: ReactNode
//   ): Promise<number>;
//   /**
//    * 警告信息
//    */
//   warn?(
//     modalProps?: ModalProps & { ref?: RefObject<ModalComponentProps> },
//     children?: ReactNode
//   ): Promise<number>;
// }
