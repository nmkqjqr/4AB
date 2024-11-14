<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user'
  import { toLoginRoute } from '@/utils/routes'
  import { VabRoute } from '/#/router'
  import { reactive } from 'vue'
  import cookies from 'js-cookie'

  import {
    User,
    Setting,
    Switch,
    OfficeBuilding,
    ArrowDown,
    House,
  } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { storage } from '@/config'
  import {
    sysApi,
    getData,
    abApiPrefix,
    authApi,
    orgApi,
  } from '~/agilebpm'

  const route: VabRoute = useRoute()
  const router = useRouter()

  const userStore = useUserStore()
  const {
    abUser,
    username,
    currentOrg,
    orgList,
    currentSystem,
    subsystemList,
    tenantSwitchExit,
    subUserList,
  } = storeToRefs(userStore)
  const { logout } = userStore
  const info: any = reactive({
    user: {} as any,
    currentOrg: {} as any,
    orgList: [],
    currentSystem: {} as any,
    subsystemList: [],
    focusDialogVisible: false,
    focusModeData: {
      open: true,
    },
  })

  const active = ref(false)
  const handleVisibleChange = (val: boolean) => {
    active.value = val
  }

  const orgActive = ref(false)
  const orgVisibleChange = (val: boolean) => {
    orgActive.value = val
  }

  const systemActive = ref(false)
  const systemVisibleChange = (val: boolean) => {
    systemActive.value = val
  }

  const handleCommand = async (command: string) => {
    switch (command) {
      case 'logout':
        await logout()
        await router.push('/login')
        //删除cookie
        cookies.remove('Authorization')
        break
      case 'personalCenter':
        await router.push('/dashboard/user/userInfo')
        break
      case 'updatePwd':
        await router.push('/dashboard/user/updatePassword')
        break
      case 'tenantSwitchExit':
        await sysApi.tenant.switchExit()
        location.pathname = '/'
        break
      case 'focusMode':
        info.focusDialogVisible = true
        break
    }
  }

  /**
   * 切换当前组织
   *
   * @param org 切换的组织
   */
  async function switchCurrentOrg(org: any) {
    const { isOk, msg } = await getData(
      `${abApiPrefix.sysServicePrefix}/userResource/switchOrg/${
        org.groupCode
      }?t=${new Date().getTime()}`
    )
    if (isOk) {
      ElMessage({
        message: `切换成功`,
        type: 'success',
      })
      userStore.setCurrentOrg(org)
      info.currentOrg = org
    } else {
      ElMessage({
        message: `切换失败, ${msg}`,
        type: 'warning',
      })
    }
  }

  /**
   * 切换当前应用
   *
   * @param sysApplication 应用
   */
  async function switchCurrentApplication(sysApplication: any) {
    const { isOk, msg } = await getData(
      `${abApiPrefix.sysServicePrefix}/userResource/switchApp/${
        sysApplication.code
      }?t=${new Date().getTime()}`
    )
    if (isOk) {
      ElMessage({
        message: `切换成功, 系统将在3秒后刷新跳转`,
        type: 'success',
      })
      userStore.setCurrentSystem(sysApplication)
      info.currentSystem = sysApplication
      setTimeout(() => location.reload(), 3000)
      window.location.href = '/index'
    } else {
      ElMessage({
        message: `切换失败, ${msg}`,
        type: 'warning',
      })
    }
  }

  const formRef = ref()
  const focusDialogOk = () => {
    if (!formRef) return

    formRef.value.validate((valid: any) => {
      if (valid) {
        if (storage && 'localStorage' == storage) {
          localStorage.setItem(
            'focusModeData',
            JSON.stringify(info.focusModeData)
          )
        }
        info.focusDialogVisible = false
      } else {
        ElMessage({
          message: '请完善表单！',
          type: 'warning',
        })
      }
    })
  }

  onMounted(() => {
    info.user = abUser.value
    info.currentOrg = currentOrg.value
    info.orgList = orgList.value
    info.subsystemList = subsystemList.value
    info.currentSystem = info.subsystemList.find(
      (item: any) => currentSystem.value === item.code
    )
    info.subsystemList.forEach((e: { code: any; name: string }) => {
      if (e.code == info.currentSystem && e.name) {
        info.systemName = e.name
      }
    })

    if (storage && 'localStorage' == storage) {
      if (localStorage.getItem('focusModeData')) {
        info.focusModeData = JSON.parse(localStorage.getItem('focusModeData'))
        if (info.focusModeData.open) {
          ElMessage({
            message: '您已进入专注模式',
            type: 'success',
            duration: 2000,
          })
        }
      }
    }
  })

  const switchSubUser = async (subUser: any) => {
    const messageBox = await ElMessageBox.confirm(
      `您确认切换到帐户【${subUser.fullName}】上吗？`,
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    if (messageBox !== 'confirm') return
    const { isOk, data } = await orgApi.user.switchSubUser(subUser.userId)
    if (!isOk) return
    userStore.setToken(data.access_token)
    userStore.setRefMsg(data.refresh_token, data.expires_in)
    location.reload()
  }
</script>

<template>
  <span>
    <el-dropdown
      :hide-on-click="false"
      @command="handleCommand"
      @visible-change="handleVisibleChange"
    >
      <span class="avatar-dropdown">
        <div class="user-avatar">
          <el-avatar
            v-if="info.user.photo"
            :src="sysApi.sysFile.getViewFileUrl(info.user.photo)"
            size="default"
            shape="circle"
          />
          <el-avatar
            v-if="info.user.fullName && !info.user.photo"
            size="default"
            shape="circle"
          >
            {{ info.user.fullName.slice(-2) }}
          </el-avatar>
        </div>

        <div class="user-name">
          <span class="hidden-xs-only" :title="username">{{ username }}</span>
          <vab-icon
            class="vab-dropdown"
            :class="{ 'vab-dropdown-active': active }"
            icon="arrow-down-s-line"
          />
        </div>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">
            <vab-icon icon="logout-circle-r-line" />
            <span>{{ $abT('page.layout.logout','退出登录') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="personalCenter">
            <div>
              <el-icon><User /></el-icon>
              <span>{{ $abT('page.layout.userCenter','个人中心') }}</span>
            </div>
          </el-dropdown-item>

          <el-dropdown-item command="updatePwd">
            <div>
              <el-icon><Setting /></el-icon>
              <span>{{ $abT('page.layout.changePwd','修改密码') }}</span>
            </div>
          </el-dropdown-item>

          <el-dropdown-item v-if="info.orgList.length <= 1">
            <div>
              <el-icon><OfficeBuilding /></el-icon>
              <span v-if="info.currentOrg && info.currentOrg.groupName">
                {{ info.currentOrg.groupName }}
              </span>
              <span
                v-if="JSON.stringify(info.currentOrg) === '{}'"
                style="color: #c3cbd6"
              >
                {{ $abT('page.layout.orgAssigned','尚未分配组织') }}
              </span>
            </div>
          </el-dropdown-item>

          <el-dropdown-item v-if="info.orgList.length > 1">
            <el-dropdown
              :hide-on-click="false"
              placement="bottom-end"
              @visible-change="orgVisibleChange"
            >
              <div>
                <el-icon><OfficeBuilding /></el-icon>
                <el-tooltip
                  v-if="info.currentOrg"
                  :content="info.currentOrg.pathName"
                  placement="top-end"
                >
                  <span
                    style="
                      display: inline-block;
                      word-break: break-all;
                      white-space: normal;
                    "
                  >
                    {{ info.currentOrg.groupName }}
                  </span>
                </el-tooltip>
                <vab-icon
                  class="vab-dropdown"
                  :class="{ 'vab-dropdown-active': orgActive }"
                  icon="arrow-down-s-line"
                />
              </div>
              <template #dropdown>
                <el-dropdown-item>
                  <span
                    style="
                      font-size: 14px;
                      font-weight: bold;
                      color: rgb(70, 76, 91);
                    "
                  >
                    {{ $abT('page.layout.changeOrg','切换当前组织') }}
                  </span>
                </el-dropdown-item>
                <el-dropdown-menu
                  v-for="(org, index) in info.orgList"
                  v-show="org.groupId !== info.currentOrg.groupId"
                  :key="index"
                >
                  <el-dropdown-item>
                    <el-icon><Switch /></el-icon>
                    <el-tooltip :content="org.pathName" placement="top-end">
                      <a @click="switchCurrentOrg(org)">
                        <span
                          style="
                            display: inline-block;
                            width: 100px;
                            word-break: break-all;
                            white-space: normal;
                          "
                        >
                          {{ org.groupName }}
                        </span>
                      </a>
                    </el-tooltip>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-dropdown-item>

          <el-dropdown-item
            v-if="info.subsystemList && info.subsystemList.length > 1"
          >
            <el-dropdown
              :hide-on-click="false"
              placement="bottom-end"
              @visible-change="systemVisibleChange"
            >
              <div>
                <el-icon><House /></el-icon>
                <span
                  style="
                    display: inline-block;
                    word-break: break-all;
                    white-space: normal;
                  "
                >
                  {{ info.currentSystem.name }}
                </span>
                <vab-icon
                  class="vab-dropdown"
                  :class="{ 'vab-dropdown-active': systemActive }"
                  icon="arrow-down-s-line"
                />
              </div>
              <template #dropdown>
                <el-dropdown-item>
                  <span
                    style="
                      font-size: 14px;
                      font-weight: bold;
                      color: rgb(70, 76, 91);
                    "
                  >
                    {{ $abT('page.layout.changeSystem','切换系统') }}
                  </span>
                </el-dropdown-item>
                <el-dropdown-menu
                  v-for="(subsystem, index) in info.subsystemList"
                  v-show="subsystem.code !== info.currentSystem.code"
                  :key="index"
                >
                  <el-dropdown-item>
                    <el-icon><Switch /></el-icon>
                    <a
                      v-show="subsystem.appType === 0"
                      @click="switchCurrentApplication(subsystem)"
                    >
                      <span
                        style="
                          display: inline-block;
                          width: 100px;
                          word-break: break-all;
                          white-space: normal;
                        "
                      >
                        {{ subsystem.name }}
                      </span>
                    </a>
                    <a
                      v-show="subsystem.appType === 2"
                      :href="subsystem.url"
                      target="_blank"
                    >
                      <span
                        style="
                          display: inline-block;
                          width: 100px;
                          word-break: break-all;
                          white-space: normal;
                        "
                      >
                        {{ subsystem.name }}
                      </span>
                    </a>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-dropdown-item>
          <el-dropdown-item v-if="subUserList && subUserList.length">
            <el-dropdown :hide-on-click="false" placement="bottom-end">
              <div>
                <el-icon><House /></el-icon>
                <span
                  style="
                    display: inline-block;
                    word-break: break-all;
                    white-space: normal;
                  "
                >
                  子帐户
                </span>
                <vab-icon
                  class="vab-dropdown"
                  :class="{ 'vab-dropdown-active': systemActive }"
                  icon="arrow-down-s-line"
                />
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="subUser in subUserList"
                    key="subUser.id"
                    @click="switchSubUser(subUser)"
                  >
                    {{ subUser.fullName }}
                    <el-tag v-if="subUser.bossUserId === '0'">主</el-tag>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-dropdown-item>
          <el-dropdown-item v-if="tenantSwitchExit" command="tenantSwitchExit">
            <vab-icon icon="logout-circle-r-line" />
            <span>退出租户切换</span>
          </el-dropdown-item>
          <el-dropdown-item command="focusMode">
            <vab-icon icon="a-b" />
            <span>专注模式</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!--专注模式对话框-->
    <el-dialog v-model="info.focusDialogVisible" title="分类配置" width="600px">
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="100px"
        :model="info.focusModeData"
      >
        <el-form-item
          label="开关"
          prop="open"
          :rules="[{ required: true, message: '必填' }]"
        >
          <el-switch
            v-model="info.focusModeData.open"
            active-text="开启"
            inactive-text="关闭"
            inline-prompt
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          />
        </el-form-item>

        <el-space v-show="info.focusModeData.open" fill>
          <el-form-item
            label="业务分类"
            prop="bizTypeCode"
            :rules="[{ required: info.focusModeData.open, message: '必填' }]"
          >
            <ab-select-tree
              v-model="info.focusModeData.bizTypeCode"
              :operation="false"
              type-code="biz"
            />
          </el-form-item>
          <el-alert :closable="false" show-icon title="" type="info">
            作用于：业务实体、业务对象、表单设计、应用列表、组联式应用、自定义对话框、word模板、数据字典
          </el-alert>
        </el-space>

        <el-space v-show="info.focusModeData.open" fill>
          <el-form-item
            label="流程分类"
            prop="flowTypeCode"
            :rules="[{ required: info.focusModeData.open, message: '必填' }]"
          >
            <ab-select-tree
              v-model="info.focusModeData.flowTypeCode"
              :operation="false"
              type-code="flowType"
            />
          </el-form-item>
          <el-alert :closable="false" show-icon title="" type="info">
            作用于：简式流程表单设计、专业流程表单设计
          </el-alert>
        </el-space>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="info.focusDialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="focusDialogOk">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </span>
</template>

<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .user-avatar {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      margin-left: 15px;
      cursor: pointer;
      border-radius: 50%;
    }

    .user-name {
      position: relative;
      display: flex;
      flex-shrink: 0;
      align-content: center;
      align-items: center;
      height: 40px;
      margin-left: 6px;
      line-height: 40px;
      cursor: pointer;
      span {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      [class*='ri-'] {
        margin-left: 3px !important;
      }
    }
  }
</style>
