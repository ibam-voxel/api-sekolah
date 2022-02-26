const fs = require('fs');
const path = require('path');
const fileSystem = require('../app/services/fileSystem');
const debug = require('../app/services/debug');

const routers = [];
const routePaths = [];
fileSystem.listAllFile(__dirname, '.js', false, requireAllRouter);

function requireAllRouter(fileName) {
  const requiredFile = `./${fileName}`;
  if (fileName != 'index') {
    const curRoute = require(requiredFile);
    const path = `/${fileName}`;
    routers.push({
      path,
      routeProps: curRoute,
    });
    routePaths.push(path);
  }
}

debug.logHeader('registered routes');
routers.forEach((route) => {
  route.routeProps.route.stack.forEach((childRoute) => {
    debug.logData(route.path, childRoute.route.path);
  });
});

module.exports = (app) => {
  const packageRaw = fs.readFileSync(path.join(__dirname, '../package.json'));
  const packageJSON = JSON.parse(packageRaw);

  // debug.logData("package",packageJSON)
  /* GET home page. */
  app.get('/', (req, res, next) => {
    // res.status(200).json({
    //   test:"halohalo"
    // });
    res.render('index', {
      title: packageJSON.name,
      env: process.env.NODE_ENV,
      port: process.env.PORT || 3000,
      endPoints: routePaths,
    });
  });

  routers.forEach((item, index) => {
    const middlewares = [];
    // if (item.routeProps.needAuth == true) {
    //   middlewares.push(decryptToken);
    // }
    app.use(item.path, middlewares, item.routeProps.route);
  });
};