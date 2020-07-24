# tea-component-modal

## Usage

```
import Modal from 'tea-component-modal';

let flag = await modalRef.current.show({
    title: '弹窗',
    children: <Component />
});
let flag = await modalRef.current.confirm({
    message: 'message',
    description: 'description'
});
let flag = await modalRef.current.success({...});
let flag = await modalRef.current.warn({...});
let flag = await modalRef.current.error({...});

<Modal ref={modalRef}>
```
