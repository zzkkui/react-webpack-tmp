import React from 'react'
import { Layout } from 'antd'
import CusBreadCrumb from 'src/components/breadCrumb'
import { CusRouteMeta } from 'src/route/routeConfig'
import { useAppSelector } from 'src/hooks/reduxStore'
import styles from './index.less'

const { Header } = Layout

interface RightHeaderProps {
  info?: CusRouteMeta
}
const RightHeader = (props: RightHeaderProps) => {
  const { hideBreadcrumb, hideHeader } = useAppSelector((state) => ({
    hideBreadcrumb: state.common.layoutMate.hideBreadcrumb,
    hideHeader: state.common.layoutMate.hideHeader,
  }))
  const { info = {} as CusRouteMeta } = props

  const { title } = info

  return (
    <Header style={{ display: hideHeader ? 'none' : 'block' }}>
      <div className={styles.headerBox}>
        {hideBreadcrumb ? (
          <>
            <span className={styles.titleIcon} />
            <span className={styles.title}>{title}</span>
          </>
        ) : (
          <CusBreadCrumb />
        )}
      </div>
    </Header>
  )
}

export default React.memo(RightHeader)
