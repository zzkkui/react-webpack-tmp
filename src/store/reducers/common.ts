import { ReducersAction } from '.'
import { SET_HIDEHEADER, SET_COMMON_DATA, SET_COLLAPSED } from '../constants/common'

export type BreadCrumbType = {
  prev?: string
  paths?: { name: string; path?: string }[]
}

export interface CommonState {
  error: any
  hideHeader: boolean
  collapsed: boolean
  breadCrumbs: BreadCrumbType
}

const defaultState: CommonState = {
  error: null,
  hideHeader: false,
  collapsed: false,
  breadCrumbs: {} as BreadCrumbType,
}

export const common = (state = defaultState, action: ReducersAction): CommonState => {
  switch (action.type) {
    case SET_HIDEHEADER:
      return {
        ...state,
        hideHeader: action.payload,
      }
    case SET_COLLAPSED:
      return {
        ...state,
        collapsed: action.payload,
      }
    case SET_COMMON_DATA:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}
