import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AreaSelect from './areaSelect'
import { zoneListAction, projectInfoAction } from 'src/store/actions/user'
import styles from './index.less'
import { Layout } from 'chopperui-react'
import { useShallowEqualSelector } from 'src/utils/hooks'
import { StoreType } from 'src/store/types'
import CustBreadCrumb from 'src/components/breadCrumb'

const { Header } = Layout

interface RightHeaderProps {
  title?: string
}
const RightHeader: FC<RightHeaderProps> = (props: RightHeaderProps) => {
  const dispatch = useDispatch()
  const { hideHeader, breadCrumbs } = useShallowEqualSelector((state: StoreType) => {
    return { hideHeader: state.common.hideHeader, breadCrumbs: state.common.breadCrumbs }
  })
  const { title } = props

  useEffect(() => {
    dispatch(zoneListAction())
    dispatch(projectInfoAction())
  }, [dispatch])

  return (
    <Header style={{ display: hideHeader && !breadCrumbs.paths ? 'none' : 'block' }}>
      <div className={styles.headerBox}>
        {!hideHeader ? (
          <>
            <span className={styles.titleIcon} />
            <span className={styles.title}>{title}</span>
            <div className={styles.selectWrapper}>
              <AreaSelect />
            </div>
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
