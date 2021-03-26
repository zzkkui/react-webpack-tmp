import { SET_COLLAPSED, SET_COMMON_DATA, SET_HIDEHEADER } from '../constants/common'
import { ActionFun } from '../types'

export const setHideHeader: ActionFun = (payload) => {
  return {
    type: SET_HIDEHEADER,
    payload,
  }
}

export const setCommonData: ActionFun = (payload) => {
  return {
    type: SET_COMMON_DATA,
    payload,
  }
}

export const setCollapsed: ActionFun = (payload) => {
  return {
    type: SET_COLLAPSED,
    payload,
  }
}
