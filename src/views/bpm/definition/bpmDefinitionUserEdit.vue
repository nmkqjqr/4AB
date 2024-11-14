<template>
  <el-container class="layout-container-demo">
    <el-header height="80px">
    <router-link
        :to="{
          name: 'BpmDefinitionList',
        }"
      >
        <el-button :icon="Back">返回</el-button>
      </router-link>
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-row>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="data.bpmDefinition"
          :status-icon="false"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="候选人类型" prop="name">
                <el-select
                  v-model="info.userType"
                  style="width: 100px; margin-top: -8px; margin-left: 15px"
                >
                  <el-option
                    v-for="(item, index) in info.userTypeList"
                    :key="index"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="待替换候选人" prop="name">
                <div v-if="info.userType == 'user'">
                  <ab-cust-dialog
                    dialog-key="userSelector"
                    :extra-data="info.users"
                    :dialog-setting="{ multiple: 0 }"
                    style="margin-bottom: 5px; margin-left: 8px"
                    @ok="setUser"
                  >
                    选择用户
                  </ab-cust-dialog>
                  <el-tag
                    v-for="user in info.users"
                    :key="user.id"
                    closable
                    style="margin-bottom: 6px; margin-left: 6px"
                    type="success"
                    @close="abUtil.Arrays.remove(user, info.users)"
                  >
                    {{ user.name }}
                  </el-tag>
                </div>
                <div>
                  <ab-cust-dialog
                    v-if="info.userType == 'org'"
                    dialog-key="orgSelector"
                    :extra-data="info.orgs"
                    :dialog-setting="{ multiple: 0 }"
                    style="margin-bottom: 5px; margin-left: 8px"
                    :icon="Search"
                    @ok="setOrg"
                  >
                    选择组织
                  </ab-cust-dialog>
                  <el-tag
                    v-for="org in info.userType == 'org' ? info.orgs : []"
                    :key="org.key"
                    closable
                    type="success"
                    style="margin-bottom: 6px; margin-left: 6px"
                    @close="abUtil.Arrays.remove(org, info.orgs)"
                  >
                    {{ org.name }}
                  </el-tag>
                </div>
                <!--角色-->
                <div>
                  <ab-cust-dialog
                    style="margin-bottom: 5px; margin-left: 8px"
                    v-if="info.userType == 'role'"
                    dialog-key="roleSelector"
                    :extra-data="info.roles"
                    :dialog-setting="{ multiple: 0 }"
                    :icon="Search"
                    @ok="setRole"
                  >
                    选择角色
                  </ab-cust-dialog>
                  <el-tag
                    v-for="role in info.userType == 'role' ? info.roles : []"
                    :key="role.key"
                    closable
                    type="success"
                    style="margin-bottom: 6px; margin-left: 6px"
                    @close="abUtil.Arrays.remove(role, info.roles)"
                  >
                    {{ role.name }}
                  </el-tag>
                </div>
              </el-form-item>
            </el-col>
            <br />
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="新候选人" prop="name">
                <!--      <el-select
                  v-model="info.toUserType"
                  style="width: 100px; margin-top: -10px"
                >
                  <el-option
                    v-for="(item, index) in info.userTypeList"
                    :key="index"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select> -->

                <div v-if="info.toUserType == 'user'">
                  <ab-cust-dialog
                    dialog-key="userSelector"
                    :extra-data="info.toUsers"
                    :dialog-setting="{ multiple: 0 }"
                    style="margin-bottom: 5px; margin-left: 8px"
                    @ok="setUser"
                  >
                    选择用户
                  </ab-cust-dialog>
                  <el-tag
                    v-for="user in info.toUsers"
                    :key="user.id"
                    closable
                    style="margin-bottom: 6px; margin-left: 6px"
                    type="success"
                    @close="abUtil.Arrays.remove(user, info.toUsers)"
                  >
                    {{ user.name }}
                  </el-tag>
                </div>
                <div>
                  <ab-cust-dialog
                    v-if="info.toUserType == 'org'"
                    dialog-key="orgSelector"
                    :extra-data="info.toOrgs"
                    style="margin-bottom: 5px; margin-left: 8px"
                    :icon="Search"
                    :dialog-setting="{ multiple: 0 }"
                    @ok="setOrg"
                  >
                    选择组织
                  </ab-cust-dialog>
                  <el-tag
                    v-for="org in info.toUserType == 'org' ? info.toOrgs : []"
                    :key="org.key"
                    closable
                    type="success"
                    style="margin-bottom: 6px; margin-left: 6px"
                    @close="abUtil.Arrays.remove(org, info.toOrgs)"
                  >
                    {{ org.name }}
                  </el-tag>
                </div>
                <!--角色-->

                <div>
                  <ab-cust-dialog
                    style="margin-bottom: 5px; margin-left: 8px"
                    v-if="info.toUserType == 'role'"
                    dialog-key="roleSelector"
                    :dialog-setting="{ multiple: 0 }"
                    :extra-data="info.toRoles"
                    :icon="Search"
                    @ok="setRole"
                  >
                    选择角色
                  </ab-cust-dialog>
                  <el-tag
                    v-for="role in info.toUserType == 'role'
                      ? info.toRoles
                      : []"
                    :key="role.key"
                    closable
                    type="success"
                    style="margin-bottom: 6px; margin-left: 6px"
                    @close="abUtil.Arrays.remove(role, info.toRoles)"
                  >
                    {{ role.name }}
                  </el-tag>
                </div>
              </el-form-item>
            </el-col>
            <br />
          </el-row>
          <el-row>
            <el-col :span="24">
              <!-- v-ab-btn-rights:queryBpmDefByIdentity -->
              <el-button
                type="primary"
                @click="queryBpmDefByIdentity"
                style="margin-bottom: 10px"
              >
                查询相关流程
              </el-button>
            </el-col>
            <br />
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                v-if="info.defs"
                border
                :data="info.defs"
                :span-method="objectSpanMethod"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="50" />
                <el-table-column label="所属流程" min-width="230px">
                  <template #default="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>
                <el-table-column label="流程节点" min-width="600px">
                  <template #default="scope">
                    <el-tag
                      :key="tag"
                      v-for="tag in info.nodeMap[scope.row.key]"
                      :disable-transitions="true"
                    >
                      {{ tag }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <!-- v-ab-btn-rights:queryBpmDefByIdentity -->
              <el-button
                type="primary"
                @click="updateBpmDef"
                style="margin-bottom: 10px; margin-top: 10px"
              >
                修改流程候选人
              </el-button>
            </el-col>
            <br />
          </el-row>
        </el-form>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { bpmApi, abUtil, abTools } from '~/agilebpm'
  import { abChooseSvg } from '~/agilebpm'

  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const formRef = ref<FormInstance>()
  const id = proxy.$route.query.id
  const data = reactive({
    bpmDefinition: {
      name: '',
      key: '',
      desc: '',
      sn: '10',
      iconStyle: '',
      typeCode: '',
      id: null as any,
      processEditor: 'empty',
      hidden: 0,
    },
  })
  const info: any = reactive({
    users: [], //对话框选择的用户
    orgs: [], //对话框选择的组织
    roles: [], //对话框选择的角色
    userType: 'user',
    toUsers: [],
    toOrgs: [],
    toRoles: [],
    toUserType: 'user',
    row: [],
    userTypeList: [
      { key: 'user', value: '用户' },
      { key: 'org', value: '组织' },
      { key: 'role', value: '角色' },
    ],
    defs: [],
    nodeMap: [],
    multipleSelectionVal: [],
    updateBpmIdentityDTO: {
      defIds: [],
      fromType: '',
      fromName: '',
      toType: '',
      toCode: '',
      toName: '',
    },
  })

  watch(
    () => info.userType,
    () => {
      info.toUserType = info.userType
    }
  )

  /* watch(
  () => info.toUserType,
  () => {
      info.userType = info.toUserType
  }
) */

  const handleSelectionChange = (val: any) => {
    info.multipleSelectionVal = val
  }
  const updateBpmDef = () => {
    info.updateBpmIdentityDTO.defIds = info.multipleSelectionVal.map(
      (a: any) => a.key
    )
    info.updateBpmIdentityDTO.fromType = info.userType
    info.updateBpmIdentityDTO.fromName = getNameByType(1)
    info.updateBpmIdentityDTO.toType = info.toUserType
    info.updateBpmIdentityDTO.toCode = getNameByType(0)
    info.updateBpmIdentityDTO.toName = getNameByType(2)
    if (info.updateBpmIdentityDTO.defIds.length == 0) {
      ElMessage.error('请至少勾选一个流程！')
      return
    }
    if (!info.updateBpmIdentityDTO.fromName) {
      ElMessage.error('请选择待替换候选人！')
      return
    }
    if (!info.updateBpmIdentityDTO.toName) {
      ElMessage.error('请选择新候选人！')
      return
    }
    if (
      info.updateBpmIdentityDTO.fromType != info.updateBpmIdentityDTO.toType
    ) {
      ElMessage.error('替换候选人和新候选人类型不一致！')
      return
    }
    if (
      info.updateBpmIdentityDTO.fromName == info.updateBpmIdentityDTO.toCode
    ) {
      ElMessage.error('替换候选人和新候选人相同！')
      return
    }
    bpmApi.bpmDefinition
      .saveBpmDefByIdentity(info.updateBpmIdentityDTO)
      .then((res: any) => {
        if (res.isOk) {
          ElMessage.success(res.msg)
          queryBpmDefByIdentity()
        }
      })
  }
  //
  const getNameByType = (type: any) => {
    if (info.userType == 'user' && info.users) {
      if (type == 1) {
        return info.users[0]?.key
      } else {
        return type == 2 ? info.toUsers[0]?.name : info.toUsers[0]?.key
      }
    } else if (info.userType == 'org' && info.orgs) {
      if (type == 1) {
        return info.orgs[0]?.key
      } else {
        return type == 2 ? info.toOrgs[0]?.name : info.toOrgs[0]?.key
      }
    } else if (info.userType == 'role' && info.roles) {
      if (type == 1) {
        return info.roles[0]?.key
      } else {
        return type == 2 ? info.toRoles[0]?.name : info.toRoles[0]?.key
      }
    }
  }
  const queryBpmDefByIdentity = () => {
    if (!getNameByType(1)) {
      ElMessage.error('请选择待替换候选人！')
      return
    }
    dealBpmDefData(info.userType, getNameByType(1))
  }
  const dealBpmDefData = (type: string, name: string) => {
    bpmApi.bpmDefinition.queryBpmDefByIdentity(type, name).then((res: any) => {
      if (res.isOk && res.data && res.data.defs && res.data.defs.length > 0) {
        console.log(res.data.defs)
        console.log(res.data.nodeMap)
        info.defs = res.data.defs
        info.nodeMap = res.data.nodeMap
      }else{
        ElMessage.success('暂无相关的流程配置！')
        info.defs = []
        info.nodeMap = []
      }
    })
  }

  const setUser = (users: any, row: any) => {
    users.forEach((user: any) => {
      let b = false
      row.forEach((u: any) => {
        if (u.key == user.account) {
          b = true
        }
      })
      if (b) return
      row.splice(0, 1)
      row.push({
        key: user.account,
        name: user.name,
      })

      /*     row.orgs = []
      row.roles = [] */
    })
  }

  const setOrg = (orgs: any, row: any) => {
    orgs.forEach((org: any) => {
      let b = false
      row.forEach((o: any) => {
        if (o.key == org.key) {
          b = true
        }
      })
      if (b) return
      row.splice(0, 1)
      row.push({
        key: org.key,
        name: org.name,
      })
      /*       info.users = []
      info.roles = [] */
    })
  }
  const setRole = (roles: any, row: any) => {
    roles.forEach((role: any) => {
      let b = false
      row.forEach((r: any) => {
        if (r.key == role.key) {
          b = true
        }
      })
      if (b) return
      row.splice(0, 1)
      row.push({
        key: role.key,
        name: role.name,
      })
      /*       info.users = []
      info.orgs = [] */
    })
  }

  const removeUser = (user: any, row: any) => {
    abUtil.Arrays.remove(user, row.users)
  }

  const saveAfter = (data: any) => {
    return true
  }

  onMounted(() => {})
</script>
