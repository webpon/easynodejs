/**
 * 获取系统 ip
 * @returns [string]
 */
function getOsIp() {
  let gatewayIp
  try {
    const gateway = require('default-gateway').v4.sync()
    gatewayIp = require('address').ip(gateway && gateway.interface) // 获取默认IP
  } catch (error) { // 获取默认网关错误
    const obj = require(`os`).networkInterfaces()
    const ipObj = Object.keys(obj).reduce((res, cur, index) => {
      return [...res, ...obj[cur]]
    }, []).filter(item => item.family === `IPv4`)[0] || {}
    gatewayIp = ipObj.address
  }
  return gatewayIp || `127.0.0.1`
}

module.exports = {
  getOsIp,
}
