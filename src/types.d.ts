interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
}

declare module '*.less' {
  const resource: { [key: string]: string }
  export = resource
}
