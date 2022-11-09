const path = require('path')

//处理静态文件
function static(filePath) {
  if(filePath === 'root') {
    easy_global_staticPath = '/'
  } else {
    easy_global_staticPath = filePath
  }
  
  console.log('已开启静态文件服务器，请访问' + filePath);
}

module.exports = static