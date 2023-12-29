import React from 'react'
import {
  Route,
  Switch,
  Redirect,
  HashRouter as Router,
  //  useRouteMatch, useLocation
} from 'react-router-dom'
import EmptyLayout from 'src/layout/emptyLayout'
import MainLayout from 'src/layout/mainLayout'
import RouterGuard from 'src/route/RouterGuard'
import routeObj, { RouteType, withSuspense } from 'src/route/routeConfig'
import { handleRoutes } from './utils'

const baseUrl = '/'
const NotFound = React.lazy(() => import('src/pages/system/NotFound'))
const NotAuth = React.lazy(() => import('src/pages/system/NoAuth'))

export const routesInfo = handleRoutes(routeObj)

function getRoutes(route: RouteType) {
  const CusLayout = route.layout!
  const sourceMenuObj = routeObj.find((n) => n.menuName === route.menuName)?.routes
  return (
    <CusLayout sourceMenuObj={sourceMenuObj}>
      <Switch>
        {route.routes?.map((m) => {
          return (
            <Route
              exact
              path={m.path}
              key={m.path}
              render={(props) => {
                return <RouterGuard routeItem={m} {...props} />
              }}
            />
          )
        })}
        {/* {route.notFoundPath ? (
          <Route
            exact
            path={route.notFoundPath}
            render={() => <EmptyLayout>{withSuspense(NotFound)}</EmptyLayout>}
          ></Route>
        ) : null} */}
        <Redirect to="/no-found" />
      </Switch>
    </CusLayout>
  )
}

export default function Routes() {
  const { routes, layoutMap } = routesInfo
  const isLayoutMode = !!layoutMap

  return (
    <Router>
      {isLayoutMode ? (
        <Switch>
          <Redirect exact from={baseUrl} to="/overview" />
          <Route exact path="/no-auth" render={() => <EmptyLayout>{withSuspense(NotAuth)}</EmptyLayout>}></Route>
          <Route exact path="/no-found" render={() => <EmptyLayout>{withSuspense(NotFound)}</EmptyLayout>}></Route>

          {routes.map((n) => {
            return n.path ? (
              <Route exact path={n.path} key={n.path}>
                {getRoutes(n)}
              </Route>
            ) : (
              // 没有指定path，或者path 为 '/'，根节点要放在最后
              <Route key={n.name}>{getRoutes(n)}</Route>
            )
          })}
        </Switch>
      ) : (
        <MainLayout>
          <Switch>
            <Redirect exact from={baseUrl} to="/overview" />
            {routes.map((item: RouteType) => {
              return (
                <Route
                  exact
                  path={item.path}
                  key={item.path}
                  render={(props) => {
                    return <RouterGuard routeItem={item} {...props} />
                  }}
                />
              )
            })}
            <Route exact path="/no-auth" render={() => withSuspense(NotAuth)}></Route>
            <Route render={() => withSuspense(NotFound)}></Route>
          </Switch>
        </MainLayout>
      )}
    </Router>
  )
}
