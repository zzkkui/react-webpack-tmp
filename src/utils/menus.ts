import { SelectedMenuType } from 'src/layout/siderMenu'
import { CusRouteMeta, RouteType } from 'src/route/routeConfig'

export type MenuType = {
  path: string
  name: string
  meta?: CusRouteMeta
  children?: MenuType[]
}

function filterMenu(menu: MenuType[]) {
  return menu
    .map((n) => {
      if (!n.path.startsWith('/') && !n.children?.length) {
        return false
      }
      return n
    })
    .filter(Boolean) as MenuType[]
}

export function getMenu(routeObj: RouteType[]) {
  function generateMenus(routes: RouteType[], parentMenu?: MenuType): MenuType[] {
    return routes.map((n) => {
      const { path: parentPath } = parentMenu || {}
      const _path = n.path ? (parentPath ? `${parentPath}${n.path}` : `${n.path}`) : ''
      const menuBase = {
        path: _path,
        name: n.name,
        meta: n.meta,
      }
      const menu = {
        ...menuBase,
        children: n.routes ? generateMenus(n.routes, menuBase) : undefined,
      }
      return menu
    })
  }

  return filterMenu(generateMenus(routeObj))
}

export function getSelectedMenu(menus: MenuType[], matchPath: string) {
  function getSelected(menus: MenuType[], matchPath: string, parentMenu?: MenuType): SelectedMenuType | undefined {
    let selectedMenu
    for (let i = 0; i < menus.length; i++) {
      const item = menus[i]
      if (matchPath === item.path) {
        if (item.meta?.isMenu) {
          selectedMenu = { ...item }
        } else {
          // 当前不是菜单，选中父菜单
          selectedMenu = parentMenu
            ? {
                path: parentMenu.path,
                name: parentMenu.name,
                meta: parentMenu.meta,
              }
            : undefined
        }
        return selectedMenu
      }
      if (item.children) {
        selectedMenu = getSelected(item.children, matchPath, item)
        if (selectedMenu) {
          return selectedMenu
        }
      }
    }
  }
  return getSelected(menus, matchPath)
}

export const getOpenMenu = (menu: MenuType[], selectedMenu: SelectedMenuType) => {
  const { name } = selectedMenu
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children) {
      if (menu[i].children?.find((n) => n.name === name)) {
        return menu[i]
      }
    }
  }
  return {} as MenuType
}
