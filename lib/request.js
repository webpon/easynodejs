let request = {
  do (cal) {
    requestCallback[urlName] = {
      path: urlName,
      cal,
      method: currentType,
      file,
      postPath
    }
    return this
  },
  get (url) {
    //当客户端发送get请求的时候
    urlName = url + 'get'
    currentType = 'get'
    file = false,
      postPath = ''
    return this
  },
  post (url, uploadPath) {
    //当客户端发送post请求的时候
    urlName = url + 'post'
    if (uploadPath) {
      currentType = 'post'
      file = true,
        postPath = uploadPath
    } else {
      currentType = 'post',
        file = false,
        postPath = ''
    }
    return this
  }
}
module.exports = request