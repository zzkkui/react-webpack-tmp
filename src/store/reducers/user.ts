import { ReducersAction } from '.'
import { SET_ZONELIST, SET_PERMISSION_INFO, SET_PROJECTINFO, SET_ZONE_INFO, SET_USER_DATA } from '../constants/user'

export interface Zone {
  id: number
  name: string
  region: string
}

export interface UserState {
  zoneList: Zone[]
  projectInfo: Record<string, unknown>
  permissionInfo: Record<string, string>
  currZone: Zone
}

const defaultState: UserState = {
  zoneList: [],
  projectInfo: {},
  permissionInfo: {},
  currZone: {} as Zone,
}

export const user = (state = defaultState, action: ReducersAction): UserState => {
  switch (action.type) {
    case SET_ZONELIST: {
      return {
        ...state,
        zoneList: action.payload || [],
      }
    }
    case SET_PERMISSION_INFO: {
      return {
        ...state,
        permissionInfo: action.payload,
      }
    }
    case SET_PROJECTINFO: {
      return {
        ...state,
        projectInfo: action.payload,
      }
    }
    case SET_ZONE_INFO: {
      return {
        ...state,
        currZone: action.payload,
      }
    }
    case SET_USER_DATA: {
      return {
        ...state,
        ...action.payload,
      }
    }
    default:
      return state
  }
}
