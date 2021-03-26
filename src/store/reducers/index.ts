import { combineReducers } from 'redux'

import * as common from './common'
import * as user from './user'

export type ReducersAction = {
  type: string
  payload: any
}

export default combineReducers({
  ...common,
  ...user,
})
