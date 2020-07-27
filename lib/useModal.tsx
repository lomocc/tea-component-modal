import { useContext } from 'react';
import { ModalContext } from './context';

/**
 * hooks 方式获取 close 方法
 * const { close } = useModal()
 */
export default function useModal() {
  return useContext(ModalContext);
}
