import React from 'react'
import { Link } from 'react-router-dom'

import styles from './index.less'

function List() {
  return (
    <div className={styles.list}>
      <Link to={'/list/aaa'}>list-aaa</Link>
      <div className="global">
        global css
        <div className={styles.innerLocal}>global inner local css</div>
      </div>
      <div className={styles.local}>local css</div>
    </div>
  )
}

export default List
