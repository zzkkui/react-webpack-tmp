module.exports = {
  // 每次测试前自动清除模拟调用和实例。
  clearMocks: true,
  // Jest输出测试覆盖信息文件的目录。
  coverageDirectory: 'coverage',
  // Jest用于搜索文件的目录的路径列表。
  roots: ['<rootDir>/src'],
  // 符合测试覆盖的文件
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  // 测试前执行
  // setupFiles: ['react-app-polyfill/jsdom'],
  // 执行测试文件前，运行的代码（这里测试环境已准备就绪）
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  // 测试匹配的文件
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  // 用于测试的测试环境
  testEnvironment: 'jest-environment-jsdom-fourteen',
  // 转化相关
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/build/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/build/jest/fileTransform.js',
  },
  // 匹配不会转化
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$', '^.+\\.module\\.(css|sass|scss|less)$'],
  modulePaths: [],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss|less)$': 'identity-obj-proxy',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'jsx'],
  // 监听插件
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}
