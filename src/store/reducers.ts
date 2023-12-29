import { combineReducers } from '@reduxjs/toolkit'
import commonSlice from './common'
import query from './query'

export const rootReducer = combineReducers({
  [commonSlice.name]: commonSlice.reducer,
  [query.reducerPath]: query.reducer,
})
