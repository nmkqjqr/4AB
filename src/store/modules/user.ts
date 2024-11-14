/**
 * @description 登录、获取用户信息、退出登录、清除token逻辑，不建议修改
 */
import { useAclStore } from './acl'
import { useTabsStore } from './tabs'
import { useRoutesStore } from './routes'
import { useSettingsStore } from './settings'
import { UserModuleType } from '/#/store'
import { abTools, abUtil, registerApi } from '~/agilebpm'
import { getToken, removeToken, setToken } from '@/utils/token'
import {
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  removeGrid,
  setRefreshTime,
  getRefreshTime,
  removeRefreshTime,
} from '@/utils/refresh'
import { setApplication, removeApplication } from '@/utils/application'
import { resetRouter } from '@/router'
import { isArray, isString } from '@/utils/validate'
import {
  tokenName,
  defaultAppCode,
  defaultAppSecret,
  disableRefreshToken,
  loginTimeOutIsJumpLoginPage,
} from '@/config'
import { gp } from '@gp'
import cookie from 'js-cookie'
// 定义定时器
let timer: any = null

export const useUserStore = defineStore('user', {
  state: (): {
    currentSystem: string
    orgList: []
    subsystemList: []
    currentOrg: {}
    token: string
    abUser: {}
    username: string
    tenantSwitchExit: boolean
    subUserList: []
  } => ({
    token: getToken() as string,
    abUser: {},
    username: '游客',
    currentOrg: {},
    orgList: [],
    currentSystem: '',
    subsystemList: [],
    tenantSwitchExit: false,
    subUserList: [],
  }),
  getters: {
    getToken: (state) => state.token,
    getUsername: (state) => state.username,
    getAbUser: (state) => state.abUser,
    getCurrentOrg: (state) => state.currentOrg,
    getOrgList: (state) => state.orgList,
    getCurrentSystem: (state) => state.currentSystem,
    getSubsystemList: (state) => state.subsystemList,
    getTenantSwitchExit: (state) => state.tenantSwitchExit,
    getSubUserList: (state) => state.subUserList,
  },
  actions: {
    /**
     * @description 设置token
     * @param {*} token
     */
    setToken(token: string) {
      this.token = token
      setToken(token)
    },
    /**
     * @description 设置用户名
     * @param {*} username
     */
    setUsername(username: string) {
      this.username = username
    },
    setAbUser(abUser: any) {
      this.abUser = abUser
    },

    /**
     * @description 设置当前组织
     * @param {*} currentOrg
     */
    setCurrentOrg(currentOrg: any) {
      this.currentOrg = currentOrg
    },

    /**
     * @description 设置用户组织列表
     * @param {*} orgList
     */
    setOrgList(orgList: any) {
      this.orgList = orgList
    },

    /**
     * @description 设置当前系统
     * @param {*} currentSystem
     */
    setCurrentSystem(currentSystem: any) {
      this.currentSystem = currentSystem
    },

    /**
     * @description 设置系统列表
     * @param {*} subsystemList
     */
    setSubsystemList(subsystemList: any) {
      this.subsystemList = subsystemList
    },
    /**
     * @description 登录拦截放行时，设置虚拟角色
     */
    setVirtualRoles() {
      const aclStore = useAclStore()
      aclStore.setFull(true)
      this.setUsername('admin(未开启登录拦截)')
    },
    /**
     * @description 设置token并发送提醒
     * @param {string} token 更新令牌
     * @param {string} tokenName 令牌名称
     */
    afterLogin(token: string, tokenName: string) {
      const settingsStore = useSettingsStore()
      if (token) {
        this.setToken(token)
        const hour = new Date().getHours()
        const thisTime =
          hour < 8
            ? '早上好'
            : hour <= 11
            ? '上午好'
            : hour <= 13
            ? '中午好'
            : hour < 18
            ? '下午好'
            : '晚上好'
        registerApi.getIsExpire().then((response: any) => {
          if (response && response.isOk) {
            if (response.data) {
              gp.$baseNotify(
                `<strong>欢迎登录${settingsStore.title}</strong> <br> <a href="dashboard/user/updatePassword" type="warning">密码已到期，请尽快修改</a>`,
                true,
                `${thisTime}！`
              )
            } else {
              gp.$baseNotify(
                `欢迎登录${settingsStore.title}`,
                false,
                `${thisTime}！`
              )
            }
          }
        })
      } else {
        const err = `登录接口异常，未正确返回${tokenName}...`
        gp.$baseMessage(err, 'error', 'vab-hey-message-error')
        throw err
      }
    },
    /**
     * @description 登录
     * @param {*} userInfo
     */
    async login(userInfo: any) {
      // 登录时不需要token
      removeToken()
      const loginUser = abUtil.clone(userInfo)
      loginUser.password = abTools.encrypt(userInfo.password)
      loginUser.clientId = defaultAppCode
      loginUser.clientSecret = abTools.encrypt(defaultAppSecret)
      const {
        data: { access_token, refresh_token, expires_in, extendData },
      } = await registerApi.login(loginUser)
      this.afterLogin(access_token, tokenName)
      this.setRefMsg(refresh_token, expires_in)
      // 设置下 唯一识别码
      if (extendData && extendData.uniqueCode) {
        localStorage.setItem('user$id', extendData.uniqueCode)
      }
    },

    /**
     * @description 企业微信扫码登录
     * @param {*} code
     */
    async qywxLogin(code: string) {
      // 登录时不需要token
      removeToken()
      const {
        data: { access_token, refresh_token, expires_in },
      } = await registerApi.qywxLogin(code)
      this.afterLogin(access_token, tokenName)
      this.setRefMsg(refresh_token, expires_in)
    },

    /**
     * @description 钉钉自动登录
     * @param {*} code
     */
    async ddAutoLogin(code: string) {
      // 登录时不需要token
      removeToken()
      const {
        data: { access_token, refresh_token, expires_in },
      } = await registerApi.ddAutoLogin(code)
      this.afterLogin(access_token, tokenName)
      this.setRefMsg(refresh_token, expires_in)
    },

    /**
     * @description 钉钉扫码登录
     * @param {*} code
     */
    async ddScanLogin(code: string) {
      // 登录时不需要token
      removeToken()
      const {
        data: { access_token, refresh_token, expires_in },
      } = await registerApi.ddScanLogin(code)
      this.afterLogin(access_token, tokenName)
      this.setRefMsg(refresh_token, expires_in)
    },

    /**
     * 设置失效tokenn
     * @param data
     */
    setRefMsg(refresh_token: string, expires_in: number) {
      // 设置失效token，失效时间
      setRefreshToken(refresh_token)
      setRefreshTime(new Date().getTime() + Number(expires_in) * 1000)
    },
    /**
     * @description 刷新TOKEN
     * @param {*} refresh_tokenR
     */
    async refreshTokenFn(refresh_tokenR: any) {
      const {
        data: { access_token, refresh_token, expires_in },
      } = await registerApi.refreshToken({
        clientId: defaultAppCode,
        clientSecret: abTools.encrypt(defaultAppSecret),
        // grant_type: 'refresh_token',
        refreshToken: refresh_tokenR,
      })
      if (access_token) {
        this.setToken(access_token)
      }
      this.setRefMsg(refresh_token, expires_in)
    },
    /**
     * @description 刷新页面不影响定时
     *
     */
    refresh() {
      // 如果禁用刷新token，则不刷新
      if (disableRefreshToken) return

      const nowTime = new Date().getTime()
      // 提前60秒请求 60000
      const cTime = Number(getRefreshTime()) - nowTime - 60000
      if (cTime) {
        timer = setInterval(() => {
          this.refreshTokenFn(getRefreshToken())
        }, cTime)
      }
    },
    /**
     * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
     * @returns
     */
    async getUserInfo() {
      // 先清除刷新token定时器
      clearInterval(timer)
      const {
        data: {
          username,
          userMenuList,
          buttonPermission,
          user,
          currentSystem,
          currentOrg,
          orgList,
          subsystemList,
          tenantSwitchExit,
          subUserList,
        },
      } = await registerApi.getUserInfo()

      /**
       * 检验返回数据是否正常，无对应参数，将使用默认用户名,头像,Roles和Permissions
       * username {String}
       * roles {List}
       * ability {List}
       */
      if (
        (username && !isString(username)) ||
        (userMenuList && !isArray(userMenuList))
      ) {
        const err = 'getUserInfo核心接口异常，请检查返回JSON格式是否正确'
        gp.$baseMessage(err, 'error', 'vab-hey-message-error')
        throw err
      } else {
        const aclStore = useAclStore()
        const routers = useRoutesStore()
        // 如不使用username用户名,可删除以下代码
        if (username) this.setUsername(username)
        if (currentOrg) this.setCurrentOrg(currentOrg)
        if (orgList) this.setOrgList(orgList)
        if (currentSystem) this.setCurrentSystem(currentSystem)
        if (subsystemList) this.setSubsystemList(subsystemList)
        // 如不使用roles权限控制,可删除以下代码
        // if (roles) aclStore.setRole(roles)
        // 如不使用permissions权限控制,可删除以下代码
        //if (permissions) aclStore.setPermission(permissions)
        if (buttonPermission) aclStore.setButtonPermission(buttonPermission)
        if (userMenuList.length == 0) {
          throw 'noResource'
        }
        //将当前登录的系统应用code储存在内存里，其他模块判断时就无需在请求接口
        setApplication(currentSystem)
        aclStore.setUserMenuList(userMenuList)
        if (userMenuList) {
          await routers.setMenus(userMenuList)
        }
        this.setAbUser(user)
        // 定时器刷新refreshtoken
        this.refresh()
      }
      this.tenantSwitchExit = tenantSwitchExit
      this.subUserList = subUserList
    },
    /**
     * @description 退出登录
     */
    async logout() {
      await registerApi.logout()
      await this.resetAll()
      // 解决横向布局退出登录显示不全的bug
      // location.reload()
    },
    /**
     * @description 退出系统
     */
    async exitSystem() {
      await registerApi.exitSystem()
      await this.resetAll()
    },
    /**
     * @description 重置token、roles、permission、router、tabsBar等
     */
    async resetAll() {
      if (loginTimeOutIsJumpLoginPage) {
        this.setToken('')
      }
      removeRefreshToken()
      removeRefreshTime()
      removeApplication()
      removeGrid()
      clearInterval(timer)
      this.setUsername('游客')
      this.setCurrentOrg({})
      this.setOrgList([])
      this.setCurrentSystem({})
      this.setSubsystemList([])
      cookie.remove('Authorization')
      const aclStore = useAclStore()
      const routesStore = useRoutesStore()
      const tabsStore = useTabsStore()
      aclStore.setPermission([])
      aclStore.setFull(false)
      aclStore.setRole([])
      tabsStore.delAllVisitedRoutes()
      routesStore.clearRoutes()
      await resetRouter()
      removeToken()
    },
  },
})
