/**
 * 获取规则列表
 */
function getRuleList(userRule = []) {
  // 根据 mockjs 的对象编写的规则
  const mockJsTpl = {
    address: [
      {
        tag: [`address.region`],
        tpl: `@region()`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^(东北|华北|华东|华中|华南|西南|西北)$/, 3]
          ],
        },
      },
      {
        tag: [`address.province`],
        tpl: `@province()`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^[\u4e00-\u9fa5]{2}省$/, 2]
          ],
        },
      },
      {
        tag: [`address.city`],
        tpl: `@city()`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^[\u4e00-\u9fa5]{2}市$/, 2]
          ],
        },
      },
      {
        tag: [`address.county`],
        tpl: `@county()`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^[\u4e00-\u9fa5]{2}县$/, 2]
          ],
        },
      },
      {
        tag: [`address.zip`],
        tpl: `@zip()`,
        info: {
          type: [`string`, `integer`],
          key: [],
          value: [
            [/^[1-9][0-9]{5}$/, 3]
          ],
        },
      },
    ],
    basic: [
      {
        tag: [`basic.boolean`, `basic.bool`],
        tpl: `@bool`,
        info: {
          type: `boolean`,
          key: [],
          value: [],
        },
      },
      {
        tag: [`basic.integer`, `basic.int`],
        tpl: `@integer(18,99)`,
        info: {
          type: [`integer`],
          key: [
            [/^age$/, 2],
          ],
          value: [
            [/^\d+$/, 2],
          ],
        },
      },
      {
        tag: [`basic.integer`, `basic.int`],
        tpl: `@integer()`,
        info: {
          type: [`integer`],
          key: [
          ],
          value: [
          ],
        },
      },
      {
        tag: [`basic.natural`],
        tpl: `@natural()`,
        info: {
          type: [`integer`, `float`],
          key: [
          ],
          value: [
            [/^-/, 2],
          ],
        },
      },
      {
        tag: [`basic.float`],
        tpl: `@float()`,
        info: {
          type: `float`,
          key: [],
          value: [],
        },
      },
      {
        tag: [`basic.character`, `basic.char`],
        tpl: `@character()`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^\w$/, 2]
          ],
        },
      },
      {
        tag: [`basic.string`, `basic.str`],
        tpl: `@string()`,
        info: {
          type: `string`,
          key: [],
          value: [
          ],
        },
      },
    ],
    color: [
      {
        tag: [`color.color`, `color.hex`],
        tpl: `@hex`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^#[0-9a-fA-F]{6}$/, 3]
          ],
        },
      },
      {
        tag: [`color.rgb`],
        tpl: `@rgb()`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^rgb\(\d{1,3},.*\)$/, 3]
          ],
        },
      },
      {
        tag: [`color.rgba`],
        tpl: `@rgba()`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^rgba\(\d{1,3},.*\)$/, 3]
          ],
        },
      },
      {
        tag: [`color.hsl`],
        tpl: `@hsl()`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^hsl\(\d{1,3},.*\)$/, 3]
          ],
        },
      },
    ],
    date: [
      {
        tag: [`date.date`],
        tpl: `@date("yyyy-MM-dd")`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^(?:[1-9]\d)\d\d.(?:(?:0[1-9])|(?:1[0-2])).(?:(?:[0-2][1-9])|(?:[1-3][0-1]))\D{0,1}$/, 3]
          ],
        },
      },
      {
        tag: [`date.datetime`],
        tpl: `@datetime("yyyy-MM-dd HH:mm:ss")`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^(?:[1-9]\d)\d\d.(?:(?:0[1-9])|(?:1[0-2])).(?:(?:[0-2][1-9])|(?:[1-3][0-1]))\D{0,1} (?:(?:[0-2][0-3])|(?:[0-1]\d)).[0-5]\d.[0-5]\d\D{0,1}$/, 3]
          ],
        },
      },
      {
        tag: [`date.time`],
        tpl: `@time("HH:mm:ss")`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^(?:(?:[0-2][0-3])|(?:[0-1]\d)).[0-5]\d.[0-5]\d$/, 3]
          ],
        },
      },
    ],
    helper: [],
    image: [
      {
        tag: [`image.image`, `image.img`],
        tpl: `@image()`,
        info: {
          type: `string`,
          key: [
          ],
          value: [
            [/\/(\w+\.(?:png|jpg|gif|ico|bmp))$/, 3],
          ],
        },
      },
      {
        tag: [`image.dataImage`],
        tpl: `@image()`,
        info: {
          type: `string`,
          key: [
          ],
          value: [
            [/^data:image\//, 3],
          ],
        },
      },
    ],
    misc: [
      {
        tag: [`misc.guid`, `misc.uuid`],
        tpl: `@guid()`,
        info: {
          type: `string`,
          key: [
          ],
          value: [
            [/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/, 3],
          ],
        },
      },
      {
        tag: [`misc.id`],
        tpl: `@id`,
        info: {
          type: `string`,
          key: [
          ],
          value: [
            [/^([0-9]){18}(X)?$/, 3],
          ],
        },
      },
    ],
    name: [
      {
        tag: [`name.cname`],
        tpl: `@cname`,
        info: {
          type: `string`,
          key: [
            [/^userName$/i, 2],
            [/^fullName$/i, 2],
          ],
          value: [
            [/^[\u4e00-\u9fa5]{2,3}$/, 1.5],
          ],
        },
      },
    ],
    text: [
      {
        tag: [`text.cparagraph`],
        tpl: `@cparagraph`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^[^\x00-\xff]{19,}$/],
          ],
        },
      },
      {
        tag: [`text.csentence`],
        tpl: `@csentence(12,18)`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^[^\x00-\xff]{12,18}$/],
          ],
        },
      },
      {
        tag: [`text.ctitle`],
        tpl: `@ctitle(5,11)`,
        info: {
          type: `string`,
          key: [
            [/title$/i],
          ],
          value: [
            [/^[^\x00-\xff]{4,11}$/, 2],
          ],
        },
      },
    ],
    web: [
      {
        tag: [`web.email`],
        tpl: `@email`,
        info: {
          type: `string`,
          key: [],
          value: [
            [/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, 3]
          ],
        },
      },
    ],
  }
  const list = userRule.concat(...Object.values(mockJsTpl)).map(item => {
    item.info.type = typeof(item.info.type) === `string` 
      ? [item.info.type] 
      : (item.info.type || ``)
    item.info.key = [
      // 自动把 tag 中的词作为权重为 2 的全匹配正则
      ...new Set(
        item.tag
          .map(item => item.split(`.`))
          .flat()
          .map(str => [new RegExp(`^${str}$`), 2])
      ),
      ...item.info.key,
    ]
    const strTpl = typeof(item.tpl) === `string` ? String(item.tpl) : undefined
    item.tpl = strTpl
    ? function(){return strTpl}
    : item.tpl
    
    return item
  })
  return [...list].reverse()
}

/**
 * 生成方法的配置
 */
function defaultOption() {
  const option = {
    /**
      log 选项
    */
    log: {
      // 打印指定 path 的 rule 匹配情况, 需要精确到最后一个key
      path: undefined,
    },
    
    /**
      指定 code 字段
      
      被指定的字段不会新的数据, 而是从已有数据中选择
      
      例如:
      - 原始数据:
      ``` js
      {
        like: [
          {
            name: `张三`,
          },
          {
            name: `李四`,
          },
        ],
      }
      ```
      - 指定前:
      ``` js
      {
        like: [
          {
            name: `@cname`,
          },
        ],
      }
      ```
      - 指定后: `{code: [`like.name`]}`
      ``` js
      {
        like: [
          {
            name: `@pick('张三', '李四')`,
          },
        ],
      }
      ```
    */
    code: [],
    
    /**
      是否处理数组中的所有项为单个模板
      - 否
      不进行类型统一推测
      
      - 是 - 默认
      自动根据平均数、众数等规则获取最可能的特征生成单个模板
    */
    min: true,
    
    /**
      配置 key 的规则
    */
    keyRule: {
      /**
        当 option.min 为 true 时, 随机生成 x-y 条数据
      */
      array: `3-7`,
      
      /**
        设置对象的生成规则
      */
      object: undefined,
    },
  }
  return option
}

module.exports = {
  getRuleList,
  defaultOption,
}