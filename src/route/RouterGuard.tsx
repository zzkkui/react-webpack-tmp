import React, { useEffect } from 'react'
import { initLayoutMeta, useCommonReduxFunction } from 'src/store/common'
import { RouteType } from './routeConfig'

type RouteGuardPropsType = {
  routeItem: RouteType
  [x: string]: any
}

export default function RouterGuard(props: RouteGuardPropsType) {
  const { routeItem } = props

  const changeLayoutMate = useCommonReduxFunction('changeLayoutMate')
  const changeMatchPath = useCommonReduxFunction('changeMatchPath')
  const changeCollapsed = useCommonReduxFunction('changeCollapsed')

  useEffect(() => {
    const { collapsed, ...layoutMeta } = routeItem.meta?.layoutMeta || initLayoutMeta
    collapsed !== undefined && changeCollapsed(collapsed)
    changeLayoutMate(layoutMeta)
    changeMatchPath(props.match.path)
  }, [])

  return <>{routeItem.component}</>
}
