import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { setCommonData } from 'src/store/actions/common'

function RedisDetail() {
  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    dispatch(
      setCommonData({
        hideHeader: true,
        collapsed: true,
        breadCrumbs: { prev: '/redis', paths: [{ name: 'Redis', path: '/redis' }, { name: id }] },
      }),
    )
    return () => {
      dispatch(setCommonData({ hideHeader: false, collapsed: false, breadCrumbs: {} }))
    }
  }, [dispatch, id])
  return <div>RedisDetail</div>
}

export default RedisDetail
