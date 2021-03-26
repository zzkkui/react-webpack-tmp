import { ActionReturn } from 'src/store/types'
import { Dispatch } from 'react'

export interface ActionPromisePayload<T = undefined> {
  value?: T
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}

export function bindActionToPromise<T = undefined>(
  dispatch: Dispatch<ActionReturn>,
  actionCreator: (payload: ActionPromisePayload<T>) => ActionReturn,
) {
  return (value?: T) => new Promise((resolve, reject) => dispatch(actionCreator({ value, resolve, reject })))
}
