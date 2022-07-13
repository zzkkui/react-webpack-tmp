process.env.NODE_ENV = 'production'
const fs = require('fs')
const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CompressionPlugin = require('compression-webpack-plugin')
const SizePlugin = require('size-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpackConfigBase = require('./webpack.base.conf')

require('./env')
const paths = require('./paths')

const ENABLE_ANALYZE = process.argv.includes('--analyze')
const useTypeScript = fs.existsSync(paths.appTsConfig)

const webpackConfigProd = merge(webpackConfigBase, {
  mode: 'production',
  // 兼容性, dev 中影响热更新
  target: ['web', 'es5'],
  stats: {
    children: false, // 不输出子模块的打包信息
  },
  optimization: {
    minimize: true,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            drop_debugger: true,
            drop_console: true,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          // keep_classnames: isEnvProductionProfile,
          // keep_fnames: isEnvProductionProfile,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        // sourceMap: shouldUseSourceMap
      }),
      // This is only used in production mode
      new CssMinimizerPlugin()
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),

    useTypeScript && new ForkTsCheckerWebpackPlugin({
      typescript: {
        // 生产环境打包并不频繁，可以适当调高允许使用的内存，加快类型检查速度
        async: false,
        useTypescriptIncrementalApi: true,
        memoryLimit: 4096,
        configFile: paths.appTsConfig
      }
    }),

    new MiniCssExtractPlugin({
      filename: 'css/style.[contenthash].css',
      chunkFilename: 'css/style.[contenthash].[id].css'
    }),

    // gzip 压缩
    new CompressionPlugin()

  ].filter(Boolean)
})

let prodConfig = webpackConfigProd

if (ENABLE_ANALYZE) {
  webpackConfigProd.plugins.push(new SizePlugin({ writeFile: false }), new BundleAnalyzerPlugin())
  prodConfig = webpackConfigProd
}

module.exports = prodConfig
