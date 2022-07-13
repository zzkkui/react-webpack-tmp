import React, { FC } from 'react'
import { Icon } from 'chopperui-react'
import styles from './style/collapseBtn.less'

interface CollapseBtnProps {
  collapse: boolean
  onChange: (collapse: boolean) => void
}

const CollapseBtn: FC<CollapseBtnProps> = (props: CollapseBtnProps) => {
  const { collapse, onChange } = props

  const handleClick = () => {
    onChange(!collapse)
  }
  return (
    <div className={styles.btnBox} onClick={handleClick}>
      {collapse ? <Icon type="menu-fold" /> : <Icon type="menu-unfold" />}
    </div>
  )
}

CollapseBtn.displayName = 'CollapseBtn'

export default CollapseBtn
