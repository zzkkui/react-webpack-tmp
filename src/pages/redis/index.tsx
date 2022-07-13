import React from 'react'
import { Link } from 'react-router-dom'

import styles from './index.less'

function Redis() {
  return (
    <div className={styles.redis}>
      Redis
      <Link to={'/redis/aaa'}>redis-aaa</Link>
      <div className="global">
        global css
        <div className={styles.innerLocal}>global inner local css</div>
      </div>
      <div className={styles.local}>local css</div>
    </div>
  )
}

export default Redis
