import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
let enhancer
if (process.env.NODE_ENV === 'production') {
  enhancer = compose(applyMiddleware(sagaMiddleware))
} else {
  const logger = createLogger()
  // redux中间件 是作用于dispatch
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

  enhancer = composeEnhancers(applyMiddleware(logger, sagaMiddleware))
}

const store = createStore(reducer, enhancer)
sagaMiddleware.run(rootSaga)

export default store
