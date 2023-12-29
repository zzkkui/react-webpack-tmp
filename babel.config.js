module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // usage 自动引入 polyfill，但是在兼容 ie 上有问题
        useBuiltIns: 'entry',
        debug: false,
        corejs: 3,
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', false],
    // ant5 不需要了
    // [
    //   'import',
    //   {
    //     'libraryName': 'antd',
    //     'libraryDirectory': 'es',
    //     'style': true // `style: true` 会加载 less 文件
    //   },
    //   'antd'
    // ],
  ],
  env: {
    development: {
      presets: [
        [
          '@babel/preset-react',
          {
            development: true,
          },
        ],
      ],
    },
  },
}
