// import path from 'path'
import { merge } from 'webpack-merge'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CompressionPlugin from 'compression-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
// import SizePlugin from 'size-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import webpackConfigBase from './webpack.base.conf'
// 立即执行，初始化环境变量
const baseConfig = webpackConfigBase('production')

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
const ENABLE_ANALYZE = process.argv.includes('--analyze')

const webpackConfigProd = merge(baseConfig, {
  mode: 'production',
  target: ['web', 'es5'],
  devtool: shouldUseSourceMap ? 'source-map' : false,
  optimization: {
    minimize: true,
    runtimeChunk: true,
    splitChunks: {
      // 默认为async
      chunks: 'all',
      cacheGroups: {
        // track: {
        //   test: path.resolve(__dirname, '../src/utils/track/track.config'),
        //   name: 'track',
        //   enforce: true,
        //   filename: 'chunks/track.config.js',
        // },
        // 以下两个为默认配置
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            ecma: 5,
            drop_debugger: true,
            drop_console: true,
            comparisons: false,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: 'css/style.[contenthash].css',
      chunkFilename: 'css/style.[contenthash].[id].css',
    }),

    // gzip 压缩
    new CompressionPlugin({
      // 小于1k不打gzip
      threshold: 10240,
    }),
  ],
} as any)

let prodConfig = webpackConfigProd

if (ENABLE_ANALYZE) {
  webpackConfigProd.plugins.push(
    new BundleAnalyzerPlugin(),
  )
  prodConfig = webpackConfigProd
}

export default prodConfig
