import { connect as connectComponent, MapStateToPropsParam, MapDispatchToPropsParam } from 'react-redux'
import { withRouter as withRouterComponent, RouteComponentProps } from 'react-router-dom'
import { ComponentType } from 'react'

export function connect(
  mapStateToProps?: MapStateToPropsParam<any, any, any>,
  mapDispatchToProps?: MapDispatchToPropsParam<any, any>,
  mergeProps?: any,
  options?: any,
): any {
  return (target: any) => connectComponent(mapStateToProps, mapDispatchToProps, mergeProps, options)(target) as any
}

export function withRouter<P extends RouteComponentProps<any>, C extends ComponentType<P>>(
  target: C & React.ComponentType<P>,
): any {
  return withRouterComponent(target)
}
