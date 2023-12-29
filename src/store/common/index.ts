import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createReduxFunction } from 'src/hooks/reduxStore'
import { fetchSth } from './actions'

export type BreadCrumbPathType = {
  name: string
  path?: string
}

export type LayoutMateType = {
  hideBreadcrumb?: boolean
  hideHeader?: boolean
  hideMenu?: boolean
}

export type BreadCrumbType = {
  prev: string | { pathname: string; search?: string; state?: Object }
  paths: BreadCrumbPathType[]
  hideBackBtn?: boolean
}

export type CommonSliceState = {
  value: number
  isHideHeader: boolean
  collapsed: boolean
  breadCrumbs: BreadCrumbType
  layoutMate: LayoutMateType
  matchPath: string
  // test
  originData: string[]
}

export const initLayoutMeta = {
  hideBreadcrumb: true,
  hideHeader: false,
  hideMenu: false,
  collapsed: false,
}

const initialState: CommonSliceState = {
  value: 0,
  isHideHeader: false,
  collapsed: false,
  breadCrumbs: {} as BreadCrumbType,
  layoutMate: { ...initLayoutMeta } as LayoutMateType,
  matchPath: '',
  originData: [],
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementCount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
    changeIsHideHeader: (state, action: PayloadAction<boolean>) => {
      state.isHideHeader = action.payload
    },
    changeCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload
    },
    changeBreadCrumbs: (state, action: PayloadAction<BreadCrumbType>) => {
      state.breadCrumbs = action.payload || ({} as BreadCrumbType)
    },
    changeLayoutMate: (state, action: PayloadAction<LayoutMateType>) => {
      // 布局信息每次设置先用默认覆盖
      state.layoutMate = { ...initLayoutMeta, ...action.payload }
    },
    changeMatchPath: (state, action: PayloadAction<string>) => {
      state.matchPath = action.payload
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(fetchSth.fulfilled, (state, action: PayloadAction<string[]>) => {
    //   console.log('fetchSth fulfilled')
    //   state.originData = action.payload
    // })
    builder.addCase(fetchSth.pending, (_state, action) => {
      console.log('fetchSth pending', action.payload)
    })
    // builder.addCase(fetchSth.rejected, (_state, action) => {
    //   console.log('fetchSth rejected', action.payload)
    // })
  },
})

export const useCommonReduxFunction = createReduxFunction(commonSlice)

export const { increment, decrement, incrementCount, changeIsHideHeader } = commonSlice.actions

export default commonSlice
