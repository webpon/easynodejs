const { getRuleList } = require(`./rule.js`)

/**
 * 获取类型对应的值
 */
function getTypeValue(type) {
  return {
    object: {},
    array: [],
    undefined: undefined,
    number: 0,
    null: null,
  }[type]
}

/**
 * 根据 key 和 value 获取规则信息
 */
function getMockTag({
  rootData,
  key,
  value,
  path,
  option,
}) {
  /**
   * @param {*} param0.position path 的截取位置
   * @returns 
   */
  function headleData({position}) {
    let res = {
      data: deepGet(
        rootData,
        path.split(`.`).reverse().splice(position).reverse(),
      ),
    }
    let data = res.data
    
    // 如果数组中的值是对象时, 取对象中对应 key 的值
    if(isType(data, `array`) && isType(data[0], `object`)) {
      data = data.map(item => item[key])
    }
    
    res = {
      ...(
        // 是数组并且每项都是数字或字符串
        isType(data, `array`) && data.every(item => (isType(item, `number`) || isType(item, `string`)) )
        ? computeArray(data) 
        : undefined
      ),
      ...res
    }
    return res
  }
  
  const prev = headleData({position: 2})
  const cur = headleData({position: 1})
  /**
   如果上级数据为数组时, 会计算对应 key 的以下值以供使用
   prev.最大值
   prev.最小值
   prev.最大长度
   prev.最小长度
   
   如果当前数据为数组时, 会计算对应 key 的以下值以供使用
   cur.最大值
   cur.最小值
   cur.最大长度
   cur.最小长度

   去干扰模式: 根据数组中多个值的特征, 去除最大最小获取平均特征, 优先使用 cur
   number 时去除最高和最低的, 算出平均数, 丢给 matchList
   string 时去除最长和最短的, 算出众数, 丢给 matchList
   
  */
  
  const newValue = (option.min && (cur.feat || prev.feat)) || value
  let type = isType(newValue)
  // 细化 number 类型为 float integer
  type = type === `number`
    ? (Number.isInteger(newValue) ? `integer` : `float`)
    : type
    
  const ruleList = getRuleList(option.rule)
  const ruleListRes = ruleList.map((rule, index) => {
    const typeFeat = Number(rule.info.type.includes(type))
    const keyFeat = matchList({ruleList: rule.info.key, str: key})
    const valueFeat = matchList({ruleList: rule.info.value, str: newValue})
    
    // 向 tpl 函数传入遍历 json 获取到的信息, 以供修改化生成模板
    rule.tpl = rule.tpl({
      rootData,
      prev,
      cur,
      key,
      value,
      newValue,
      path,
    })
    
    // 针对 number 类型以及字符串形式的 tpl 进行优化, 设置范围
    // 对于 @float @integer @natural 才支持, 否则可能导致参数错误
    if(option.min && isType(rule.tpl, `string`) && (cur || prev) && isType(newValue, `number`) && rule.tpl.match(/^@(float|integer|natural)/) ) {
      const min = cur.min || prev.min
      const max = cur.max || prev.max
      if(((min && max) && (min !== max))) {
        const dmin = String(min).lastIndexOf(`.`) > 0 ? String(min).lastIndexOf(`.`) : 0 // 小数点位
        const dmax = String(max).lastIndexOf(`.`) > 0 ? String(max).lastIndexOf(`.`) : 0
        rule.tpl = rule.tpl.match(/^@float/) 
          ? (rule.tpl.replace(/\(.*/, `(${min}, ${max}, ${dmin}, ${dmax})`))
          : (rule.tpl.replace(/\(.*/, `(${min}, ${max})`))
        
      }
    }
    
    // 如果指定的 key 为 code 时, 则 tpl 替换为 cur 转换后的 @pick
    if(option.code.includes(path.replace(/.\d+/g, ``))) {
      // 如果原数据包含重复项, 则原样 @pick, 否则进行去重, 但不保证生成的数据唯一
      
      let dist
      if(isType(cur.data, `array`)) {
        dist = cur.data
      }
      if(isType(cur.data, `object`)) {
        dist = prev.data.map(item => item[key])
      }
      if(dist) {
        const removeDouble = [...new Set(dist)]
        const newData = removeDouble.length !== dist.length ? dist : removeDouble
        rule.tpl = `@pick(${newData.join(`, `)})`
      }
    }
    return {
      rule,
      index,
      sum: typeFeat + keyFeat + valueFeat,
      _sum: {typeFeat, keyFeat, valueFeat},
    }
    
  }).sort(({sum: a}, {sum: b}) => b - a)
  return ruleListRes
}

/**
 * 使用规则列表对字符串 str 校验
 * @param {*} param0 
 */
function matchList({ruleList, str}) {
  const res = ruleList.reduce((res, [re, weight = 1]) => {
    let fn = {
      regexp: str => String(str).match(re),
      function: re,
      boolean: () => re,
    }[isType(re)]
    const ok = fn(str) ? weight : 0
    ok && res.accLength++
    res.acc = res.acc + ok
    return res
  }, {
    str,
    acc: 0, // 总权重
    accLength: 0, // 共匹配多少条规则
  })
  return res.acc / res.accLength || 0
}

function computeArray(raw) {
  const res = raw.map(item => {
    // 如果是 number 时取值, 字符串时取 length
    return typeof(item) === `number` ? item : item.length
  }).reduce((acc, cur, index, arr) => {
    if(acc.max < cur) {
      acc.max = cur
      acc.maxIndex = index
    }
    if(acc.min > cur) {
      acc.min = cur
      acc.minIndex = index
    }
    if(arr.length > 2 && (index === arr.length - 1)) { // 循环结束
      arr.splice(acc.maxIndex, 1) // 去掉最大
      arr.splice(acc.minIndex, 1) // 去掉最小
      acc.avg = arr.reduce((acc, cur) => acc+cur, 0) / arr.length
      // 根据平均值从数组中获取一个适合的项
      acc.feat = typeof(raw.filter(item => item)[0]) === `number` 
        // 查找平均数
        ? Number.isInteger(arr[0]) // 如果是小数时保留小数位, 整型时进行四舍五入
          ? Math.round(acc.avg)
          : roundFun(acc.avg, String(acc.avg).lastIndexOf(`.`))
        // 查找众数
        : raw.reduce((acc, cur, index, arr) => {
          const length = arr.filter(item => item === cur).length
          if(acc.length < length) {
            acc.length = length
            acc.value = cur
          }
          return acc
        }, {length: 0, value: undefined}).value
    }
    acc.arr = arr
    return acc
  }, {max: -Infinity, maxIndex: -1, min: Infinity, minIndex: -1, avg: 0, arr: [], feat: undefined})
  return res
}

function deepGet(object, keys = [], defaultValue) { // 深层获取对象值
  let res = (!Array.isArray(keys)
    ? keys
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.')
    : keys
  ).reduce((o, k) => (o || {})[k], object)
  return res !== undefined ? res : defaultValue
}

function flatObj(value, currentKey) { // 展开对象
  let result = {};
  Object.keys(value).forEach(key => {
    const tempKey = currentKey ? `${currentKey}.${key}` : key;
    if (typeof value[key] !== "object") {
      result[tempKey] = value[key];
    } else {
      result = { ...result, ...flatObj(value[key], tempKey) };
    }
  });
  return result;
}

function isType(data, type = undefined) { // 判断数据是否为 type, 或返回 type
  const dataType = Object.prototype.toString.call(data).match(/\s(.+)]/)[1].toLowerCase()
  return type ? (dataType === type.toLowerCase()) : dataType
}

/**
 * 保留 n 位小数, 类型不变
 * @param {*} value 
 * @param {*} n 
 * @returns 
 */
function roundFun(value, n) {
  return Math.round(value*Math.pow(10,n))/Math.pow(10,n);
}

module.exports = {
  roundFun,
  computeArray,
  deepGet,
  flatObj,
  getTypeValue,
  getMockTag,
  isType,
}