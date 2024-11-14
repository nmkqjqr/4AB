import { AclModuleType } from '/#/store'

export const useAclStore = defineStore('acl', {
  state: (): AclModuleType => ({
    admin: false,
    role: [],
    permission: [],
    buttonPermission: {},
    userMenuList: [],
  }),
  getters: {
    getAdmin: (state) => state.admin,
    getRole: (state) => state.role,
    getPermission: (state) => state.permission,
    getButtonPermission: (state) => state.buttonPermission,
    getUserMenuList: (state) => state.userMenuList,
  },
  actions: {
    setFull(admin: boolean) {
      this.admin = admin
    },
    setRole(role: string[]) {
      this.role = role
    },
    setPermission(permission: string[]) {
      this.permission = permission
    },
    setButtonPermission(buttonPermission: any) {
      this.buttonPermission = buttonPermission
    },
    setUserMenuList(menuList: []) {
      this.userMenuList = menuList
    },
  },
})
