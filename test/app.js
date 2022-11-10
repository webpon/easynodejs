const easy = require('../lib/index.js')
const {obj: jsonData, option: j2mOption} = require(`../lib/j2m/test/index.js`)
//开启服务器,open的参数便是要开启的服务器端口，
//如果该端口已被使用则可能报错，更换端口即可
let app = easy.open(9000)
//处理跨域，默认关闭
app.cors()
//托管静态资源
app.static('./')
app.get('/').do((req, res) => {
    const html = `
    <head>
        <meta charset="UTF-8">
    </head>
    <pre>
        <a href="/index.html">访问静态文件</a>
        <a href="/j2m">根据已有的数据模拟出相似的数据</a>
    </pre>
    `
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.send(html)
})
app.get('/ajax').do((req, res) => {
    //req.body是请求参数，
    //这是经过处理并且加到req.body上的
    console.log(req.body);
    res.send(req.body)
})
app.get('/j2m').do((req, res) => {
    const data = easy.j2m(jsonData, j2mOption)
    res.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
    res.send(JSON.stringify({
        "自动生成的数据，每次刷新都不一样哟": data,
        "原数据": jsonData,
    }, null, 2))
})
app.post('/upload').do((req, res) => {
    console.log(req.body);
    res.send(req.body)
})
//如果post方法有两个参数，则定义为处理静态文件，
//比如图片，第一个参数是路径，第二个参数是保存在服务器的路径,
//如果该路径目录不存在，会自动生成
app.post('/uploads', './static').do(
    (req, res) => {
        console.log(req.file);
        res.send(req.file)
    }
)
