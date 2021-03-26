import React from 'react'
import { Spin } from 'antd'
import loadable from '@loadable/component'
import { AppstoreOutlined } from '@ant-design/icons'

export type RoutesType = {
  name?: string
  path?: string
  title?: string
  icon?: string | React.ReactNode
  isMenu?: boolean
  component?: any
  hideHeader?: boolean
  routes?: RoutesType[]
}

// 通用的懒加载 loading 组件
export const LoadingComponent = () => {
  return (
    <Spin
      spinning={true}
      style={{ width: '100%', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    ></Spin>
  )
}

const routes: RoutesType[] = [
  {
    path: '/overview',
    name: 'overview',
    title: '总览',
    isMenu: true,
    icon: <AppstoreOutlined />,
    component: loadable(() => import('src/pages/overview'), { fallback: <LoadingComponent /> }),
  },
  {
    name: 'table',
    title: 'table',
    isMenu: true,
    icon: 'icon-database-cache',
    routes: [
      {
        path: '/list',
        name: 'list',
        title: 'List',
        isMenu: true,
        component: loadable(() => import('src/pages/list'), { fallback: <LoadingComponent /> }),
        routes: [
          {
            path: '/:id',
            name: 'listDetail',
            hideHeader: true,
            component: loadable(() => import('src/pages/list/detail'), { fallback: <LoadingComponent /> }),
          },
        ],
      },
    ],
  },
]

export default routes
