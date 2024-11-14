<template>
  <div class="common-layout">
    <el-row>
      <el-col :span="12">
        <el-card>
          <template #header>
            <h4>{{ $abT('page.dataAuth.roleList', '角色列表') }}</h4>
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
                  <el-form-item
                    :label="$abT('page.dataAuth.roleCodeLabel', '编码')"
                    prop="groupCode$VLK"
                  >
                    <el-input
                      v-model="info.roleQuery.groupCode$VLK"
                      :placeholder="
                        $abT('page.dataAuth.roleCodePlaceholder', '请输入编码')
                      "
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$abT('page.dataAuth.roleNameLabel', '名称')"
                    prop="groupName$VLK"
                  >
                    <el-input
                      v-model="info.roleQuery.groupName$VLK"
                      :placeholder="
                        $abT('page.dataAuth.roleNamePlaceholder', '请输入名称')
                      "
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      :icon="Search"
                      type="primary"
                      @click="search('roleTable')"
                    >
                      {{ $abT('page.common.search', '查询') }}
                    </el-button>
                    <el-button
                      :icon="Refresh"
                      @click="reset('roleTable', 'roleQueryForm')"
                    >
                      {{ $abT('page.common.reset', '重置') }}
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
            <ab-column
              :label="$abT('page.dataAuth.roleCodeLabel', '编码')"
              prop="groupCode"
            />
            <ab-column
              :label="$abT('page.dataAuth.roleNameLabel', '名称')"
              prop="groupName"
            />
          </ab-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card v-if="info.roleSelected.code">
          <template #header>
            <h4>
              {{
                $abT(
                  'page.dataAuth.giveTableTitle',
                  '设置角色【{name}】数据权限',
                  { name: info.roleSelected.name }
                )
              }}
            </h4>
          </template>
          <div ref="giveForm">
            <el-row>
              <el-col class="top-panel" :span="24">
                <el-form
                  ref="giveQueryForm"
                  :inline="true"
                  label-width="90px"
                  :model="info.giveQuery"
                >
                  <el-form-item
                    :label="$abT('page.roleList.resourcesName', '资源名称')"
                    prop="name$VLK"
                  >
                    <el-input
                      v-model="info.giveQuery.name$VLK"
                      :placeholder="
                        $abT(
                          'page.roleList.enterResourcesName',
                          '请输入资源名称'
                        )
                      "
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$abT('page.roleList.resourcesType', '资源类型')"
                    prop="resourceType$VEQ"
                  >
                    <el-select v-model="info.giveQuery.resourceType$VEQ">
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
                    <el-button
                      :icon="Search"
                      type="primary"
                      @click="search('giveTable')"
                    >
                      {{ $abT('page.common.search', '查询') }}
                    </el-button>
                    <el-button
                      :icon="RefreshRight"
                      @click="reset('giveTable', 'giveQueryForm')"
                    >
                      {{ $abT('page.common.reset', '重置') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-button
                :icon="Setting"
                type="primary"
                @click="
                  dataPrivilegeGivenDialog.show(info.roleSelected.code, '')
                "
              >
                {{ $abT('page.dataAuth.settingsAll', '设置全部') }}
              </el-button>
            </el-row>
          </div>
          <ab-table
            ref="giveTable"
            :query-param="info.giveQuery"
            :checkable="false"
            :url="info.giveTableUrl"
            :height="tableHeight - 33"
          >
            <ab-column
              :label="$abT('page.roleList.resourcesName', '资源名称')"
              min-width="120"
              prop="name"
            />
            <ab-column
              ab-tag-effect="light"
              ab-tag-type="info"
              :label="$abT('page.roleList.resourcesType', '资源类型')"
              prop="resourceTypeName"
              width="120"
            />
            <ab-column
              :label="$abT('page.dataAuth.resources', '资源')"
              min-width="180"
              prop="path"
            />
            <ab-column
              ab-tag-effect="light"
              ab-tag-type="info"
              :label="$abT('page.roleList.dataScope', '数据范围')"
              prop="dataScopeName"
              width="140"
            />
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate', '操作')"
              width="120"
            />
            <template #edit="{ scope }">
              <el-button
                v-ab-btn-rights:dataPrivilege_setUp
                text
                type="primary"
                @click="
                  dataPrivilegeGivenDialog.show(
                    info.roleSelected.code,
                    scope.row.dataPrivilegeId
                  )
                "
              >
                {{ $abT('page.roleList.setting', '设置') }}
              </el-button>
            </template>
          </ab-table>
        </el-card>
        <el-empty
          v-else
          :description="
            $abT('page.dataAuth.giveTableEmptyDescription', '请选择左侧角色')
          "
        />
      </el-col>
    </el-row>
    <!-- 数据权限分配 -->
    <authority-data-privilege-given-dialog
      ref="dataPrivilegeGivenDialog"
      @ok="search('giveTable')"
    />
  </div>
</template>
<script lang="ts">
  import { abTableMix } from '~/agilebpm'

  export default {
    name: 'AuthorityDataPrivilegeMgrList',
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
  import { sysApi, bizApi } from '~/agilebpm'
  import { abT } from '@/i18n'
  import AuthorityDataPrivilegeGivenDialog from '@/views/sys/dataPrivilege/authorityDataPrivilegeGivenDialog.vue'

  const dataPrivilegeGivenDialog = ref()
  const giveTable = ref()

  const info = reactive({
    loading: false,
    roleQuery: {
      groupCode$VLK: '',
      groupName$VLK: '',
    },
    roleSelected: {
      code: '',
      name: '',
    },
    currentRoleChange(currentRow: any) {
      info.roleSelected.code = currentRow.groupCode
      info.roleSelected.name = currentRow.groupName
      info.setGiveTableUrl()
    },
    giveQuery: {
      name$VLK: '',
      resourceType$VEQ: '',
    },
    giveTableUrl: '',
    setGiveTableUrl() {
      const firstRender = !info.giveTableUrl
      info.giveTableUrl = `${sysApi.dataPrivilege.authorityDataPrivilegeGivenListJsonUrl}?authority=${info.roleSelected.code}`
      if (!firstRender) nextTick(giveTable.value.getData)
    },
  })
</script>
