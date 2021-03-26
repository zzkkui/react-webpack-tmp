import { FETCH_PERMISSIONINFO_REQUEST } from '../constants/user'
import { ActionFun } from '../types'

export const getPermissionInfo: ActionFun = (payload) => {
  return { type: FETCH_PERMISSIONINFO_REQUEST, payload }
}
