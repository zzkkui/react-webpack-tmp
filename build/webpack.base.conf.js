const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackBar = require('webpackbar')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const paths = require('./paths')
const getClientEnvironment = require('./env')

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

const isEnvDevelopment = process.env.NODE_ENV === 'development'
const isEnvProduction = process.env.NODE_ENV === 'production'
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

// 性能监测
const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile')

// eslint-disable-next-line radix
const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000')

const useTypeScript = fs.existsSync(paths.appTsConfig)

// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
// const sassRegex = /\.(scss|sass)$/
// const sassModuleRegex = /\.module\.(scss|sass)$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/

const htmlMinifyOptions = {
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  useShortDoctype: true
}

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: '../../' }
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: [
            ['postcss-preset-env', {
              browsers: '> 0.5%, not dead, iOS >= 7, Android >= 4.3'
            }]
          ]
        },
        sourceMap: isEnvProduction && shouldUseSourceMap
      }
    }
  ].filter(Boolean)
  if (preProcessor) {
    const options = preProcessor === 'less-loader' ? {
      lessOptions: { javascriptEnabled: true }
    } : {}
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap
        }
      },
      {
        loader: require.resolve(preProcessor),

        options: {
          sourceMap: true,
          ...options
        }
      }
    )
  }
  return loaders
}

const webpackConfigBase = {
  entry: [paths.appIndexJs],
  output: {
    path: resolve('../dist'),
    filename: isEnvDevelopment ? 'js/[contenthash].js' : 'js/[name].[chunkhash:8].js',
    chunkFilename: isEnvDevelopment ? 'chunks/[contenthash].js' : 'chunks/[name].[chunkhash:8].js',
    publicPath: '/'
  },
  experiments: {
    syncWebAssembly: true,
    asyncWebAssembly: true
  },
  resolve: {
    extensions: paths.moduleFileExtensions
      .map((ext) => `.${ext}`)
      .filter((ext) => useTypeScript || !ext.includes('ts')),
    modules: ['node_modules', paths.appNodeModules],
    alias: {
      ...(isEnvProductionProfile && {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling'
      }),
      'src': path.join(__dirname, '../src')
    },
    fallback: {
      fs: false,
      util: false,
      stream: false,
      buffer: false
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|mjs|jsx|ts|tsx)$/,
      //   enforce: 'pre',
      //   use: [
      //     {
      //       options: {
      //         cache: true,
      //         // formatter: require('eslint-friendly-formatter'),
      //         eslintPath: require.resolve('eslint'),
      //         resolvePluginsRelativeTo: __dirname

      //       },
      //       loader: require.resolve('eslint-loader')
      //     }
      //   ],
      //   include: paths.appSrc
      // },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: imageInlineSizeLimit,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: [paths.appSrc],
            // exclude: paths.appNodeModules,
            // loader: 'happypack/loader?id=happyBabel',
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              compact: isEnvProduction,
              plugins: [
                // ... other plugins
                isEnvDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            }
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            // loader: 'happypack/loader?id=happyBabel1',

            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              cacheDirectory: true,
              cacheCompression: false,
              sourceMaps: shouldUseSourceMap,
              inputSourceMap: shouldUseSourceMap
            }
          },
          {
            test: cssRegex,
            include: paths.appNodeModules,
            use: getStyleLoaders({
              importLoaders: 1,
              modules: false,
            }),
          },
          {
            test: lessRegex,
            include: paths.appNodeModules,
            use: getStyleLoaders({
              importLoaders: 1,
              modules: false,
            }),
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              modules: {
                mode: (resourcePath) => {
                  const path = resourcePath.replace(/\\/g, '/')
                  // global.less、src目录下的 styles 为全局样式
                  if (/global\.css|src\/styles\//i.test(path)) {
                    return "global";
                  }
                  return "local";
                },
              },
            }),
            sideEffects: true
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: isEnvProduction && shouldUseSourceMap
            })
          },
          // {
          //   test: sassRegex,
          //   exclude: sassModuleRegex,
          //   use: getStyleLoaders(
          //     {
          //       importLoaders: 3,
          //       sourceMap: isEnvProduction && shouldUseSourceMap,
          //     },
          //     'sass-loader',
          //   ),
          //   sideEffects: true,
          // },
          // {
          //   test: sassModuleRegex,
          //   use: getStyleLoaders(
          //     {
          //       importLoaders: 3,
          //       sourceMap: isEnvProduction && shouldUseSourceMap,
          //     },
          //     'sass-loader',
          //   ),
          // },
          {
            test: lessRegex,
            exclude: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 1,
                modules: {
                  mode: (resourcePath) => {
                    const path = resourcePath.replace(/\\/g, '/')
                    // global.less、src目录下的 styles 为全局样式
                    if (/global\.less|src\/styles\//i.test(path)) {
                      return "global";
                    }
                    return "local";
                  },
                },
              },
              'less-loader'
            ),
            sideEffects: true
          },
          {
            test: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 1,
                modules: true,
                sourceMap: isEnvProduction && shouldUseSourceMap
              },
              'less-loader'
            )
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  stats: "errors-only",
  plugins: [
    new webpack.DefinePlugin(env.stringified),
    new WebpackBar({
      name: 'react-typescript',
      color: '#61dafb'
    }),

    new FriendlyErrorsPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "./public/**/*",
          to: "./",
          globOptions: {
            ignore: ["**/favicon.png", "**/index.html"],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    new HtmlWebpackPlugin({
      // HtmlWebpackPlugin 会调用 HtmlMinifier 对 HTMl 文件进行压缩
      // 只在生产环境压缩
      filename: 'index.html',
      inject: true,
      minify: !isEnvProduction ? false : htmlMinifyOptions,
      template: paths.appHtml
    }),

    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    })
  ],
  performance: {
    hints: false,
  }
}

module.exports = webpackConfigBase
