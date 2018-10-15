'use strict'

const path = require('path')

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://47.96.72.8:8765', // 线上
        changeOrigin: true,
        pathRevrite: {
          '^/api': '/api'
        }
      }
    },
    host: 'localhost',
    port: 8000,
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false,
    useEslint: true,
    showEslintErrorsInOverlay: false,
    devtool: '#cheap-source-map',
    cacheBusting: true,
    cssSourceMap: false,
  },

  build: {
    index: path.resolve(__dirname, '../dist/index.html'),

    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',

    assetsPublicPath: './',

    productionSourceMap: false,
    devtool: '#source-map'
  }
}
