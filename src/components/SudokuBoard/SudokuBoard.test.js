import React from 'react';
import ReactDOM from 'react-dom';
import SudokuBoard from './SudokuBoard';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SudokuBoard />, div);
  ReactDOM.unmountComponentAtNode(div);
});