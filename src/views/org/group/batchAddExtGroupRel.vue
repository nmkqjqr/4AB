<template>
  <div class="common-layout" v-loading="info.loading">
    <el-row>
      <el-col :span="12">
        <el-card>
          <template #header>
            <h4>角色列表</h4>
          </template>
          <div ref="roleTitleForm">
            <el-row>
              <el-col class="top-panel" :span="24">
                <el-form
                  ref="roleQueryForm"
                  :inline="true"
                  label-width="62px"
                  :model="info.roleQuery"
                >
                  <el-form-item label="编码" prop="groupCode$VLK">
                    <el-input
                      v-model="info.roleQuery.groupCode$VLK"
                      placeholder="请输入编码名"
                    />
                  </el-form-item>
                  <el-form-item label="名称" prop="groupName$VLK">
                    <el-input
                      v-model="info.roleQuery.groupName$VLK"
                      placeholder="请输入角色名"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      :icon="Search"
                      type="primary"
                      @click="search('roleTable')"
                    >
                      查询
                    </el-button>
                    <el-button
                      :icon="Refresh"
                      @click="reset('roleTable', 'roleQueryForm')"
                    >
                      重置
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
          <ab-table
            ref="roleTable"
            :query-param="info.roleQuery"
            row-key="groupId"
            :checkable="false"
            highlight-current-row
            :height="tableHeight"
            :url="`${bizApi.customDialog.listDataByCodeUrl}roleSelector`"
            @current-change="info.currentRoleChange"
          >
            <ab-column label="编码" prop="groupCode" />
            <ab-column label="名称" prop="groupName" />
          </ab-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <div>
          <el-card v-if="info.roleSelected.code">
            <template #header>
              <h4>设置角色【{{ info.roleSelected.name }}】数据权限</h4>
            </template>
            <div ref="giveForm" :style="{height:tableHeight + 86 + 'px'}" style="overflow:auto;">
              <el-row>
                <el-col class="top-panel" :span="24">
                  <el-tree
                    ref="resTreeRef"
                    :check-on-click-node="true"
                    :data="resTree.data"
                    :default-expanded-keys="resTree.expandKeys"
                    :empty-text="$abT('page.common.loading', '加载中。。。')"
                    node-key="id"
                    show-checkbox
                  >
                    <template #default="{ data }">
                      <span class="custom-tree-node">
                        <span>
                          <vab-icon v-if="data.icon" :icon="data.icon" />
                          {{ data.name }}
                        </span>
                      </span>
                    </template>
                  </el-tree>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-empty v-else description="请选择左侧角色" />
          <el-card v-if="info.roleSelected.id">
            <el-row>
              <el-col>
                <span class="dialog-footer">
                  <el-space wrap style="float: right; padding-right: 50px">
                    <el-button
                      :loading="saveLoading"
                      type="primary"
                      @click="saveRoleRes"
                    >
                      {{ $abT('page.common.save', '保存') }}
                    </el-button>
                  </el-space>
                </span>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
  import { abTableMix } from '~/agilebpm'
  export default {
    name: 'batchAddGroupRle',
    mixins: [abTableMix],
  }
</script>
<script lang="ts" setup>
  import {
    Search,
    Refresh,
    RefreshRight,
    Setting,
  } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import {
    abUtil,
    sysApi,
    getData,
    postData,
    bizApi,
    authApi,
  } from '~/agilebpm'
  import { defaultAppCode } from '@/config'
  import { abT } from '@/i18n'

  const roleTable = ref()
  const giveTable = ref()

  const dataScopeEnums = ref<[any]>()

  const resTreeRef = ref()

  const resTree = reactive({
    data: [],
    setData(data: any) {
      resTree.data = data
      // 选中数据项
      setTimeout(() => resTree.setCheckedKeys(), 0)
    },
    expandKeys: computed(() => {
      const defaultExpanded = [] as any
      resTree.data.forEach((item) => {
        defaultExpanded.push(item['id'])
      })
      return defaultExpanded
    }),
    setCheckedKeys() {
      if (resTree.data && resTree.data) {
        const items = [...resTree.data]
        while (items && items.length > 0) {
          const item = items.shift()
          if (item.checked) {
            resTreeRef.value.setChecked(item.id, true, false)
          }
          if (item.children) {
            items.push(...item.children)
          }
        }
      }
    },
  })

  const appInfo = reactive({
    id: '',
    name: '',
    code: '',
  })

  const changeResourceData = () => {
    resTree.setData([])
    appInfo.code = defaultAppCode
    // 获取默认应用信息
    postData(sysApi.authApplication.applicationListJson, {
      queryParam: { code$VEQ: appInfo.code },
    }).then((res) => {
      const { id, name, code } = res.data.rows[0]
      appInfo.id = id
      appInfo.name = name
      appInfo.code = code
    })
    refreshRoleResTree()
  }

  /**
   * 刷新角色资源树
   */
  const refreshRoleResTree = () => {
    // 获取资源角色树
    authApi
      .getRoleResTreeData(info.roleSelected.id, appInfo.code)
      .then((res) => {
        resTree.setData(res.data)
      })
  }

  const saveLoading = ref(false)

  /**
   * 保存角色资源
   */
  const saveRoleRes = () => {
    const resIds = resTreeRef.value.getCheckedKeys()
    const halfResIds = resTreeRef.value.getHalfCheckedKeys()
    authApi
      .grantRoleResource(info.roleSelected.id, appInfo.id, resIds, halfResIds)
      .then((res) => {
        ElMessage({
          showClose: true,
          message: abT('page.common.operateSuccess', '操作成功'),
          type: 'success',
        })
        saveLoading.value = false
      })
  }

  const info = reactive({
    loading: false,
    roleQuery: {
      groupCode$VLK: '',
      groupName$VLK: '',
    },
    roleSelected: {
      id: '',
      code: '',
      name: '',
    },
    currentRoleChange(currentRow: any) {
      info.roleSelected.code = currentRow.groupCode
      info.roleSelected.id = currentRow.groupId
      info.roleSelected.name = currentRow.groupName
      changeResourceData()
    },
    giveQuery: {
      name$VLK: '',
      resourceType$VEQ: '',
    },
    giveTableUrl: '',

    orgSelectDialog: {
      visible: false,
      ok(dataList: [any]) {
        const orgIds: any[] = []
        const orgNames: any[] = []
        if (dataList) {
          dataList.forEach(({ id, name }) => {
            orgIds.push(id)
            orgNames.push(name)
          })
        }

        info.orgSelectDialog.visible = false
      },
    },
  })
</script>
