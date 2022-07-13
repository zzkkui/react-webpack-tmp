import React, { FC, useCallback, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { ConfigProvider, Spin } from 'chopperui-react'
import zhCN from 'chopperui-react/lib/locale/zh_CN'
import 'chopperui-react/dist/chopperui-react.css'
import moment from 'moment'
import 'moment/locale/zh-cn'

import store from 'src/store'

// import routes from './route'
import Layout from './layout/basicLayout'
import { bindActionToPromise } from './utils'
import { getPermissionInfo } from './store/actions/user'

moment.locale('zh-cn')

const App: FC = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const fetchPermissionList = useCallback(async () => {
    await bindActionToPromise(dispatch, getPermissionInfo)()
    setLoading(false)
  }, [dispatch])

  useEffect(() => {
    fetchPermissionList()
  }, [fetchPermissionList])

  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        {!loading ? (
          <Layout />
        ) : (
          <Spin
            spinning={loading}
            style={{
              width: '100%',
              height: '564px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* <div style={{ width: '100%', height: '100vh' }}></div> */}
          </Spin>
        )}
      </ConfigProvider>
    </BrowserRouter>
  )
}

const ProviderApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default ProviderApp
