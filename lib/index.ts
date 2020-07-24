import Modal from './Modal';
import { ModalConsumer, ModalContext } from './ModalContext';
import ModalItemRenderer from './ModalItemRenderer';
import useModal from './useModal';
import withModal from './withModal';
export * from './interfaces';
export { Modal, ModalConsumer, ModalContext, withModal, useModal };

Modal.defaultProps = {
  itemRenderer: ModalItemRenderer,
};

export default Modal;
