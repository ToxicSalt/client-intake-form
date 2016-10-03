import express from 'express'
import path from 'path'
import createSchema from './database/schema'
import router from './router'

const app = express()

// DEVELOPMENT MIDDLEWARE //
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack')
  const webpackConfig = require('../webpack.config')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const chokidar = require('chokidar')
  const DashboardPlugin = require('webpack-dashboard/plugin')
  const compiler = webpack(webpackConfig)
  // compiler.apply(new DashboardPlugin());

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    quiet: true,
    publicPath: webpackConfig.output.publicPath,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }))
  app.use(webpackHotMiddleware(compiler,))

  const watcher = chokidar.watch(__dirname + '/router')
  watcher.on('ready', function() {
    watcher.on('all', function() {
      console.log('Clearing /router/ module cache from server')
      Object.keys(require.cache).forEach(function(id) {
        if (/[\/\\]server[\/\\]router[\/\\]/.test(id)) delete require.cache[id]
      })
    })
  })
}
const staticPath = path.resolve(__dirname, '../public')
app.use(express.static(staticPath))
app.listen(process.env.PORT || 3000)
app.get('*', (req, res) => res.sendFile(staticPath + '/index.html'))
app.use('/', router)
export default app
