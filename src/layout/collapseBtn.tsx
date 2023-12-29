import React, { FC } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
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
      {collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </div>
  )
}

export default CollapseBtn
