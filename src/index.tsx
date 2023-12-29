// 兼容 ie 11
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import ReactDOM from 'react-dom'
import { ClickToComponent } from 'click-to-react-component'
import 'normalize.css/normalize.css'
import App from './App'

ReactDOM.render(
  <>
    <ClickToComponent editor="vscode-insiders" />
    <App />
  </>,
  document.getElementById('root'),
)
