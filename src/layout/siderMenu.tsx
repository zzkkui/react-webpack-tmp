import React, { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import { CusRouteMeta } from 'src/route/routeConfig'
import { useCommonReduxFunction } from 'src/store/common'
import { useAppSelector } from 'src/hooks/reduxStore'
import { getOpenMenu, MenuType } from 'src/utils/menus'
import CollapseBtn from './collapseBtn'
import styles from './style/siderMenu.less'

const { Sider } = Layout

export interface SelectedMenuType extends MenuType {
  parentInfo?: {
    name?: string
  }
}

interface SiderMenuProps {
  menus: MenuType[]
  selectedMenu?: SelectedMenuType
}

const { SubMenu } = Menu

function MenuIcon(props: { icon: React.ReactNode }) {
  const { icon } = props
  return typeof icon === 'string' ? (
    <span className={` ${styles.icon}`}>
      <span className={`${icon} iconfont `}></span>
    </span>
  ) : (
    <span className={`${styles.icon}`}>{icon}</span>
  )
}

// let init = false

const SiderMenu: FC<SiderMenuProps> = (props) => {
  const {
    collapsed = false,
    hideMenu,
    matchPath,
  } = useAppSelector((state) => ({
    hideMenu: state.common.layoutMate.hideMenu,
    matchPath: state.common.matchPath,
    collapsed: state.common.collapsed,
  }))

  const { selectedMenu, menus } = props

  const changeCollapsed = useCommonReduxFunction('changeCollapsed')

  const [openKeys, setOpenKeys] = useState<string[]>([])

  const menuName = selectedMenu?.name

  const onCollapse = (collapsed: boolean) => {
    // 这里加上是优化动画延迟引起的bug
    if (collapsed) {
      setOpenKeys([])
    }
    changeCollapsed(collapsed)
  }

  const onOpenChange = (openKeys: string[]) => {
    setOpenKeys(openKeys)
  }

  useEffect(() => {
    // 可能不是 onCollapse 事件触发 collapsed 变更
    if (collapsed) {
      setOpenKeys([])
    } else if (selectedMenu?.name) {
      setOpenKeys((prev) =>
        selectedMenu?.name ? Array.from(new Set([...prev, getOpenMenu(menus, selectedMenu).name])) : [...prev],
      )
    }
  }, [collapsed, selectedMenu?.name])

  return (
    <Sider width={216} collapsedWidth={60} theme="light" trigger={null} collapsed={collapsed} className={styles.sider}>
      <div className={styles.menuWrapper}>
        <Menu
          mode="inline"
          //  defaultOpenKeys={['database']}
          selectedKeys={menuName ? [menuName] : []}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          {menus.map((item) => {
            const { meta = {} as CusRouteMeta, children, name, path } = item
            const { isMenu = false, icon } = meta
            if (!isMenu || hideMenu) {
              return null
            }
            return children?.length ? (
              <SubMenu
                key={name}
                title={
                  <span>
                    <MenuIcon icon={icon} />
                    <span className={styles.subname}>{name}</span>
                  </span>
                }
              >
                {children.map((child) => {
                  const { name, path } = child
                  if (hideMenu) {
                    return null
                  }
                  return (
                    <Menu.Item key={name}>
                      {path === matchPath ? <span>{name}</span> : <Link to={path}>{name}</Link>}
                    </Menu.Item>
                  )
                })}
              </SubMenu>
            ) : (
              <Menu.Item key={name} title={name}>
                {path === matchPath ? (
                  <span>
                    <MenuIcon icon={icon} />
                    <span className={styles.menuname}>{name}</span>
                  </span>
                ) : (
                  <Link to={path}>
                    <MenuIcon icon={icon} />
                    <span className={styles.menuname}>{name}</span>
                  </Link>
                )}
              </Menu.Item>
            )
          })}
        </Menu>
      </div>

      <CollapseBtn collapse={collapsed} onChange={onCollapse} />
    </Sider>
  )
}

export default SiderMenu
