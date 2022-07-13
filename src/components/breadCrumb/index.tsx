import { StoreType } from 'src/store/types'
import { useShallowEqualSelector } from 'src/utils/hooks'
import { Icon, Button } from 'chopperui-react'

import React from 'react'
import { useHistory } from 'react-router'

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

            {i === paths.length - 1 ? null : <Icon type="right" style={{ fontSize: '12px', color: '#3c3c3c' }} />}
          </span>
        )
      })}

      {/* <span className="root-cube">
        <v-button
          type="text"
          @click="handleGoBack">应用</v-button>
        <v-icon
          type="ios-arrow-right"
          color="#3C3C3C"></v-icon>
        <span className="root-txt">详情</span>
      </span> */}
    </div>
  )
}

export default React.memo(CustBreadCrumb)
