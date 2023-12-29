import React, { useEffect } from 'react'
// import { Button } from 'antd'
import {
  // useAppDispatch,
  useAppSelector,
} from 'src/hooks/reduxStore'
// import { decrement, increment } from 'src/store/common'
// import { fetchSth } from 'src/store/common/actions'
import commonApi from 'src/api/common'
// import { useGetMockListQuery } from 'src/store/query'

function Overview() {
  const {
    originData,
    // value
  } = useAppSelector((store) => {
    return { originData: store.common.originData, value: store.common.value }
  })

  // const dispatch = useAppDispatch()

  // useEffect(() => {
  //   // const controller = new AbortController()

  //   // dispatch(fetchSth({ a: 111 }))
  //   const promise = dispatch(fetchSth({ a: 111 }))
  //   // .unwrap()
  //   // .then(unwrapResult)
  //   // .then((data) => {
  //   //   console.log('Overview fetchSth', data)
  //   // })
  //   // .catch((err) => {
  //   //   console.log('Overview fetchSth catch', err)
  //   // })
  //   return () => {
  //     console.log('Overview destroy')
  //     // 只是这里取消，thunk 直接rejected，但是请求还是会发送并返回，只是不处理返回，
  //     promise.abort()
  //   }
  // }, [])

  useEffect(() => {
    const controller = new AbortController()
    commonApi
      .getMockList({ test: '123' }, { signal: controller.signal })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })
    return () => {
      console.log('Overview destroy =====> test AbortController')
      // 只是这里取消，thunk 直接rejected，但是请求还是会发送并返回，只是不处理返回，
      controller.abort()
    }
  }, [])

  // const { data, isLoading, isFetching } = useGetMockListQuery(String(value))
  // console.log('rtk query data====>', data)
  // // console.log('rtk query error====>', error)
  // // 只有组件加载后第一次获取数据才会是 true，除非有缓存
  // console.log('rtk query isLoading====>', isLoading)
  // // 组件每次获取数据都会是true，除非有缓存
  // console.log('rtk query isFetching====>', isFetching)

  // useEffect(() => {
  //   console.log('originData ====>', originData)
  // }, [originData])

  return (
    <div>
      Overview
      <div>
        {originData?.map((n: string, i: number) => (
          <div key={i}>{n}</div>
        ))}
      </div>
      {/* <div>{value}</div>
      <Button onClick={() => dispatch(increment())}>plus</Button>
      <Button onClick={() => dispatch(decrement())}>minus</Button> */}
      {/* <div>
        {isLoading && <div>isLoading</div>}
        {isFetching && <div>isFetching</div>}

        {!isLoading && !isLoading && data?.map((n: string, i: number) => <div key={i}>{n}</div>)}
      </div> */}
    </div>
  )
}

export default Overview
