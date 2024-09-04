// Box.js
import React from 'react';
import './App.css';

const Box = ({ value, onClick }) => {
  return (
    <div className='Box' onClick={onClick}>
      {value}
    </div>
  );
};

export default Box;
