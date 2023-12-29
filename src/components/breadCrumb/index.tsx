import React from 'react'
import { Breadcrumb, Button } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router'
import { useAppSelector } from 'src/hooks/reduxStore'
import styles from './index.less'
import { BreadCrumbType } from 'src/store/common'

type CusBreadcrumbPropsType = {
  breadCrumbs?: BreadCrumbType
}

const CusBreadcrumb = (props: CusBreadcrumbPropsType) => {
  const history = useHistory()

  const { breadCrumbs: storeBreadCrumbs } = useAppSelector((state) => ({
    breadCrumbs: state.common.breadCrumbs,
  }))

  const { breadCrumbs: propsBreadCrumbs } = props

  const { prev, hideBackBtn = false, paths } = propsBreadCrumbs || storeBreadCrumbs || ({} as BreadCrumbType)

  const handleBack = () => {
    history.push(prev)
  }

  return (
    <div className={styles.breadcrumbWrapper}>
      {!hideBackBtn && prev ? (
        <Button className={styles.btn} type="link" onClick={handleBack}>
          <LeftOutlined />
          返回
        </Button>
      ) : null}
      <span className={styles.icon} />
      <div className={styles.breadcrumb}>
        <Breadcrumb separator=">">
          {paths?.map((item, index, arr) => {
            const { name, path } = item
            return name ? (
              <Breadcrumb.Item key={name}>
                {index !== arr.length - 1 && path ? (
                  <a className="text-overflow" onClick={() => history.push(path!)} title={name}>
                    {name}
                  </a>
                ) : (
                  <span className="text-overflow" title={name}>
                    {name}
                  </span>
                )}
              </Breadcrumb.Item>
            ) : null
          })}
        </Breadcrumb>
      </div>
    </div>
  )
}

export default CusBreadcrumb
