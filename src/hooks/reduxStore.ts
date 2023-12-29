import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { Slice } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'

type GetArrFirst<T> = T extends [infer Res] ? Res : unknown

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const createReduxFunction = <S extends Slice>(slice: S) => {
  return <T extends keyof S['actions']>(name: T) => {
    const dispatch = useAppDispatch()
    const actionCreator = (slice.actions as S['actions'])[name]
    return (payload?: GetArrFirst<Parameters<typeof actionCreator>>) => {
      dispatch(actionCreator(payload))
    }
  }
}
