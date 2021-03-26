import React, { FC } from 'react'
import styles from './index.less'
import { Layout } from 'antd'
import { useShallowEqualSelector } from 'src/utils/hooks'
import { StoreType } from 'src/store/types'
import CustBreadCrumb from 'src/components/breadCrumb'

const { Header } = Layout

interface RightHeaderProps {
  title?: string
}
const RightHeader: FC<RightHeaderProps> = (props: RightHeaderProps) => {
  const { hideHeader, breadCrumbs } = useShallowEqualSelector((state: StoreType) => {
    return { hideHeader: state.common.hideHeader, breadCrumbs: state.common.breadCrumbs }
  })
  const { title } = props

  return (
    <Header style={{ display: hideHeader && !breadCrumbs.paths ? 'none' : 'block' }}>
      <div className={styles.headerBox}>
        {!hideHeader ? (
          <>
            <span className={styles.titleIcon} />
            <span className={styles.title}>{title}</span>
          </>
        ) : breadCrumbs.paths ? (
          <CustBreadCrumb />
        ) : null}
      </div>
    </Header>
  )
}

RightHeader.displayName = 'RightHeader'
export default React.memo(RightHeader)
