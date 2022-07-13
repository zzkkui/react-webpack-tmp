import React from 'react'
import { Icon, Spin } from 'chopperui-react'
import loadable from '@loadable/component'

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
    icon: <Icon type="appstore" />,
    component: loadable(() => import('src/pages/overview'), { fallback: <LoadingComponent /> }),
  },
  {
    name: 'database',
    title: '数据库',
    isMenu: true,
    icon: 'icon-database-cache',
    routes: [
      {
        path: '/redis',
        name: 'redis',
        title: 'Redis',
        isMenu: true,
        component: loadable(() => import('src/pages/redis'), { fallback: <LoadingComponent /> }),
        routes: [
          {
            path: '/:id',
            name: 'RedisDetail',
            hideHeader: true,
            component: loadable(() => import('src/pages/redis/detail'), { fallback: <LoadingComponent /> }),
          },
        ],
      },
    ],
  },
]

export default routes
