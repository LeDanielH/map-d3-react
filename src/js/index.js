process.env.NODE_ENV === 'production' ? module.exports = require('./prod.js') : module.exports = require('./dev.js');
import React from 'react'
import ReactDOM from 'react-dom';
import Map from './components/Map';

document.addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Map />, document.getElementById("map"))
});