//引用原生htpp模块
const http = require('http')
const qs = require('qs');
const path = require('path')
const fs = require('fs')
const formidable = require('formidable')
const url = require('url')
const getMime = require('./getMime.js')
let status = 200
const send = function (data) {
  let resJSON = {
    data,
    status
  }
  this.end('2')
}
//开启服务器
function open(port) {

  // 开启服务器
  app = http.createServer()
  app.listen(port)
  console.log(`已开启http服务，请访问${port}端口`);
  app.on('request', (req, res) => {
    if (req.method === "OPTIONS") {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
      res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
      res.status = 200
      res.end('ok')
      return
    }
    var parseObj = url.parse(req.url, true);
    req.url = parseObj.pathname
    if (req.method === 'GET') {
      req.url = req.url + 'get'
    } else if (req.method === 'POST') {
      req.url = req.url + 'post'
    }

    if (cors === true) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
      res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    }
    if (requestCallback[req.url] === undefined || typeof requestCallback[req.url].cal !== 'function') {
      let reg = /get$|post$/
      req.url = req.url.replace(reg, '')
      let requestPath = decodeURI(path.join(staticPath, `..${req.url}`))
      // 检查当前目录中是否存在该文件。
      if (req.url === '/root' && staticPath === '/') {
        requestPath = '\/'
      }
      fs.access(requestPath, (err) => {
        if (!err) {
          const stat = fs.statSync(requestPath)
          if (stat && stat.isDirectory()) {
            fs.readdir(requestPath, (err, files) => {
              if (err) {
                res.writeHead(500);
                return res.end(err);
              }
              let content = `<h1>Index of ${requestPath}</h1>`;
              files?.forEach(file => {
                let itemLink = path.join(requestPath, file);
                try {
                  const stat = fs.statSync(path.join(requestPath, file));
                  if (stat && stat.isDirectory()) {
                    itemLink = path.join(itemLink, '/');
                  }
                  content += `<p><a href='${itemLink}'>${file}</a></p>`;
                } catch (error) {

                }
              });
              const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>静态资源</title>
                </head>
                <body>
                  ${content}
                </body>
                </html>
              `
              res.writeHead(200, {
                'Content-Type': 'text/html'
              });
              res.end(html);
            });
          } else {
            fs.readFile(requestPath, (err, data) => {
              let fileType = ''
              if (staticPath) {
                fileType = '.' + req.url.split('.')[req.url.split('.').length - 1]
              }
              if (err) {
                fs.readFile(path.join(__dirname, '../static/404.html'), (err, data) => {
                  res.writeHead(404, { 'Content-Type': 'text/html;charset=UTF-8' })
                  res.end(data)
                })
                return
              } else {
                res.writeHead(200, { 'Content-Type': getMime(fileType) ? getMime(fileType) : 'text/plain;charset=UTF-8' });
                res.end(data)
              }
            })
          }
        }
      });
      //get请求处理
    } else if (requestCallback[req.url].path === req.url
      && requestCallback[req.url].method === req.method.toLowerCase()
      && requestCallback[req.url].method === 'get'
    ) {
      req.body = parseObj.query
      // res.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
      status = 200
      res.send = send.bind(res)

      requestCallback[req.url].cal(req, res)
      //处理post 二进制文件
    } else if (requestCallback[req.url].path === req.url
      && requestCallback[req.url].method === req.method.toLowerCase()
      && requestCallback[req.url].method === 'post'
      && requestCallback[req.url].file === true) {

      res.send = send.bind(res)
      let uploadPath = path.join(__dirname, '../../../' + requestCallback[req.url].postPath)
      fs.exists(uploadPath, async function (exists) {
        if (!exists) {
          await fs.mkdirSync(uploadPath);
          callback()
        } else {
          callback()
        }
      });
      function callback() {
        let filesArr = []
        //创建表单解析对象
        const form = new formidable.IncomingForm();
        if (!/multipart\/form-data/g.test(req.headers['content-type'])) {
          res.writeHead(404, { 'Content-Type': 'application/json;charset=UTF-8' });
          status = 404
          res.send('请设置Content-Type为multipart/form-data')
          return
        }
        //配置上传文件的目录 路径推荐写绝对路径
        form.uploadDir = uploadPath;
        //保留上传文件的后缀
        form.keepExtensions = true;
        form.on('file', function (filed, file) {
          filesArr.push(file)
        })

        //解析表单
        form.parse(req, (err, fields, files) => {
          //err错误对象 如果解析失败包含错误信息 解析成功nan
          // fields 存储普通请求参数 对象类型 {属性：值}  保存除了二进制文件外的其他表单数据
          // files 对象类型  存储上传的文件信息 

          let fileUrl = []
          if (filesArr.length === 1) {
            filesArr[0].path = req.headers.origin.split('://')[0] + '://' + req.headers.host + '/' + filesArr[0].path.split('\\')[filesArr[0].path.split('\\').length - 1]
            req.file = filesArr[0]
          } else {
            filesArr.forEach((item) => {
              item.path = req.headers.origin.split('://')[0] + '://' + req.headers.host + '/' + item.path.split('\\')[item.path.split('\\').length - 1]
            })
            req.file = filesArr
          }
          res.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
          status = 200
          requestCallback[req.url].cal(req, res)
        })
      }
      //post请求处理(表单)
    } else if (requestCallback[req.url].path === req.url
      && requestCallback[req.url].method === req.method.toLowerCase()
      && requestCallback[req.url].method === 'post'
      && requestCallback[req.url].file === false) {

      let postData = ''
      req.on('data', (chunk) => {
        postData += chunk
      })
      req.on('end', () => {
        var dataObj = qs.parse(postData.toString(), true)
        req.body = dataObj
        res.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
        status = 200
        res.send = send.bind(res)
        requestCallback[req.url].cal(req, res)
      })
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html;charset=UTF-8' })
      fs.readFile(path.join(__dirname, '../static/404.html'), (err, data) => {
        res.end(data)
      })
    }
  })
  return this
}

module.exports = open
