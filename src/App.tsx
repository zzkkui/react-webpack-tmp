import React from 'react'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import store from 'src/store'

import './styles/index.less'
import './global.less'
import Routes from './route'

dayjs.locale('zh-cn')

const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Routes />
      </ConfigProvider>
    </Provider>
  )
}

export default App
