let request = {
  do (cal) {
    easy_global_requestCallback[easy_global_urlName] = {
      path: easy_global_urlName,
      cal,
      method: easy_global_currentType,
      easy_global_file,
      easy_global_postPath
    }
    return this
  },
  get (url) {
    //当客户端发送get请求的时候
    easy_global_urlName = url + 'get'
    easy_global_currentType = 'get'
    easy_global_file = false,
      easy_global_postPath = ''
    return this
  },
  post (url, uploadPath) {
    //当客户端发送post请求的时候
    easy_global_urlName = url + 'post'
    if (uploadPath) {
      easy_global_currentType = 'post'
      easy_global_file = true,
        easy_global_postPath = uploadPath
    } else {
      easy_global_currentType = 'post',
        easy_global_file = false,
        easy_global_postPath = ''
    }
    return this
  }
}
module.exports = request