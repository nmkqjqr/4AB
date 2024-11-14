<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  label-width="80px"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item label="名称" prop="name$VLK">
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="请输入租户名称"
                    />
                  </el-form-item>
                  <el-form-item label="别名" prop="alias$VLK">
                    <el-input
                      v-model="query.alias$VLK"
                      placeholder="请输入租户别名"
                    />
                  </el-form-item>
                  <el-form-item label="隔离模式" prop="isolationMode$VEQ">
                    <el-select v-model="query.isolationMode$VEQ" clearable :placeholder="$abT('page.common.all','全部')">
                      <el-option label="逻辑隔离" value="logic" />
                      <el-option label="物理隔离" value="physics" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      查询
                    </el-button>
                    <el-button :icon="RefreshRight" @click="reset()">
                      重置
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <!--按钮区域-->
              <el-space wrap>
                <router-link v-ab-btn-rights:tenant_add :to="{ name: 'TenantMgrEdit' }">
                  <el-button :icon="Plus" type="primary">添加</el-button>
                </router-link>
              </el-space>
            </el-row>
          </div>
          <!-- 关键字段设置minwith，特定枚举字段设置with（管理列、日期、状态、字典等），
         不重要字段放最后，管理列设置 fixed="right"
    -->
          <ab-table
            ref="abTable"
            :checkable="false"
            :height="tableHeight"
            :query-param="query"
            row-key="id"
            :url="sysApi.tenant.listUrl"
          >
            <ab-column label="名称" min-width="120" prop="name" />
            <ab-column label="别名" min-width="120" prop="alias" />
            <ab-column
              ab-text-formatter="logic-逻辑隔离-success-dark|physics-物理隔离-success-dark"
              label="隔离模式"
              prop="isolationMode"
              width="100"
            />
            <ab-column
              ab-tag-type="success"
              label="状态"
              prop="statusDesc"
              width="80"
            />
            <ab-column
              ab-date-formatter="yyyy-MM-dd"
              label="到期日"
              prop="expireDay"
              width="160"
            />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              prop="updateTime"
              width="160"
            />
            <ab-column label="更新人" width="120" prop="updater" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="360"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:tenant_detail
                :to="{
                  name: 'TenantMgrDetail',
                  query: { id: scope.row.id },
                }"
              >
                <el-button text type="primary">详情</el-button>
              </router-link>
              <router-link
                v-ab-btn-rights:tenant_edit
                :to="{
                  name: 'TenantMgrEdit',
                  query: { id: scope.row.id },
                }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>
              <router-link
                v-ab-btn-rights:tenant_appstore
                :to="{
                  name: 'TenantMgrAppstore',
                  query: { id: scope.row.id },
                }"
              >
                <el-button text type="primary">应用管理</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:tenant_switch
                v-if="scope.row.status === 'enabled'"
                text
                type="primary"
                @click="switchTo(scope.row)"
              >
                切换
              </el-button>
              <el-button
                v-ab-btn-rights:tenant_updateStatus
                text
                type="primary"
                @click="
                  sendAction(
                    `${sysApi.tenant.updateStatusUrl}?id=${
                      scope.row.id
                    }&status=${
                      scope.row.status === 'enabled' ? 'disabled' : 'enabled'
                    }`,
                    `确定${scope.row.status === 'enabled' ? '禁用' : '启用'} ${
                      scope.row.name
                    } 吗?`
                  )
                "
              >
                {{ scope.row.status === 'enabled' ? '禁用' : '启用' }}
              </el-button>
              <el-button
                v-ab-btn-rights:tenant_del
                v-if="scope.row.status === 'disabled'"
                text
                type="primary"
                @click="
                  sendAction(
                    `${sysApi.tenant.removeUrl}?id=${scope.row.id}&status=disabled`,
                    `确定删除 ${scope.row.name} 吗?`
                  )
                "
              >
                删除
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import { abTableMix, sysApi } from '~/agilebpm'
  export default { mixins: [abTableMix] }
</script>

<script lang="ts" setup>
  import { Search, RefreshRight, Plus } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getCurrentInstance } from 'vue'

  const query = reactive({
    name$VLK: '',
    alias$VLK: '',
    isolationMode$VEQ: '',
  })

  const currentInstance = getCurrentInstance()

  const switchTo = (rowData: any) => {
    const abTable: any = currentInstance?.refs.abTable

    ElMessageBox.confirm(`您确定切换至【${rowData.name}】上吗？`, '切换提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      abTable.loading = true
      sysApi.tenant
        .switchTo(rowData.alias)
        .then(() => {
          ElMessage({
            showClose: true,
            message: '切换成功，系统将在3秒后跳转.',
            type: 'success',
            onClose() {
              location.pathname = '/'
            },
          })
        })
        .finally(() => (abTable.loading = true))
    })
  }
</script>
