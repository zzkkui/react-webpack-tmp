import React, { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Layout } from 'chopperui-react'
import { useShallowEqualSelector } from 'src/utils/hooks'
import { StoreType } from 'src/store/types'
import CollapseBtn from './collapseBtn'
import { useDispatch } from 'react-redux'
import { setCollapsed } from 'src/store/actions/common'

import styles from './style/siderMenu.less'

const { Sider } = Layout

export type MeunType = {
  key: string
  name: string
  icon?: string | React.ReactNode
  children?: Array<MeunType>
}

interface SiderMenuProps {
  menu: Array<MeunType>
  selectedMeun?: any
}

const { SubMenu } = Menu

const SiderMenu: FC<SiderMenuProps> = (props) => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const { collapsed } = useShallowEqualSelector((state: StoreType) => {
    return { collapsed: state.common.collapsed }
  })
  const { menu, selectedMeun } = props
  const menuName = selectedMeun?.path

  const onCollapse = (collapsed: boolean) => {
    dispatch(setCollapsed(collapsed))
  }

  return (
    <Sider width={216} theme="light" trigger={null} collapsed={collapsed} className={styles.sider}>
      <CollapseBtn collapse={collapsed} onChange={onCollapse} />
      <Menu mode="inline" defaultOpenKeys={['database']} selectedKeys={[menuName]}>
        {menu.map((item) => {
          return item.children?.length ? (
            <SubMenu
              key={item.key}
              title={
                <span>
                  {item.icon ? (
                    typeof item.icon === 'string' ? (
                      <span className={`${item.icon} iconfont`}></span>
                    ) : (
                      item.icon
                    )
                  ) : (
                    ''
                  )}
                  <span className={styles.subname}>{item.name}</span>
                </span>
              }
            >
              {item.children.map((child) => {
                return (
                  <Menu.Item key={child.key}>
                    {child.key === menuName && menuName === pathname ? (
                      <span>{child.name}</span>
                    ) : (
                      <Link to={child.key}>{child.name}</Link>
                    )}
                  </Menu.Item>
                )
              })}
            </SubMenu>
          ) : (
            <Menu.Item key={item.key} title={item.name}>
              <Link to={item.key}>
                {item.icon ? (
                  typeof item.icon === 'string' ? (
                    <span className={`${item.icon} iconfont`}></span>
                  ) : (
                    item.icon
                  )
                ) : (
                  ''
                )}
                <span>{item.name}</span>
              </Link>
            </Menu.Item>
          )
        })}
      </Menu>
    </Sider>
  )
}

SiderMenu.displayName = 'SiderMenu'
export default SiderMenu
