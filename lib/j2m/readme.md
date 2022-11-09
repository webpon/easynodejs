# j2m
转换 json 数据为 mockjs 模板.

## 方案
遍历 json, 如果是基本类型的值, 则对 key 和值进行分析得出结果.
例如:

``` js
key = `userName`
value = `张三`

```

| key | type | value |
| - | - | - |
| userName | string | 张三|

``` js
rule = {
  /** @type {string[]} mockjs 方法位置, 或自定义标签 */
  tag: [`name.cname`],
  
  /** @type {string} mockjs 占用符 */
  tpl: `@cname`,
  
  /** @type {object} 哪些信息项可以匹配该占位符 */
  info: {
    /** @type {string|string[]} value 的值类型 string, 类型 */
    type: `string`,
    
    /** @type {array[]} key 的特征, tag 中的每个词会自动作为 key 的匹配项 */
    key: [
      [/^name$/i], // 以 name 为后缀
    ],
    
    /** @type {array[]} value 的特征 */
    value: [
      [/^[\u4e00-\u9fa5]{2,4}$/, 2], // 2-4 个中文汉字
    ],
  },
}

// info 中的每条规则权值为 1, 当为数组时, 每个数组的第一项是匹配规则, 第二项是权值, 默认为 1
```

如果有3+个数据源, 去掉最高最低取平均值.

配置技巧:
- 几乎确定的情况, 比如邮箱, url这些是可以确定的, 这时候应写确定的规则, 并设置较高权重
- 不太确定的情况, 比如中文名和地区名, 这时候规则应以最常见方式去写规则, 例如名字可能有4个字的, 但只需考虑2-3个字的即可
- 如果 key 有明显标志时, 请配置 key 的标志
- 如果 value 的类型确认时, 请配置 type
- 当计算出来的权重相同时, 后面的规则会被优先获取


- 在 `rule.js` 中完善 mockjs 的占位符特征列表
- 使用 `node test\index.js` 运行程序

- [在线文档](http://wll8.gitee.io/mockjs-examples/)
- [random 方法]([node_modules/mockjs/src/mock/random/index.js](https://github.com/nuysoft/Mock/tree/refactoring/src/mock/random))


占位符完成度情况
- [x] address
  - [x] address.region
  - [x] address.province
  - [x] address.city
  - [x] address.county
  - [x] address.zip
- [x] basic
  - [x] basic.boolean
  - [x] basic.bool
  - [x] basic.natural
  - [x] basic.integer
  - [x] basic.int
  - [x] basic.float
  - [x] basic.character
  - [x] basic.char
  - [x] basic.string
  - [x] basic.str
  - [x] basic.range - 忽略
- [x] color
  - [x] color.color
  - [x] color.hex
  - [x] color.rgb
  - [x] color.rgba
  - [x] color.hsl
- [ ] date
  - [x] date.date
    - [x] @date("yyyy-MM-dd")
  - [x] date.time
    - [x] @time("HH:mm:ss")
  - [x] date.datetime
    - [x] @datetime("yyyy-MM-dd HH:mm:ss")
  - [x] date.now - 忽略
- [x] helper - 忽略
  - [x] helper.capitalize
  - [x] helper.upper
  - [x] helper.lower
  - [x] helper.pick
  - [x] helper.shuffle
  - [x] helper.order
- [x] image
  - [x] image.image
  - [x] image.img
  - [x] image.dataImage
- [ ] misc
  - [x] misc.d4 - 忽略
  - [x] misc.d6 - 忽略
  - [x] misc.d8 - 忽略
  - [x] misc.d12 - 忽略
  - [x] misc.d20 - 忽略
  - [x] misc.d100 - 忽略
  - [x] misc.guid
  - [x] misc.uuid
  - [x] misc.id
  - [ ] misc.increment
  - [ ] misc.inc
- [ ] name
  - [ ] name.first
  - [ ] name.last
  - [ ] name.name
  - [ ] name.cfirst
  - [ ] name.clast
  - [x] name.cname
- [ ] text
  - [ ] text.paragraph
  - [x] text.cparagraph
  - [ ] text.sentence
  - [ ] text.csentence
  - [ ] text.word
  - [ ] text.cword
  - [ ] text.title
  - [x] text.ctitle
- [ ] web
  - [ ] web.url
  - [ ] web.protocol
  - [ ] web.domain
  - [ ] web.tld
  - [ ] web.email
  - [ ] web.ip