import { all } from 'redux-saga/effects'

import { userSagas } from './user'

export default function* rootSage() {
  yield all([...userSagas])
}
