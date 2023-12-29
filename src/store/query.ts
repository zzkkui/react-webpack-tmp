// import { AxiosConfig } from 'src/utils/axios'
import {
  createApi,
  //  fetchBaseQuery
} from '@reduxjs/toolkit/query/react'
// import { DataType } from 'src/utils/axios'
// import axios, { isAxiosError } from 'axios'

import commonApi from 'src/api/common'

const api = createApi({
  reducerPath: 'api',
  // baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  baseQuery: (arg) => {
    console.log('baseQuery', arg)
    return arg
  },
  endpoints: (builder) => ({
    getMockList: builder.query<string[], string>({
      query: (str) => commonApi.getMockList({ test: str }),
      // queryFn: async (str) => {
      //   const res = (await commonApi.getMockList({ test: str })) as any
      //   return { data: res.data }
      // },
      // query: () => `mock/list`,
      // transformResponse: (response: DataType) => {
      //   return response.data
      // },
    }),
  }),
})

export const { useGetMockListQuery } = api

export default api
