import path from 'path'
import fs from 'fs'

const appDirectory = fs.realpathSync(process.cwd())
export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath)

export const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
]

const resolveModule = (resolveFn: Function, filePath: string) => {
  const extension = moduleFileExtensions.find((exten) => fs.existsSync(resolveFn(`${filePath}.${exten}`)))

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

function getPublicUrlOrPath(homepage?: string, envPublicUrl?: string) {
  // 环境变量设置的 优先级高
  if (envPublicUrl) {
    envPublicUrl = envPublicUrl.endsWith('/') ? envPublicUrl : `${envPublicUrl}/`

    return envPublicUrl.startsWith('.') ? '/' : envPublicUrl
  }

  if (homepage) {
    homepage = homepage.endsWith('/') ? homepage : `${homepage}/`

    return homepage.startsWith('.') ? '/' : homepage
  }

  return '/'
}

const publicUrlOrPath = getPublicUrlOrPath(require(resolveApp('package.json')).homepage, process.env.PUBLIC_URL)

export default {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  appWebpackCache: resolveApp('node_modules/.cache'),
  publicUrlOrPath,
}
