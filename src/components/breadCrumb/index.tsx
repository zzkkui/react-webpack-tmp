import React from 'react'
import { useHistory } from 'react-router'
import { Button } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { StoreType } from 'src/store/types'
import { useShallowEqualSelector } from 'src/utils/hooks'

import styles from './index.less'

function CustBreadCrumb() {
  const { breadCrumbs } = useShallowEqualSelector((state: StoreType) => {
    return { breadCrumbs: state.common.breadCrumbs }
  })
  const history = useHistory()
  const { paths, prev } = breadCrumbs

  const handleGoBack = () => {
    history.push(prev!)
  }

  const handleGo = (path?: string) => {
    if (path) {
      history.push(path)
    }
  }

  // console.log(breadCrumbs)
  return (
    <div className={styles.breadCrumb}>
      {prev ? (
        <>
          <span className={styles.goBack}>
            <Button type="link" onClick={handleGoBack}>
              返回上一级
            </Button>
          </span>
          <span className={styles.btnLine}></span>
        </>
      ) : null}
      {paths?.map((n, i) => {
        return (
          <span className={styles.path} key={n.name}>
            {n.path ? (
              <Button type="link" onClick={() => handleGo(n.path)}>
                {n.name}
              </Button>
            ) : (
              <span className={styles.name}>{n.name}</span>
            )}

            {i === paths.length - 1 ? null : <RightOutlined className={styles.rightArrow} />}
          </span>
        )
      })}
    </div>
  )
}

export default React.memo(CustBreadCrumb)
