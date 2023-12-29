import React from 'react'
import { useParams } from 'react-router'
import CusBreadcrumb from 'src/components/breadCrumb'

function RedisDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <CusBreadcrumb
        breadCrumbs={{
          prev: '/redis',
          paths: [{ name: id, path: '/redis' }, { name: id }],
        }}
      />
      RedisDetail
    </div>
  )
}

export default RedisDetail
