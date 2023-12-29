import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
// import WebpackBar from 'WebpackBar'
import CopyPlugin from 'copy-webpack-plugin'
import svgToMiniDataURI from 'mini-svg-data-uri'
import EsLintPlugin from 'eslint-webpack-plugin'
import paths, { moduleFileExtensions } from './paths'
import { getClientEnvironment } from './env'
import { createEnvironmentHash } from './utils'
import presetEnv from './presetEnv'

export const useTypeScript = fs.existsSync(paths.appTsConfig)

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
  useShortDoctype: true,
}

// function resolve(relatedPath) {
//   return path.join(__dirname, relatedPath)
// }

const getStyleLoaders = (cssOptions: Record<string, any>, preProcessor?: string) => {
  const isEnvDevelopment = process.env.NODE_ENV === 'development'
  const isEnvProduction = process.env.NODE_ENV === 'production'
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

  const loaders = [
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          ident: 'postcss',
          plugins: [
            'postcss-flexbugs-fixes',
            [
              'postcss-preset-env',
              {
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              },
            ],
            'postcss-normalize',
          ],
        },
        sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
      },
    },
  ].filter(Boolean)
  if (preProcessor) {
    const options =
      preProcessor === 'less-loader'
        ? {
            lessOptions: {
              javascriptEnabled: true,
              math: 'always',
            },
          }
        : {}
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
      {
        loader: require.resolve(preProcessor),

        options: {
          sourceMap: true,
          ...options,
        },
      },
    )
  }
  return loaders
}

function webpackConfigBase(nodeEnv: 'development' | 'production') {
  // 初始化环境变量
  presetEnv(nodeEnv)
  const isEnvDevelopment = nodeEnv === 'development'
  const isEnvProduction = nodeEnv === 'production'
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

  const isEnvProductionProfile = isEnvProduction && process.argv.includes('profile')
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
  const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '5000')
  return {
    entry: [paths.appIndexJs],
    output: {
      path: paths.appBuild,
      filename: isEnvDevelopment ? 'js/[contenthash].js' : 'js/[name].[chunkhash].js',
      chunkFilename: isEnvDevelopment ? 'chunks/[contenthash:8].js' : 'chunks/[name].[chunkhash].js',
      publicPath: paths.publicUrlOrPath,
    },
    // 实验性配置，WebAssembly 相关
    // experiments: {
    //   syncWebAssembly: true,
    //   asyncWebAssembly: true,
    // },
    stats: 'errors-warning',
    bail: isEnvProduction,
    cache: {
      type: 'filesystem',
      version: createEnvironmentHash({ ...env.raw, arg: process.argv }),
      cacheDirectory: paths.appWebpackCache,
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [paths.appJsConfig, paths.appTsConfig].filter((f) => fs.existsSync(f)),
      },
    },
    infrastructureLogging: {
      level: 'none',
    },
    resolve: {
      extensions: moduleFileExtensions.map((ext) => `.${ext}`).filter((ext) => useTypeScript || !ext.includes('ts')),
      modules: ['node_modules', paths.appNodeModules],
      alias: {
        // react 16.5 之前需要设置才能在 prod 环境开启性能分析，后续版本则不需要
        // https://react.dev/reference/react/Profiler
        ...(isEnvProductionProfile && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
        src: path.join(__dirname, '../src'),
      },
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
              type: 'asset',
              generator: {
                filename: 'static/media/[name].[hash].[ext]',
              },
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            {
              test: /\.svg$/,
              type: 'asset',
              // *.svg?url，不会使用 @svgr/webpack 生成组件，而是作为资源直接引入
              resourceQuery: /url/,
            },
            {
              test: /\.svg$/,
              resourceQuery: { not: [/url/] },
              oneOf: [
                {
                  issuer: {
                    and: [/\.(ts|tsx|js|jsx)$/],
                  },
                  use: [
                    {
                      loader: require.resolve('@svgr/webpack'),
                      options: {
                        prettier: false,
                        svgo: false,
                        svgoConfig: {
                          plugins: [{ removeViewBox: false }],
                        },
                        titleProp: true,
                        ref: true,
                      },
                    },
                  ],
                },
                {
                  type: 'asset',
                  generator: {
                    filename: 'static/media/[name].[hash:8].[ext]',
                    dataUrl: (content: any) => {
                      const _content = content.toString()
                      return svgToMiniDataURI(_content)
                    },
                  },
                  parser: {
                    dataUrlCondition: {
                      maxSize: imageInlineSizeLimit,
                    },
                  },
                },
              ],
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: [paths.appSrc],
              // loader: 'happypack/loader?id=happyBabel',
              use: {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                  cacheCompression: false,
                  compact: isEnvProduction,
                  plugins: [
                    // ... other plugins
                    isEnvDevelopment && require.resolve('react-refresh/babel'),
                  ].filter(Boolean),
                },
              },
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
              use: getStyleLoaders(
                {
                  importLoaders: 1,
                  modules: false,
                },
                'less-loader',
              ),
            },
            {
              test: cssRegex,
              exclude: [cssModuleRegex, paths.appNodeModules],
              use: getStyleLoaders({
                importLoaders: 1,
                modules: {
                  mode: (resourcePath: string) => {
                    const path = resourcePath.replace(/\\/g, '/')
                    // global.less、src目录下的 styles 为全局样式
                    if (/global\.css|src\/styles\//i.test(path)) {
                      return 'global'
                    }
                    return 'local'
                  },
                },
              }),
              sideEffects: true,
            },
            {
              test: cssModuleRegex,
              exclude: [paths.appNodeModules],
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction && shouldUseSourceMap,
              }),
            },
            // {
            //   test: sassRegex,
            //   exclude: sassModuleRegex,
            //   use: getStyleLoaders(
            //     {
            //       importLoaderss: 3,
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
            //       importLoaderss: 3,
            //       sourceMap: isEnvProduction && shouldUseSourceMap,
            //     },
            //     'sass-loader',
            //   ),
            // },
            {
              test: lessRegex,
              exclude: [lessModuleRegex, paths.appNodeModules],
              use: getStyleLoaders(
                {
                  importLoaders: 1,
                  modules: {
                    mode: (resourcePath: string) => {
                      const path = resourcePath.replace(/\\/g, '/')
                      // global.less、src目录下的 styles 为全局样式
                      if (/global\.less|src\/styles\//i.test(path)) {
                        return 'global'
                      }
                      return 'local'
                    },
                  },
                },
                'less-loader',
              ),
              sideEffects: true,
            },
            {
              test: lessModuleRegex,
              exclude: [paths.appNodeModules],
              use: getStyleLoaders(
                {
                  importLoaders: 1,
                  modules: true,
                  sourceMap: isEnvProduction && shouldUseSourceMap,
                },
                'less-loader',
              ),
            },
            {
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
              generator: {
                filename: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin(env.stringified),
      // new WebpackBar({
      //   name: 'react-typescript',
      //   color: '#61dafb'
      // }),

      new CopyPlugin({
        patterns: [
          {
            from: './public/**/*',
            to: './',
            globOptions: {
              ignore: ['**/favicon.png', '**/index.html'],
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
        template: paths.appHtml,
      }),

      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entryPoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path
            return manifest
          }, seed)
          const entrypointFiles = entryPoints.main.filter((fileName) => !fileName.endsWith('.map'))
          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          }
        },
      }),

      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),

      new EsLintPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        cache: true,
        context: paths.appPath,
        cacheLocation: path.resolve(paths.appNodeModules, '.cache/.eslintcache'),
        cwd: paths.appPath,
        resolvePluginsRelativeTo: __dirname,
        overrideConfigFile: '.eslintrc.js',
      }),
    ],
    performance: false,
  }
}


export default webpackConfigBase
