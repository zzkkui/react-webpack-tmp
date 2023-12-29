import { configureStore } from '@reduxjs/toolkit'
// import logger from 'redux-logger'
import api from './query'

import { rootReducer } from './reducers'

const isDev = process.env.NODE_ENV === 'development'

export function configureAppState(preloadedState = {}) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      // return isDev ? getDefaultMiddleware().concat(logger) : getDefaultMiddleware()
      return getDefaultMiddleware({
        thunk: { extraArgument: { testArg: 'hahaha' } },
      }).concat(...[api.middleware])
    },
    preloadedState,
  })

  if (isDev && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}

const store = configureAppState()

// if (isDev && module.hot) {
//   module.hot.accept('./reducers', () => {
//     const newRootReducer = require('./reducers').rootReducer
//     store.replaceReducer(newRootReducer)
//   })
// }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
