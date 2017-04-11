import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/dist/blueprint.css';
import './graphiql.css';
import './App.css';
import 'react-dates/lib/css/_datepicker.css';
import 'whatwg-fetch';
import R from 'ramda';
window.R = R;

ReactDOM.render(<App />, document.getElementById('root'));
