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
        breadCrumbs: { prev: '/list', paths: [{ name: 'table', path: '/list' }, { name: id }] },
      }),
    )
    return () => {
      dispatch(setCommonData({ hideHeader: false, collapsed: false, breadCrumbs: {} }))
    }
  }, [dispatch, id])
  return <div>Detail</div>
}

export default RedisDetail
