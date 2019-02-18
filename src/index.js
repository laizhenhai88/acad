import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import App from './App'
import Acad from './Acad'

(function() {
  // 判断浏览器类型
  // iPhone Mobile内核
  if (navigator.userAgent.indexOf('iPhone') != -1 && navigator.userAgent.indexOf('Mobile') != -1) {
    // 其它的，暂时认定是safari
    if (navigator.userAgent.indexOf('Safari') != -1) {
      ReactDOM.render(<Acad/>, document.getElementById('root'));
      registerServiceWorker();
      return
    }
  }
  // PC类型
  ReactDOM.render(<App/>, document.getElementById('root'));
  registerServiceWorker();

})()
