import path from 'path'
import fs from 'fs'
import dotenvExpand from 'dotenv-expand'
import dotenv from 'dotenv'
import paths from './paths'

export default (NODE_ENV: string) => {
  process.env.NODE_ENV = NODE_ENV

  const dotenvFiles = [
    `${paths.dotenv}.${NODE_ENV}.local`,
    `${paths.dotenv}.${NODE_ENV}`,
    // 如果是 test 环境，不会引入 .env.local
    NODE_ENV !== 'test' && `${paths.dotenv}.local`,
    // 所有环境都会引入
    paths.dotenv,
  ].filter(Boolean) as string[]

  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      dotenvExpand(
        dotenv.config({
          path: dotenvFile,
        }),
      )
    }
  })

  const appDirectory = fs.realpathSync(process.cwd())
  process.env.NODE_PATH = (process.env.NODE_PATH || '')
    .split(path.delimiter)
    .filter((folder) => folder && !path.isAbsolute(folder))
    .map((folder) => path.resolve(appDirectory, folder))
    .join(path.delimiter)
}
