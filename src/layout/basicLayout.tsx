import React from 'react'
import { Inspector } from 'react-dev-inspector'
import { useLocation } from 'react-router'
import { Layout } from 'chopperui-react'

import SiderMenu, { MeunType } from './siderMenu'
import RightHeader from './rightHeader'
import Authorized from 'src/components/authorized'
import routes, { RoutesType } from 'src/route'
import { useShallowEqualSelector } from 'src/utils/hooks'
import { StoreType } from 'src/store/types'

import styles from './style/layout.less'

const { Content } = Layout

const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : React.Fragment

function filterMeun(meun: MeunType[]) {
  return meun
    .map((n) => {
      if (!n.key.startsWith('/') && !n.children?.length) {
        return false
      }
      return n
    })
    .filter((n) => n)
}

function getMeun(
  routes: RoutesType[],
  permission: Record<string, string>,
  pathname: string,
  path?: string,
): [MeunType[], RoutesType] {
  let menu: MeunType[] = []
  let selectedMeun: RoutesType = {}
  menu = routes.reduce((prev: MeunType[], curr) => {
    // debugger
    const _path = path ? `${path}${curr.path}` : curr.path
    if (curr.name && permission[curr.name]) {
      if (pathname === '/') {
        if (_path) {
          selectedMeun = curr
        }
      } else {
        if (_path === pathname || (_path?.split(':')[0] && pathname.startsWith(_path?.split(':')[0]))) {
          if (curr.isMenu) {
            selectedMeun = curr
          } else {
            selectedMeun = prev[prev.length - 1] || { path }
          }
        }
      }
    }

    if (curr.isMenu && (!_path || (curr.name && permission[curr.name]))) {
      prev = [
        ...prev,
        {
          key: _path || curr.name!,
          name: curr.title || curr.name!,
          icon: curr.icon,
        },
      ]
      if (curr.routes) {
        const [_routes, _selectedMeun] = getMeun(curr.routes, permission, pathname, _path)
        if (_routes.length) {
          prev[prev.length - 1].children = _routes
        }
        if (_selectedMeun.isMenu) {
          selectedMeun = _selectedMeun
        } else if (_selectedMeun.path && _selectedMeun.path === curr.path) {
          selectedMeun = curr
        }
      }
    }
    return prev
  }, [])
  return [menu, selectedMeun]
}

function BasicLayout() {
  const { permissionInfo } = useShallowEqualSelector((state: StoreType) => {
    return { permissionInfo: state.user.permissionInfo }
  })

  const location = useLocation()

  const [menu, selectedMeun] = getMeun(routes, permissionInfo, location.pathname)

  const filterMenu = filterMeun(menu) as MeunType[]

  const curTitle = selectedMeun.title || selectedMeun.name

  return (
    <InspectorWrapper>
      <Layout style={{ width: '100vw', height: '100vh' }}>
        <SiderMenu menu={filterMenu} selectedMeun={selectedMeun} />
        <Layout className={styles.siteLayout}>
          <RightHeader title={curTitle} />
          <Content>
            <Authorized routes={routes} permission={permissionInfo} pathname={location.pathname} />
          </Content>
        </Layout>
      </Layout>
    </InspectorWrapper>
  )
}

export default BasicLayout
