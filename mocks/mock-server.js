const chokidar = require('chokidar');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const path = require('path');
const Mock = require('mockjs');

const mockDir = path.join(process.cwd(), 'mocks');

function registerRoutes(app) {
  let mockLastIndex;
  const { default: mocks } = require('./index.js');
  const mocksForServer = mocks.map((route) => {
    const defaultTimeout = route.timeout ? route.timeout : 0
    return responseFake(route.url, route.type, route.response, defaultTimeout);
  });
  for (const mock of mocksForServer) {
    app[mock.type](mock.url, mock.response);
    mockLastIndex = app._router.stack.length;
  }
  const mockRoutesLength = Object.keys(mocksForServer).length;
  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength,
  };
}

function unregisterRoutes() {
  Object.keys(require.cache).forEach((i) => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)];
    }
  });
}

function timer(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

// for mock server
const responseFake = (url, type, respond, timeout) => {
  return {
    url: new RegExp(`${url}`),
    type: type || 'get',
    response(req, res) {
      console.log('request invoke:' + req.path);
      timer(timeout).then(() => {
        res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond));
      })
    },
  };
};

module.exports = (app) => {
  // es6 polyfill
  require('@babel/register')({
    presets: ['@babel/preset-env']
  })

  // parse app.body
  // https://expressjs.com/en/4x/api.html#req.body
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );

  const mockRoutes = registerRoutes(app);
  var mockRoutesLength = mockRoutes.mockRoutesLength;
  var mockStartIndex = mockRoutes.mockStartIndex;

  // watch files, hot reload mock server
  chokidar
    .watch(mockDir, {
      ignored: /mock-server/,
      ignoreInitial: true,
    })
    .on('all', (event, path) => {
      if (event === 'change' || event === 'add') {
        try {
          // remove mock routes stack
          app._router.stack.splice(mockStartIndex, mockRoutesLength);

          // clear routes cache
          unregisterRoutes();

          const mockRoutes = registerRoutes(app);
          mockRoutesLength = mockRoutes.mockRoutesLength;
          mockStartIndex = mockRoutes.mockStartIndex;

          console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`));
        } catch (error) {
          console.log(chalk.redBright(error));
        }
      }
    });
};
