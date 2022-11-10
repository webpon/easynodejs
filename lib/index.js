//全局变量
global.easy_global_staticPath = ''
global.easy_global_requestCallback = {}
global.easy_global_cors = false
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