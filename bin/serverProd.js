require('../lib/common');
const path = require('path');
const pify = require('pify');
const fs = pify(require('fs'));
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const staticServer = require('koa-static');
const logger = require('laputa-log').createLogger()

let start = async () => {
  const app = new Koa();
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    await next();
  });

  app.use(staticServer(path.join(__dirname, '../build'), {gzip: true}));
  app.use(bodyParser());

  // add routes
  let walk = async (dir, root) => {
    let items = await fs.readdir(dir);
    for (let i in items) {
      let item = items[i];
      let stat = await fs.stat(path.join(dir, item));
      if (stat.isDirectory()) {
        await walk(path.join(dir, item), root + item + '/')
      } else {
        let routeItem = require('../routes' + root + item.substring(0, item.length - 3));
        router.use(
          item == 'index.js'
          ? root
          : root + item.substring(0, item.length - 3) + '/',
        routeItem.routes(),
        routeItem.allowedMethods());
      }
    }
  };
  await walk(path.join(__dirname, '../routes'), '/');
  app.use(router.routes(), router.allowedMethods());

  // 404
  app.use(async (ctx) => {
    if (ctx.status === 404 && !ctx.body && !ctx.request.url.startsWith('/api/')) {
      ctx.set('content-type', 'text/html; charset=utf-8')
      ctx.body = require('fs').createReadStream(path.join(__dirname, '../build/index.html'))
    }
  })

  // socket
  const server = require('http').createServer(app.callback());
  const io = require('socket.io')(server);
  const loginManager = require('../lib/socket/loginManager');
  io.on('connection', (socket) => {
    // 所有的连接都必须通过login manager进行校验后再分配
    loginManager.socketHandler(socket);
  });

  // before listen
  await require('../bootstrap')();

  const port = 8001;
  server.listen(port);
  logger.info(`app started at port ${port}...`);
};

start();
