import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import './date.css';
import 'whatwg-fetch';
import R from 'ramda';
window.R = R;

ReactDOM.render(<App />, document.getElementById('root'));
