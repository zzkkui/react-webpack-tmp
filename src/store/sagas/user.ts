import { put, call, takeLatest } from 'redux-saga/effects'
import { message } from 'antd'
import api from 'src/api/user'
import { FETCH_PERMISSIONINFO_REQUEST, SET_PERMISSION_INFO } from '../constants/user'
import { Action } from 'redux'
import { ActionPromisePayload } from 'src/utils'

const { permissionInfoApi } = api

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

function* watchFetchPermissionInfo() {
  yield takeLatest(FETCH_PERMISSIONINFO_REQUEST, getPermissionInfo)
}

export const userSagas = [watchFetchPermissionInfo()]
