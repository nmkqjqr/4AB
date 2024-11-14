<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
          type-code="dataPrivilege"
          @node-click="searchResetPage()"
        />
      </el-aside>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item :label="$abT('page.common.name','名称')" label-width="120px" prop="name$VLK">
                    <el-input v-model="query.name$VLK" :placeholder="$abT('page.common.enterName','请输入名称')" />
                  </el-form-item>
                  <el-form-item
                    :label="$abT('page.roleList.resourcesType','资源类型')"
                    label-width="120px"
                    prop="resourceType$VEQ"
                  >
                    <el-select v-model="query.resourceType$VEQ"  clearable :placeholder="$abT('page.common.all','全部')">
                      <el-option :label="$abT('page.common.menu','菜单')" value="menu" />
                      <el-option :label="$abT('page.common.custDialog','自定义对话框')" value="dialog" />
                      <el-option :label="$abT('page.common.custGrid','自定义列表')" value="grid" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      {{ $abT('page.common.search',  '查询' ) }}
                    </el-button>
                    <el-button :icon="RefreshRight" @click="reset()">
                      {{ $abT('page.common.reset','重置') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <!-- 按钮区域 -->
            <el-space wrap>
              <router-link
                v-ab-btn-rights:dataPrivilege_add
                :to="{
                  name: 'dataPrivilegeEdit',
                  query: { typeCode: query['typeCode$VEQ'] },
                }"
              >
                <el-button
                  :icon="Plus"
                  type="primary"
                >
                  {{ $abT('page.common.add','添加') }}
                </el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:dataPrivileger_del
                :disabled="!selectedData || selectedData.length == 0"
                :icon="Delete"
                type="danger"
                @click="
                  delBySeletedIds(sysApi.dataPrivilege.dataPrivilegeRemoveUrl)
                "
              >
                {{ $abT('page.common.batchDel','批量删除') }}
              </el-button>
            </el-space>
          </div>
          <!-- 关键字段设置minwith，特定枚举字段设置with（管理列、日期、状态、字典等），
         不重要字段放最后，管理列设置 fixed="right"
    -->
          <ab-table
            ref="abTable"
            v-model="selectedData"
            :height="tableHeight"
            :query-param="query"
            row-key="id"
            :url="sysApi.dataPrivilege.dataPrivilegeListUrl"
          >
            <ab-column :label="$abT('page.common.name','名称')" prop="name" width="160" />
            <ab-column :label="$abT('page.common.desc','描述')" min-width="180" prop="description" />
            <ab-column
              ab-tag-effect="light"
              ab-tag-type="info"
              :label="$abT('page.roleList.resourcesType','资源类型')"
              prop="resourceTypeName"
              width="120"
            />
            <ab-column :label="$abT('page.dataAuth.resources','资源')" min-width="200" prop="path" />
            <ab-column
              :label="$abT('page.common.enable','启用')"
              width="70"
              ab-template="status"
            />
            <template #status="{ scope }">
              <el-tag v-if="scope.row.enabled === 0" type="danger">{{ $abT('page.common.no','否') }}</el-tag>
              <el-tag  v-if="scope.row.enabled === 1" type="success">{{ $abT('page.common.yes','是') }}</el-tag>
            </template>
            <ab-column ab-date-formatter="yyyy-MM-dd HH:mm"  :label="$abT('page.common.updateTime','更新时间')" min-width="120" prop="updateTime" />
            <ab-column :label="$abT('page.common.updater','更新人')" min-width="100" prop="updater" />
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate','操作')"
              width="240"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:dataPrivilege_edit
                :to="{
                  name: 'dataPrivilegeEdit',
                  query: { id: scope.row.id },
                }"
              >
                <el-button
                  text
                  type="primary"
                >
                  {{ $abT('page.common.edit','编辑') }}
                </el-button>
              </router-link>
              <el-button
                v-if="scope.row.enabled === 0"
                v-ab-btn-rights:dataPrivilege_updateStatus
                text
                type="primary"
                @click="
                  sendAction(
                    `${sysApi.dataPrivilege.dataPrivilegeChangeEnabledUrl}?id=${scope.row.id}&enabled=1`,
                    $abT('page.common.confirmEnable','确定启用{b}吗？',{b : scope.row.name})
                  )
                "
              >
                {{ $abT('page.common.enable','启用') }}
              </el-button>
              <el-button
                v-if="scope.row.enabled === 1"
                v-ab-btn-rights:dataPrivilege_updateStatus
                text
                type="primary"
                @click="
                  sendAction(
                    `${sysApi.dataPrivilege.dataPrivilegeChangeEnabledUrl}?id=${scope.row.id}&enabled=0`,
                    $abT('page.common.confirmDisable','确定禁用{a}吗？',{a : scope.row.name})
                  )
                "
              >
                {{ $abT('page.common.disable','禁用') }}
              </el-button>
              <el-button
                v-ab-btn-rights:dataPrivileger_del
                text
                type="primary"
                @click="
                  sendAction(
                    `${sysApi.dataPrivilege.dataPrivilegeRemoveUrl}${scope.row.id}`,
                    $abT('page.common.delMsg','确定删除 {a} 吗？',{a : scope.row.name})
                  )
                "
              >
                {{ $abT('page.common.del','删除') }}
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import { abTableMix, abDictTree, sysApi } from '~/agilebpm'
  export default { mixins: [abTableMix] }
</script>

<script lang="ts" setup>
  // eslint-disable-next-line no-unused-vars
  import { ref, reactive, defineComponent } from 'vue'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    Check,
  } from '@element-plus/icons-vue'

  const query = reactive({
    name$VLK: '',
    description$VLK: '',
    resourceType$VEQ: '',
    typeCode$VIN: '',
  })
</script>
