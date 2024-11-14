/**
 * @description 导出网络配置
 **/
module.exports = {
  // 开发环境是通过 vue.config.js 中代理来调用 .env.development 真实地址的，生产建议直接用/api通过Nginx路由参考文档http://doc.a5.tongzhouyun.com/guide/bootstrap.html
  // 开发环境去.env.development 文件改（在根目录），生产环境去.env.production 文件改，测试环境去.env.test 文件改
  baseURL: '/api', //开发环境 走的代理，所以不要改这里
  // 配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/json;charset=UTF-8',
  // 最长请求时间
  requestTimeout: 20000,
  // 操作正常code，支持String、Array、int多种类型
  successCode: [200, 0, '200', '0', 'Success', 'bpmConfirm'],
  // 数据状态的字段名称
  statusName: 'code',
  // 状态信息的字段名称
  messageName: 'msg',
}
