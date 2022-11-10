//全局变量
global.easy_global_staticPath = ''
global.easy_global_requestCallback = {}
global.easy_global_cors = false
//模块
const open = require('./open.js')
const static = require('./static.js')
const request = require('./request.js')
const cors = require('./cors.js')
const j2m = require('./j2m/index.js')
const mockjs = require(`mockjs`)

module.exports = {
  j2m: (...arg) => mockjs.mock(j2m(...arg)),
  open,
  static,
  ...request,
  cors
}