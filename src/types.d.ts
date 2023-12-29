interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
}

declare module '*.less' {
  const resource: { [key: string]: string }
  export = resource
}

declare interface NodeModule {
  hot?: {
    accept: (path?: string, callback?: () => void) => void
    dispose: (callback: (data: unknown) => void) => void
  }
}

declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>

  const src: any
  export default src
}

declare module '*.png'
