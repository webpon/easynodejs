const deepmerge = require(`deepmerge`)
const clonedeep = require('lodash.clonedeep')
const util = require(`./util.js`)
const {defaultOption} = require(`./rule.js`)

function j2m(obj, option) {
  option = deepmerge(defaultOption(), option) // todo: 不把 option 复制一份会出现异常
  obj = clonedeep(obj)
  
  const flat = {}
  const rootData = obj
  
  const res = handleTpl({
    value: toTpl({value: obj}),
  })
  return res

  /**
   * 转换对象为模板
   * @param {*} param0 
   * @returns 
   */
  function toTpl({value, prevPath}) { // 展开对象
    const valueType = util.isType(value)
    const result = {object: {}, array: []}[valueType]
    if(!result) { // 基本数据类型
      return value
    } else { // 复合类型
      Object.entries(value).forEach(([key, val]) => {
        const path = prevPath ? `${prevPath}.${key}` : key;
        const isDeep = [`object`, `array`].includes(util.isType(val))
        if(isDeep) {
          result[key] = Object.keys(val).length // 不处理空内容
            ? toTpl({value: val, prevPath: path}) 
            : val
        } else {
          flat[path] = val
          const ruleList = util.getMockTag({
            rootData,
            key,
            value: val,
            path,
            option,
          })
          path === option.log.path && console.log([...ruleList].reverse())
          result[key] = ruleList[0].rule.tpl || val
        }
      })
    }
    return result
  }
  
  /**
   * 处理带规则的 key
   * @param {*} param0 
   * @returns 
  */
  function handleTpl({value}) {
    if(option.min === false) {
      return value
    }
    const valueType = util.isType(value)
    const result = {object: {}, array: []}[valueType]
    if(!result) { // 基本数据类型
      return value
    } else { // 复合类型
      Object.entries(value).forEach(([key, val]) => {
        const isDeep = [`object`, `array`].includes(util.isType(val))
        if(isDeep && (Object.keys(val).length === 0)) { // 不处理空内容
          result[key] = val
        } else if(util.isType(val, `array`)) {
          if(option.min) {
            const newKey = isNaN(Number(key)) ? `${key}|${option.keyRule.array}` : key
            result[newKey] = handleTpl({value: [
              val[
                // 获取字符数最多的那条数字作为模板
                val.map(item => JSON.stringify(item).length)
                  .reduce((acc, cur, index) => {
                    if(acc.length < cur) {
                      acc.length = cur
                      acc.index = index
                    }
                    return acc
                  }, {index: 0, length: 0}).index
              ]
            ]})
          } else {
            result[key] = handleTpl({value: val})
          }
        } else if(util.isType(val, `object`) && (Boolean(key.match(/^\d+$/)) === false)) {
          result[option.keyRule.object ? `${key}|${option.keyRule.object}` : key] = handleTpl({value: val})
        } else {
          result[key] = handleTpl({value: val})
        }
      })
    }
    return result
  }
}

module.exports = j2m