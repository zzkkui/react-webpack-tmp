import { createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'
import commonApi from 'src/api/common'

/**
 * @param {string} typeString 常量name，一般 [slice name]/[action name]
 * @param {T | Promise<T>} fn
 */
export const fetchSth = createAsyncThunk(
  'common/fetchSomeList',
  async (arg: any, thunkApi) => {
    console.log('createAsyncThunk arg ====>', arg)
    console.log('createAsyncThunk thunkApi ====>', thunkApi)
    // console.log('thunkApi.signal', thunkApi.signal)
    // axios v0.2.* 版本取消请求后的状态
    // const source = axios.CancelToken.source()
    // thunkApi.signal.addEventListener('abort', () => {
    //   source.cancel()
    // })
    try {
      // 给 axios 加上 signal（axios v0.22.0） 属性，在 thunk 被 abort 时，会取消请求
      const res = await commonApi.getMockList({ test: '123' }, { signal: thunkApi.signal })
      // axios v0.2.* 版本取消请求后的状态
      // const res = await commonApi.getMockList({ test: '123' }, { cancelToken: source.token })
      console.log('res data ======>', res.data)
      return res.data
    } catch (err) {
      console.log('action catch ====>', err)
      // 也可以在这里根据 aborted 状态判断是否是被取消
      // console.log('signal.aborted ====>', thunkApi.signal.aborted)
      return thunkApi.rejectWithValue('123')
    }
  },
  {
    // 是否在运行前取消 promise
    condition: (arg, other) => {
      console.log('condition arg ===>', arg)
      console.log('condition other ===>', other)
      return true
    },
    // 运行前取消 （condition 返回 false）,也会触发 rejected
    dispatchConditionRejection: true,
  },
)
