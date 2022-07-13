import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import loadable from '@loadable/component'

import { LoadingComponent, RoutesType } from 'src/route'

const NoPermission = loadable(() => import('src/pages/403'), { fallback: <LoadingComponent /> })
const NotFound = loadable(() => import('src/pages/404'), { fallback: <LoadingComponent /> })

export interface AuthProps {
  pathname: string
  routes: RoutesType[]
  permission: Record<string, string>
}

const baseUrl = '/'

function flattenRouteHandle(routes: RoutesType[], permission: Record<string, string>, path?: string) {
  return routes.reduce((prev: RoutesType[], curr) => {
    if (!curr.path || (curr.name && permission[curr.name])) {
      if (curr.path) {
        prev = [...prev, { ...curr, path: path ? `${path}${curr.path}` : curr.path }]
      }
      if (curr.routes) {
        const _path = path ? `${path}${curr.path}` : curr.path
        prev = [...prev, ...flattenRouteHandle(curr.routes, permission, _path)]
      }
    } else if (curr.name && !permission[curr.name] && curr.component) {
      const _path = path ? `${path}${curr.path}` : curr.path
      prev = [...prev, { ...curr, component: NoPermission, path: _path }]
    }
    return prev
  }, [])
}

const Auth = (props: AuthProps) => {
  const { routes, permission } = props
  const flattenRoute = flattenRouteHandle(routes, permission).map((n) => {
    delete n.routes
    return n
  })

  console.log(flattenRoute)

  const defaultRoute = flattenRoute.find((n) => n.isMenu && n.path && n.component !== NoPermission)

  return (
    <Switch>
      <Redirect from={baseUrl} to={defaultRoute?.path || '/'} exact />
      {flattenRoute.map((item: RoutesType) => {
        return (
          <Route
            exact
            path={item.path}
            key={item.path}
            // component={lazyLoad(item.component!)}
            render={() => {
              const Component = item.component
              return <Component />
            }}
          />
        )
      })}
      <Route component={NotFound}></Route>
    </Switch>
  )
}

export default Auth
