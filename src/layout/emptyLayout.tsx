import React from 'react'

type EmptyLayoutPropsType = {
  children: React.ReactElement
}

export default function EmptyLayout(props: EmptyLayoutPropsType) {
  return <div>{props.children}</div>
}
