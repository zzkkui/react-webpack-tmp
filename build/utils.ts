import { createHash } from 'crypto'
import path from 'path'

export function createEnvironmentHash(env: Object) {
  const hash = createHash('md5')
  hash.update(JSON.stringify(env))
  return hash.digest('hex')
}

export function excludeNodeModulesExcept(modules: string[]) {
  let pathSep: string = path.sep
  if (pathSep === '\\') {
    // must be quoted for use in a regexp:
    pathSep = '\\\\'
  }
  const moduleRegExps = modules.reduce(function (prev: RegExp[], modName: string) {
    return [
      ...prev,
      new RegExp(`node_modules${pathSep}${modName}`),
      new RegExp(`node_modules${pathSep}\\*\\*${pathSep}${modName}`),
    ]
  }, [])

  return function (modulePath: string) {
    if (/node_modules/.test(modulePath)) {
      for (let i = 0; i < moduleRegExps.length; i++) if (moduleRegExps[i].test(modulePath)) return false
      return true
    }
    return false
  }
}
