<template>
  <div class="common-layout">
    <el-container>
      <div>
        <el-aside class="left-tree">
          <ab-dict-tree
            v-model="query.typeCode$VIN"
            type-code="dataPrivilege"
            @node-click="searchResetPage()"
          />
        </el-aside>
      </div>
      <el-main>
        <div class="comprehensive-table-container">
          <el-row class="vab-query-form">
            <h3>
              {{
                $abT('page.roleList.rolePermissions', '角色{a}数据权限', {
                  a: '【' + roleName + '】',
                })
              }}
            </h3>
            <el-divider />
          </el-row>
          <el-row class="vab-query-form">
            <el-col class="top-panel">
              <el-form
                ref="queryForm"
                :inline="true"
                label-width="50px"
                :model="query"
                @submit.prevent
              >
                <el-form-item
                  :label="$abT('page.roleList.resourcesName', '资源名称')"
                  label-width="150"
                  prop="name$VLK"
                >
                  <el-input
                    v-model="query.name$VLK"
                    :placeholder="
                      $abT('page.roleList.enterResourcesName', '请输入资源名称')
                    "
                  />
                </el-form-item>
                <el-form-item
                  :label="$abT('page.roleList.resourcesType', '资源类型')"
                  label-width="150"
                  prop="resourceType$VEQ"
                >
                  <el-select v-model="query.resourceType$VEQ">
                    <el-option
                      :label="$abT('page.common.all', '全部')"
                      value=""
                    />
                    <el-option
                      :label="$abT('page.common.menu', '菜单')"
                      value="menu"
                    />
                    <el-option
                      :label="$abT('page.common.custDialog', '自定义对话框')"
                      value="dialog"
                    />
                    <el-option
                      :label="$abT('page.common.custGrid', '自定义列表')"
                      value="grid"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button :icon="Search" type="primary" @click="search()">
                    {{ $abT('page.common.search', '查询') }}
                  </el-button>
                  <el-button :icon="RefreshRight" @click="reset()">
                    {{ $abT('page.common.reset', '重置') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col class="left-panel">
              <el-space>
                <el-button :icon="Back" type="primary" @click="back">
                  {{ $abT('page.common.back', '返回') }}
                </el-button>
                <el-button
                  v-ab-btn-rights:roleDataPrivilegeGiven_save
                  :icon="Setting"
                  type="primary"
                  @click="dataPrivilegeGivenDialog.show(authority, '')"
                >
                  {{ $abT('page.roleList.globalSetting', '全局设置') }}
                </el-button>
              </el-space>
            </el-col>
          </el-row>
        </div>
        <ab-table
          ref="abTable"
          v-model="selectedData"
          :checkable="false"
          :height="tableHeight"
          :query-param="query"
          row-key="dataPrivilegeId"
          :url="
            sysApi.dataPrivilege.authorityDataPrivilegeGivenListJsonUrl +
            `?authority=${authority}`
          "
        >
          <ab-column
            :label="$abT('page.common.name', '名称')"
            min-width="120"
            prop="name"
          />
          <ab-column
            :label="$abT('page.common.desc', '描述')"
            min-width="120"
            prop="description"
          />
          <ab-column
            ab-tag-effect="light"
            ab-tag-type="info"
            :label="$abT('page.common.type', '类型')"
            prop="resourceTypeName"
            width="120"
          />
          <ab-column
            :label="$abT('page.roleList.resourcesUrl', '路径')"
            min-width="120"
            prop="path"
          />
          <ab-column
            ab-tag-effect="light"
            ab-tag-type="info"
            :label="$abT('page.roleList.dataScope', '数据范围')"
            prop="dataScopeName"
            width="120"
          />
          <ab-column
            ab-template="edit"
            fixed="right"
            :label="$abT('page.common.operate', '操作')"
            width="170"
          />
          <template #edit="{ scope }">
            <el-button
              v-ab-btn-rights:roleDataPrivilegeGiven_save
              text
              type="primary"
              @click="
                dataPrivilegeGivenDialog.show(
                  authority,
                  scope.row.dataPrivilegeId
                )
              "
            >
              {{ $abT('page.roleList.setting', '设置') }}
            </el-button>
            <el-button
              v-if="!scope.row.extendGlobal"
              v-ab-btn-rights:roleDataPrivilegeGiven_reset
              text
              type="primary"
              @click="
                sendAction(
                  `${sysApi.dataPrivilege.dataPrivilegeResetGivenUrl}?authority=${authority}&dataPrivilegeId=${scope.row.dataPrivilegeId}`,
                  $abT('page.roleList.confirmReset', '确定重置{a}吗', {
                    a: '【' + scope.row.name + '】',
                  })
                )
              "
            >
              {{ $abT('page.common.reset', '重置') }}
            </el-button>
          </template>
        </ab-table>
      </el-main>
    </el-container>
    <!-- 数据权限分配 -->
    <authority-data-privilege-given-dialog
      ref="dataPrivilegeGivenDialog"
      @ok="search"
    />
  </div>
</template>

<script lang="ts">
  import { abTableMix } from '~/agilebpm'
  export default {
    name: 'RoleDataPrivilegeGiven',
    mixins: [abTableMix],
  }
</script>

<script setup lang="ts">
  import {
    Back,
    Setting,
    Refresh,
    RefreshRight,
    Search,
  } from '@element-plus/icons-vue'
  import {
    abTableMix,
    orgApi,
    sysApi,
    abTools,
    postData,
    abDictTree,
  } from '~/agilebpm'
  import { abT } from '@/i18n'
  import { useTabsStore } from '@/store/modules/tabs'
  import { checkIsPublicProject } from '~/agilebpm/utils/ab-util'
  import AuthorityDataPrivilegeGivenDialog from '@/views/sys/dataPrivilege/authorityDataPrivilegeGivenDialog.vue'

  checkIsPublicProject()
  const { proxy } = abTools.useCurrentInstance()

  const dataPrivilegeGivenDialog = ref()

  const authority = proxy.$route.query.code
  const roleName = ref<string>(proxy.$route.query.name)

  // 获取角色名称
  if (!roleName.value) {
    postData(orgApi.role.orgRoleListUrl, {
      queryParam: { code$VEQ: authority },
    }).then(({ data }) => {
      if (data.rows && data.rows.length && data.rows[0].code === authority) {
        roleName.value = data.rows[0].name
      }
    })
  }

  const query = reactive({
    name$VLK: '',
    resourceType$VEQ: '',
    typeCode$VIN: '',
  })

  const { delVisitedRoute } = useTabsStore()
  const route = useRoute()
  const back = () => {
    delVisitedRoute(route.path)
    proxy.$router.push({
      name: 'RoleList',
      params: { _ab_table_reload: true },
    })
  }
</script>
