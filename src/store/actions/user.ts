import {
  FETCH_PROJECTINFO_REQUEST,
  FETCH_ZONELIST_REQUEST,
  SET_ZONE_INFO,
  FETCH_PERMISSIONINFO_REQUEST,
} from '../constants/user'
import { Zone } from '../reducers/user'
import { ActionFun } from '../types'

export const zoneListAction: ActionFun = () => {
  return {
    type: FETCH_ZONELIST_REQUEST,
  }
}

export const projectInfoAction: ActionFun = () => {
  return {
    type: FETCH_PROJECTINFO_REQUEST,
  }
}

export const setZoneAction: ActionFun = (payload) => {
  return {
    type: SET_ZONE_INFO,
    payload,
  }
}

export const getPermissionInfo: ActionFun = (payload) => {
  return { type: FETCH_PERMISSIONINFO_REQUEST, payload }
}

export type UserAction = { type: string; payload: number | Zone[] | Record<string, unknown> }
