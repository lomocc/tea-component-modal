import '@tencent/tea-component/lib/tea.css';
import React, { RefObject, useRef } from 'react';
import Modal, { ModalComponentProps } from 'tea-component-modal';
import './App.css';

function App() {
  let modalRef: RefObject<Modal> = useRef();
  // let modalRef: RefObject<Modal> = useRef();
  let testRef: RefObject<ModalComponentProps> = useRef();

  // let modalRef2: RefObject<Modal> = useRef();
  // let testRef2: RefObject<TestModal> = useRef();
  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={async () => {
            console.log(testRef);
            await modalRef.current.warn({
              title: 'title',
              message: 'message',
              flags: Modal.CLOSE | Modal.OK,
            });
            let flag0 = await modalRef.current.show(
              {
                ref: testRef,
                title: 'modalManagerRef0',
                message: 'Message',
                description: 'desc',
              },
              <button
                onClick={() => {
                  testRef.current.close(Modal.CLOSE);
                }}
              >
                close
              </button>
            );
            if (flag0 & Modal.OK) {
              let successFlag = await modalRef.current.show({
                ref: testRef,
                size: 's',
              });
              console.log('successFlag', successFlag);
            } else if (flag0 & Modal.YES) {
              let confirmFlag = await modalRef.current.confirm({});
              console.log('confirmFlag', confirmFlag);
            } else if (flag0 & Modal.CANCEL) {
              let warnFlag = await modalRef.current.warn({
                title: 'title',
                message: 'message',
                description: 'description',
              });
              console.log('warnFlag', warnFlag);
            } else if (flag0 & Modal.NO) {
              let warnFlag = await modalRef.current.error({
                title: 'title',
                message: 'message',
                description: 'description',
              });
              console.log('warnFlag', warnFlag);
            }
            console.log('====================================');
            console.log('flag0', flag0);
            console.log('====================================');
            let flag1 = await modalRef.current.show({
              title: 'modalManagerRef1',
              flags: Modal.CANCEL | Modal.OK | Modal.CLOSE,
              onClose: async (flag) => {
                if (flag & Modal.CANCEL) {
                  return Modal.PREVENT_DEFAULT;
                }
              },
            });
            console.log('====================================');
            console.log('showModal1 onExited', flag1);
            console.log('====================================');

            let flag2 = await modalRef.current.show({
              icon: 'warning',
              message: 'MESSAGE',
              description: 'description',
            });
            console.log('====================================');
            if (flag2 & Modal.OK) {
              console.log('====================================');
              console.log('showModal2 OK', flag2);
              console.log('====================================');
            }
          }}
        >
          show1
        </button>
      </header>

      <Modal
        ref={modalRef}
        size="s"
        flags={Modal.CANCEL | Modal.OK | Modal.YES | Modal.NO}
      ></Modal>
    </div>
  );
}

export default App;
