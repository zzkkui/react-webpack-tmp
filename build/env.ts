export type ClientEnvironmentType = {
  raw: Record<string, any>
  stringified: {
    'process.env': {}
  }
}

const REACT_APP = /^REACT_APP_/i

export function getClientEnvironment(publicUrl: string): ClientEnvironmentType {
  const raw = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        const env1: Record<string, any> = env
        env1[key] = process.env[key]
        return env1
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_URL: publicUrl,
        WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
        WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
        WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
      },
    )

  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      const env1: Record<string, any> = env
      env1[key] = JSON.stringify(raw[key])
      return env1
    }, {}),
  }

  return { raw, stringified }
}
