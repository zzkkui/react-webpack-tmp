import { CommonState } from './reducers/common'
// import { RedisState } from './reducers/redis'
import { UserState } from './reducers/user'

export interface ActionReturn {
  type: string
  payload?: any
}

export interface ActionFun {
  (payload?: any): ActionReturn
}

export interface StoreType {
  user: UserState
  common: CommonState
  // redis: RedisState
}
