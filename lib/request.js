let request = {
  methodConfig: {
    urlName: '',
    currentType: '',
    file: false,
    postPath: ''
  },
  do(cal) {
    easy_global_requestCallback[this.methodConfig.urlName] = {
      path: this.methodConfig.urlName,
      cal,
      method: this.methodConfig.currentType,
      file: this.methodConfig.file,
      postPath: this.methodConfig.postPath
    }
    return this
  },
  get(url) {
    //当客户端发送get请求的时候
    this.methodConfig.urlName = url + 'get'
    this.methodConfig.currentType = 'get'
    this.methodConfig.file = false,
      this.methodConfig.postPath = ''
    return this
  },
  post(url, uploadPath) {
    //当客户端发送post请求的时候
    this.methodConfig.urlName = url + 'post'
    if (uploadPath) {
      this.methodConfig.currentType = 'post'
      this.methodConfig.file = true,
        this.methodConfig.postPath = uploadPath
    } else {
      this.methodConfig.currentType = 'post',
        this.methodConfig.file = false,
        this.methodConfig.postPath = ''
    }
    return this
  }
}
module.exports = request