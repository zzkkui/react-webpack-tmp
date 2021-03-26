import { ReducersAction } from '.'
import { SET_PERMISSION_INFO } from '../constants/user'

export interface UserState {
  permissionInfo: Record<string, string>
}

const defaultState: UserState = {
  permissionInfo: {},
}

export const user = (state = defaultState, action: ReducersAction): UserState => {
  switch (action.type) {
    case SET_PERMISSION_INFO: {
      return {
        ...state,
        permissionInfo: action.payload,
      }
    }
    default:
      return state
  }
}
