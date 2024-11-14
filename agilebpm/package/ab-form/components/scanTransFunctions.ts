/**
 * 所有的模板事件方法第一个参数都为扫码值
 * param即使有参数也是第2-n的参数
 * 返回的结果会覆盖原有的扫码值（必须有返回值，否则扫码值会被覆盖为空）
 */

const abScanTransMethods = {
  voidMethod: {
    name: '控制台打印扫码值（无参）',
    desc: '用于测试无参的模板事件，扫码值原路返回，并在控制台打印扫码值',
    param: [],
    execute: (scanValue: string) => {
      console.log('测试无参方法的扫码值为：', scanValue)
      return scanValue
    },
  },
  paramMethod: {
    name: '扫码值叠加前缀和后缀（有参）',
    desc: '用于测试有参的模板事件，将参数作为前缀和后缀叠加在扫码值上，并返回',
    param: [{ desc: '前缀编号' }, { desc: '后缀编号' }],
    execute: (scanValue: string, param1: any, param2: any) => {
      console.log(
        `测试无参方法的扫码值为：${scanValue}，参数1前缀编号为: ${param1},参数2后缀编号为: ${param2}`
      )
      return param1 + '-' + scanValue + '-' + param2
    },
  },
}

export default abScanTransMethods
