import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { useCommonReduxFunction } from 'src/store/common'

import styles from './index.less'

function Redis() {
  const changeBreadCrumbs = useCommonReduxFunction('changeBreadCrumbs')

  const handleLinkRedisDetail = () => {
    changeBreadCrumbs({
      prev: '/redis',
      paths: [
        {
          name: 'Detail',
        },
      ],
    })
    return '/redis/aaa'
  }

  return (
    <div className={styles.redis}>
      Redis
      <Link to={handleLinkRedisDetail}>redis-aaa</Link>
      <Button type="primary">按钮</Button>
      <div className="global">
        global css
        <div className={styles.innerLocal}>global inner local css</div>
      </div>
      <div className={styles.local}>local css</div>
    </div>
  )
}

export default Redis
