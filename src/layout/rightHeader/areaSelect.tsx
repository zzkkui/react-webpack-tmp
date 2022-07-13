import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { Icon, Select } from 'chopperui-react'
import { setZoneAction } from 'src/store/actions/user'
import styles from './areaSelect.less'
import { StoreType } from 'src/store/types'
import { Zone } from 'src/store/reducers/user'
import { useShallowEqualSelector } from 'src/utils/hooks'

const { Option } = Select
const AreaSelect: FC = () => {
  const dispatch = useDispatch()
  const { zoneList, currZone } = useShallowEqualSelector((state: StoreType) => {
    return { zoneList: state.user.zoneList, currZone: state.user.currZone }
  })

  const handleChange = (value: number) => {
    const selected = zoneList.find((n: Zone) => n.id === value)
    dispatch(setZoneAction(selected || {}))
  }

  return (
    <div className={styles.selectBox}>
      <Icon className={styles.icon} type="k-pin" theme="filled" />
      <Select className={styles.select} value={currZone.id} style={{ width: 150 }} onChange={handleChange}>
        {zoneList.map((zone: Zone) => (
          <Option value={zone.id} key={zone.id}>
            {zone.name}
          </Option>
        ))}
      </Select>
    </div>
  )
}

AreaSelect.displayName = 'AreaSelect'

const MemoizedAreaSelect = React.memo(AreaSelect)

export default MemoizedAreaSelect
// export default AreaSelect
