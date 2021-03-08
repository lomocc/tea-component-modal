# tea-component-modal

## Features

- **不中断数据流**
  > 我们经常使用的 [API 唤起](http://tea.tencent.com/component/modal/API%E5%94%A4%E8%B5%B7%EF%BC%88%E4%B8%8D%E6%8E%A8%E8%8D%90%EF%BC%89) 方式打开弹窗，如：

```js
import { Button, Modal } from '@tencent/tea-component';

Modal.show({
  caption: 'Modal.show() 打开对话框',
  children: <TimingModal onClose={() => modal.destroy()} />,
  onClose: () => modal.destroy(),
});
```

> 但是这个功能开发者应该慎用，因为使用 API 打开对话框，实际上会断掉数据流，并不是一个好的实践。

> 当使用 `modalRef.current.show` 这种方式时相当于利用 ref 保留了自动管理的生命周期，数据流也不会中断，外部 [Context](https://reactjs.org/docs/context.html) 也能很好的保留。

- **自动随父节点销毁**
  > 同样的，全局 `Modal.show` 这种方式弹框由于是将组件挂载到了全局，所以很难做到自动随父组件销毁，必须手动额外调用销毁方法，使用反而变得复杂。

## Usage

- 主要用法

```js
import React, { useRef } from 'react';
import Modal from 'tea-component-modal';

const App = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = async () => {
    const flag = await modalRef.current!.show(props, children);
    if (flag & Modal.OK) {
      // 点击了确定按钮
    }
  };
  return (
    <>
      <Modal ref={modalRef} />
      <button onClick={onClick}>打开弹窗</button>
    </>
  );
};
```

- 其他用法

```js
const flag = await modalRef.current.confirm({...});
const flag = await modalRef.current.success({...});
const flag = await modalRef.current.warn({...});
const flag = await modalRef.current.error({...});
```

## Props

-
