/**
 * @description 导出通用配置
 */
module.exports = {
  // 标题，此项修改后需要重启项目！！！ (包括初次加载雪花屏的标题 页面的标题 浏览器的标题)
  title: '敏捷流程开发平台',
  // 标题分隔符
  titleSeparator: ' - ',
  // 标题是否反转
  // 如果为false: "page - title"
  // 如果为ture : "title - page"
  titleReverse: false,
  // 简写
  abbreviation: 'AgileBPM',
  // 默认应用的编码，当没有登录过时，使用默认应用系统 编码
  defaultAppCode: 'bpmDevPlatform',
  defaultAppSecret: '1',
  // pro版本copyright可随意修改
  copyright: '大世同舟',
  // 缓存路由的最大数量
  keepAliveMaxNum: 20,
  // 路由模式，是否为hash模式
  isHashRouterMode: false,
  // 不经过token校验的路由，白名单路由建议配置到与login页面同级，如果需要放行带传参的页面，请使用query传参，配置时只配置path即可
  routesWhiteList: [
    '/login',
    '/register',
    '/callback',
    '/404',
    '/403',
    '/405',
    'TempLink',
    'BpmExternalEventTaskComplete',
    'BpmExternalEventFlowStart',
    'TempLinkResultPage',
    '/writeToken',
  ],
  // 加载时显示文字
  loadingText: '正在加载中...',
  //请求后台时，token的名称
  tokenName: 'Authorization',
  // token 前缀
  tokenPrex: 'Bearer ',
  // token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: 'ab-token',
  // token存储位置localStorage sessionStorage cookie
  storage: 'localStorage',
  // 是否禁用token 刷新，如果需要定时刷新的token，需要设置为 false
  disableRefreshToken: false,
  // token失效是否跳转登录【整合类项目，无权限时，不处理，由外部处理】
  loginTimeOutIsJumpLoginPage: true,
  // token失效回退到登录页时是否记录本次的路由（是否记录当前tab页）
  recordRoute: true,
  // 是否开启logo，不显示时设置false，请填写src/icon/svg路径下的图标名称
  // 如需使用内置RemixIcon图标，请自行去logo组件切换注释代码(内置svg雪碧图较大，对性能有一定影响)
  logo: '', //如果填写了logo。则无论明亮或暗黑，使用同一个logo。不填写则代表使用下方两种LOGO，根据背景自动变换
  lightLogo: 'lightLogo', //明亮主题下的LOGO， 背景浅 LOGO深
  darkLogo: 'darkLogo', //暗黑主题下的LOGO， 背景深 LOGO浅
  // 语言类型zh、en
  i18n: 'zh',
  // 消息框消失时间
  messageDuration: 3000,
  // 在哪些环境下显示高亮错误 ['development', 'production']
  errorLog: 'development',
  // 是否开启登录拦截
  loginInterception: true,
  // intelligence(前端导出路由)和 all(后端导出路由)两种方式
  authentication: 'intelligence',
  // 是否支持游客模式，支持情况下，访问白名单，可查看所有asyncRoutes
  supportVisit: false,
  // 是否开启roles字段进行角色权限控制(如果是all模式后端完全处理角色并进行json组装，可设置false不处理路由中的roles字段)
  rolesControl: false,
  // vertical column comprehensive common布局时是否只保持一个子菜单的展开
  uniqueOpened: false,
  // vertical column comprehensive common布局时默认展开的菜单path，使用逗号隔开建议只展开一个，true全部展开，false/[]不展开
  defaultOpeneds: ['无效'], // 这里是无效的。默认只取后台的菜单 defaultOpenNames
  // 需要加loading层的请求，防止重复提交
  debounce: ['doEdit'],
  // 分栏布局和综合布局时，是否点击一级菜单默认开启二级菜单(默认第一个，可通过redirect自定义)
  openFirstMenu: true,
  //是否开启请求签名加密
  isEncrySign: true,
  // 签名加密密钥
  leEncryptionKey: '4HJKL68LC0ELVWO0',
}
