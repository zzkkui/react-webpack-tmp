## boa-cli

### 开发环境

`node 10+`

### 命令使用

#### 安装

``` bash
yarn
```

or

``` bash
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

### Feat

- [√] redux完整示范
- [√] mockjs模拟后端返回接口
- [√] 通用布局
- [] 登录，以及登录权限控制
- [√] axios配置
- [√] css modules (src/styles目录、global文件为 global css)

├─.babelrc
├─.cz-config.js
├─.editorconfig
├─.eslintignore
├─.eslintrc.js
├─.gitignore
├─.npmrc
├─.prettierignore
├─.prettierrc.js
├─.stylelintrc.json
├─jest.config.js
├─package.json
├─postcss.config.js
├─README.md
├─tree.md
├─tsconfig.json
├─src
|  ├─App.tsx
|  ├─global.less
|  ├─index.tsx
|  ├─setupTests.js
|  ├─types.d.ts
|  ├─utils
|  |   ├─axios.ts
|  |   ├─hoc.ts
|  |   ├─hooks.ts
|  |   ├─index.ts
|  ├─styles
|  |   └index.less
|  ├─store
|  |   ├─index.ts
|  |   ├─types.ts
|  |   ├─sagas
|  |   ├─reducers
|  |   ├─constants
|  |   ├─actions
|  ├─route
|  |   └index.tsx
|  ├─pages
|  |   ├─403.tsx
|  |   ├─404.tsx
|  |   ├─overview
|  |   |    └index.tsx
|  ├─layout
|  |   ├─basicLayout.tsx
|  |   ├─collapseBtn.tsx
|  |   ├─siderMenu.tsx
|  |   ├─style
|  |   ├─rightHeader
|  ├─components
|  |     ├─breadCrumb
|  |     ├─authorized
|  ├─api
├─public
|   └index.html
├─mocks
|   ├─index.js
|   ├─initData.js
|   └mock-server.js
├─build
|   ├─env.js
|   ├─paths.js
|   ├─webpack.base.conf.js
|   ├─webpack.dev.conf.js
|   ├─webpack.prod.conf.js
|   ├─jest
