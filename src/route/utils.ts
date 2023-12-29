import MainLayout from 'src/layout/mainLayout'
import { RouteType } from './routeConfig'

export function handleDefaultRoute(
  routes: RouteType[],
  opts?: { path?: string; layout?: (props: any) => JSX.Element; menuName?: string },
): RouteType[] {
  const { path, layout, menuName } = opts || {}
  return routes.reduce((prev: RouteType[], curr: RouteType) => {
    let currs: RouteType[] = []
    let currRouter
    if (curr.routes) {
      currs = handleDefaultRoute(curr.routes, { path: curr.path, layout, menuName })
    }
    if (curr.path && curr.component) {
      currRouter = { ...curr, path: curr.path ? (path ? `${path}${curr.path}` : curr.path) : '', layout, menuName }
      currRouter.routes = undefined
    }
    currRouter && currs.unshift(currRouter)
    return [...prev, ...currs]
  }, [])
}

export function handleLayoutRoute(routes: RouteType[]): RouteType[] {
  return routes.map((n) => {
    if (n.layout) {
      return n.routes ? { ...n, routes: handleDefaultRoute(n.routes, { layout: n.layout, menuName: n.menuName }) } : n
    } else {
      // 给 默认布局
      return n.routes
        ? {
            ...n,
            layout: MainLayout,
            routes: handleDefaultRoute(n.routes, { layout: MainLayout, menuName: n.menuName }),
          }
        : { ...n, layout: MainLayout }
    }
  })
}

export function handleRoutes(routes: RouteType[]) {
  // 布局模式
  if (routes.find((n) => n.layout)) {
    // 布局模式中需要将根路由节点放在最后
    routes = routes.sort((a, b) => {
      if (!a.path) {
        return 1
      }
      if (!b.path) {
        return -1
      }
      return 0
    })
    const _routes = handleLayoutRoute(routes)
    const layoutMap = {} as Record<string, string[]>
    _routes.forEach((n) => {
      layoutMap[n.name] = n.routes?.map((n) => n.path!) || []
    })
    return { routes: _routes, layoutMap }
  } else {
    // 默认模式
    return { routes: handleDefaultRoute(routes) }
  }
}
