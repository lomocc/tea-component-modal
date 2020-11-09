import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import { Modal } from '../dist';

const App = () => {
  const modalRef = React.useRef<Modal>(null);
  return (
    <div>
      <button
        onClick={() => {
          modalRef.current?.success({
            message: 'Message',
          });
        }}
      >
        show
      </button>
      <Modal ref={modalRef} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
