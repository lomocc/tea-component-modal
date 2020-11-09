import React from 'react';
import * as ReactDOM from 'react-dom';
import { Show } from '../stories/Modal.stories';

describe('Show', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Show />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
