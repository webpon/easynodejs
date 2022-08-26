//全局变量
global.staticPath = ''
global.requestCallback = {}
global.urlName = ''
global.currentType = ''
global.file = false
global.postPath = ''
global.cors = false
//模块
const open = require('./open.js')
const static = require('./static.js')
const request = require('./request.js')
const cors = require('./cors.js')

module.exports = {
  open,
  static,
  ...request,
  cors
}