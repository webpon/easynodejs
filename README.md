## easynodejs 是什么?

一个简单、功能丰富、高性能的一款现代 node.js 框架

## 如何使用？

- 第一步，
  ```javascript
  npm i easynodejs
  ```
- 第二步，引入 easynodejs 模块
  ```javascript
  const easy = require("easynodejs");
  ```
  ##easynodejs 有哪些功能？
- 超级简单的 api，让你的代码只需要极少的代码便能跑起来
- 使用链式调用的方式注册回调函数，让代码更加直观，拒绝回调地狱
- 只需要简单几行代码便能跑一个简单的服务器：

  ```javascript
  const easy = require("easynodejs");
  //开启服务器,open的参数便是要开启的服务器端口，
  //如果该端口已被使用则可能报错，更换端口即可
  let app = easy.open(9000);
  //处理跨域，默认关闭
  app.cors();
  //托管静态资源
  app.static("./static");
  app.get("/").do((req, res) => {
    res.send("首页");
  });
  app.get("/ajax").do((req, res) => {
    //req.body是请求参数，
    //这是经过处理并且加到req.body上的
    console.log(req.body);
    res.send(req.body);
  });
  app.post("/ajax").do((req, res) => {
    console.log(req.body);
    res.send(req.body);
  });
  //如果post方法有两个参数，则定义为处理静态文件，
  //比如图片，第一个参数是路径，第二个参数是保存在服务器的路径,
  //如果该路径目录不存在，会自动生成
  app.post("/uploads", "./static").do((req, res) => {
    console.log(req.file);
    res.send(req.file);
  });
  ```

### 静态资源托管 app.static

我们的 html、css、js 图片都是从服务器获取的，那么这是就要开启静态资源托管了

```javascript
//参数是要托管的路径，./相对于项目根目录
//输入以下代码，我们便可以访问项目根目录下的静态文件了
//，你可以把一个文件放到static下，然后
//通过http://域名:端口/文件名访问
app.static("./static");
```

### 处理跨域 app.cors

```javascript
app.cors();
```

### 生成数据 easy.j2m

```javascript
easy.j2m(原始数据, 配置项);
```
在接口测试阶段，造数据是一个十分浪费时间并且枯燥的事情。使用此方法，你就可以基于已有的数据随机生成若干数据，不需要像 mockjs 那样写数据模板。

详情参考 [lib/j2m/readme.md](lib/j2m/readme.md)

## 在当前 nodesjs 生态这么完善的情况下为什么还要新打造一个框架?  

相信很多人都会提出以上疑问，作者使用过原生 nodejs、express、koa    
经过体验，nodejs 的代码量、express 的回调地狱、koa 也不够简洁，    
仍然需要依赖各种插件，比如对上传文件的处理，对 post 请求的处理等，    
由于前端开发人员在后端方面的用得比较少，所以大量的插件会记不住    
所以想写一个代码量极少、常用功能(例如：post 请求处理，静态资源托管、文件上传等等）都有 api 调用，    
而无需自己找各种插件、优化代码结构的框架  

 
_向在前端领域做出贡献的前辈致敬_

当然该框架仍然是一个非常年轻的框架，后续的功能或者漏洞会不断完善的  
##有问题反馈  
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

- **微信(wx2249096563)**
- github：https://github.com/webpon/easynodejs
- blog：https://github.com/webpon/blog
