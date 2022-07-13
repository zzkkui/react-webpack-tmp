import { put, call, takeLatest } from 'redux-saga/effects'
import { message } from 'chopperui-react'
import api from 'src/api/user'
import {
  FETCH_PROJECTINFO_REQUEST,
  FETCH_ZONELIST_REQUEST,
  FETCH_PERMISSIONINFO_REQUEST,
  SET_PERMISSION_INFO,
  SET_PROJECTINFO,
  SET_USER_DATA,
} from '../constants/user'
import { Action } from 'redux'
import { ActionPromisePayload } from 'src/utils'

const { zoneListApi, projectInfoApi, permissionInfoApi } = api

function* fetchZoneList() {
  try {
    const { data, errcode, description_cn: msg } = yield call(zoneListApi)
    if (msg && errcode !== 0) {
      message.error(msg)
    } else {
      yield put({ type: SET_USER_DATA, payload: { currZone: data[0] || {}, zoneList: data || [] } })
    }
  } catch (error) {
    // console.log(error)
  }
}

function* fetchProjectInfo() {
  try {
    const { data, errcode, description_cn: msg } = yield call(projectInfoApi)
    if (msg && errcode !== 0) {
      message.error(msg)
    } else {
      yield put({ type: SET_PROJECTINFO, payload: data || {} })
    }
  } catch (error) {
    // console.log(error)
  }
}

function* getPermissionInfo({ payload: { resolve, reject } }: Action & { payload: ActionPromisePayload }) {
  try {
    const { data, errcode, description_cn: msg } = yield call(permissionInfoApi)
    if (msg && errcode !== 0) {
      message.error(msg)
    }
    yield put({ type: SET_PERMISSION_INFO, payload: data || {} })
    resolve()
  } catch (error) {
    // console.log(error)
    reject()
  }
}

function* watchFetchZoneList() {
  yield takeLatest(FETCH_ZONELIST_REQUEST, fetchZoneList)
}

function* watchFetchProjectInfo() {
  yield takeLatest(FETCH_PROJECTINFO_REQUEST, fetchProjectInfo)
}

function* watchFetchPermissionInfo() {
  yield takeLatest(FETCH_PERMISSIONINFO_REQUEST, getPermissionInfo)
}

export const userSagas = [watchFetchZoneList(), watchFetchProjectInfo(), watchFetchPermissionInfo()]
