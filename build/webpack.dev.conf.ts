import { merge } from 'webpack-merge'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import paths from './paths'
import webpackConfigBase from './webpack.base.conf'
// 立即执行，初始化环境变量
const baseConfig = webpackConfigBase('development')

const IS_MOCK = process.argv.includes('mock')

const webpackConfigDev = {
  mode: 'development',
  // target: ['web', 'es5'],
  plugins: [new ReactRefreshWebpackPlugin()],
  // 如果觉得还可以容忍更慢的非 eval 类型的 sourceMap，可以搭配 error-overlay-webpack-plugin 使用
  // 需要显示列号可以切换成 eval-source-map
  devtool: 'cheap-module-source-map',

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            ecma: 5,
            comparisons: false,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
  },
  devServer: {
    compress: true,
    static: {
      directory: paths.appSrc,
      publicPath: [paths.publicUrlOrPath],
    },
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    open: true,
    hot: true,
    host: 'localhost',
    port: 8001,
    proxy: {}, // 代理接口转发
    onBeforeSetupMiddleware(devServer: any) {
      if (IS_MOCK) {
        require('../mocks/mock-server.js')(devServer.app)
      }
    },
  },
}

export default merge(baseConfig, webpackConfigDev as any)
