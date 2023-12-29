import React, { useMemo, useRef } from 'react'
import { Layout } from 'antd'
import { getMenu, getSelectedMenu, MenuType } from 'src/utils/menus'
import routeObj, { RouteType } from 'src/route/routeConfig'
import { useAppSelector } from 'src/hooks/reduxStore'
import SiderMenu from './siderMenu'
import RightHeader from './rightHeader'
import styles from './style/layout.less'

const { Content } = Layout

// const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : React.Fragment

type MainLayoutPropsType = {
  sourceMenuObj?: RouteType[]
  children: React.ReactElement
}

function MainLayout(props: MainLayoutPropsType) {
  const { matchPath } = useAppSelector((state) => {
    return {
      matchPath: state.common.matchPath,
    }
  })
  const { sourceMenuObj } = props

  const menusRef = useRef<MenuType[]>()
  if (!menusRef.current) {
    menusRef.current = getMenu(sourceMenuObj || routeObj)
  }

  const selectedMenu = useMemo(() => {
    return menusRef.current && matchPath ? getSelectedMenu(menusRef.current, matchPath) : undefined
  }, [matchPath])

  return (
    <Layout className={styles.main}>
      <SiderMenu menus={menusRef.current} selectedMenu={selectedMenu} />
      <Layout className={styles.siteLayout}>
        <RightHeader info={selectedMenu?.meta} />
        <Content>{props.children}</Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
