process.env.NODE_ENV = 'development'
const fs = require('fs')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { launchEditorMiddleware } = require('react-dev-inspector/plugins/webpack')
const webpackConfigBase = require('./webpack.base.conf')

require('./env')
const paths = require('./paths')

const IS_MOCK = process.argv.includes('mock')

const useTypeScript = fs.existsSync(paths.appTsConfig)

const webpackConfigDev = {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    useTypeScript && new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 1024,
        configFile: paths.appTsConfig
      }
    })
  ].filter(Boolean),
  // 如果觉得还可以容忍更慢的非 eval 类型的 sourceMap，可以搭配 error-overlay-webpack-plugin 使用
  // 需要显示列号可以切换成 eval-source-map
  devtool: 'eval-source-map',
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devServer: {
    contentBase: paths.appSrc,
    compress: true,
    stats: {
      color: true
    },
    historyApiFallback: true,
    open: true,
    hot: true,
    host: 'localhost',
    port: 9001,
    // 控制台展示报错信息
    clientLogLevel: 'warning',
    compress: true,
    inline: true,
    progress: true, // 打包进度
    // 报错信息会全屏展示
    overlay: { // 报错信息
      warnings: false,
      errors: false
    },
    noInfo: false,
    proxy: {}, // 代理接口转发
    quiet: true, // 日志信息
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    before(app, server) {
      app.use(launchEditorMiddleware)
      if (IS_MOCK) {
        require('../mocks/mock-server.js')(app)
      }
    }
  }
}

module.exports = merge(webpackConfigBase, webpackConfigDev)
