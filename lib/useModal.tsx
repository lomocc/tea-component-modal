import { useContext } from 'react';
import { ModalContext } from './ModalContext';

/**
 * hooks 方式获取 closeModal 方法
 * const { closeModal } = useModal()
 */
export default function useModal() {
  return useContext(ModalContext);
}
