import { useSelector, shallowEqual } from 'react-redux'

import { StoreType } from 'src/store/types'

export function useShallowEqualSelector<T>(selector: (state: StoreType) => T) {
  return useSelector(selector, shallowEqual)
}
