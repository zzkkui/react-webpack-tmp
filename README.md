## react-webpack-tmp

### 开发环境

`node 16+`

**如需使用 node 14**
项目中使用的 eslint-plugin-n (已知) 需要 node 16，这是 eslint-config-standard 的依赖项，如果需要支持 node 14，须将 eslint-config-standard 降级处理。并将 eslint-plugin-n 替换成 eslint-plugin-node

关于 npm run lint：
webpack 中已经内置了 eslintPlugin，理论上不需要启动服务或者构建之前额外 lint

### 命令使用

#### 安装

```bash
yarn
```

or

```bash
npm install
```

#### 运行

// 本地开发命令

``` bash
yarn start
```

// 本地mock

``` bash
yarn mock
```

// 打包上线命令

``` bash
yarn build
```

### 环境变量设置

1. 可通过命令行 `cross-env` 添加环境变量

2. 跟 cra 一样，通过 `.env.*` 来添加

```js
// dotenv: resolveApp('.env')
const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  // 如果是 test 环境，不会引入 .env.local
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  // 所有环境都会引入
  paths.dotenv,
].filter(Boolean) as string[]

// 同一变量存在多个文件时，按照 dotenvFiles 数组的顺序，靠前的文件内的变量会覆盖后面的同一变量
```

- `.env`
- `.env.local`
- `.env.development`  `.env.production`  `.env.test`
- `.env.development.local`  `.env.production.local`  `.env.test.local`

*.local 文件不上传 git，只在本地使用

3. **注意，如果环境变量需要注入到 APP 中，需要 `REACT_APP_*` 开头，否则会被过滤，如果只是在构建时使用，则不需要**

```js
// REACT_APP = /^REACT_APP_/i
Object.keys(process.env)
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
```

### Feat

- [√] redux toolkit
- [√] mockjs模拟后端返回接口
- [√] 通用布局
- [√] 多布局路由体系
- [√] axios配置
- [√] css modules (src/styles目录、global文件为 global css)
