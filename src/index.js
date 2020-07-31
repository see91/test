import '@babel/polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

//打包时，用的HashRouter并加上了basename，因为放在服务器的二级目录下
ReactDOM.render(
  <HashRouter>
    <ConfigProvider locale={zh_CN}>
      <App />
    </ConfigProvider>
  </HashRouter>,
  document.getElementById('root'));
registerServiceWorker();
