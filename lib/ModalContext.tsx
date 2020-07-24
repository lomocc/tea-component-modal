import React from 'react';
import { ModalContextProps } from './interfaces';

const ModalContext = React.createContext<ModalContextProps | null>(null);
const { Consumer: ModalConsumer, Provider: ModalProvider } = ModalContext;

export { ModalContext, ModalConsumer, ModalProvider };
