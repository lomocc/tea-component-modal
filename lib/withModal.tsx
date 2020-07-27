import hoistNonReactStatic from 'hoist-non-react-statics';
import React, { ComponentClass } from 'react';
import { ModalConsumer } from './context';

/**
 * 为自组件注入 close 方法
 */
export default function withModal<P>(WrappedComponent: ComponentClass<P>) {
  const Enhance = React.forwardRef((props: P, ref) => {
    const Component: any = WrappedComponent;
    return (
      <ModalConsumer>
        {(context) => <Component {...props} {...context} ref={ref} />}
      </ModalConsumer>
    );
  });
  Enhance.displayName = 'withModal';
  // @ts-ignore
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
