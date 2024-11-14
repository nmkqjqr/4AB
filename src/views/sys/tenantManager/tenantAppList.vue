<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
          type-code="tenantAppType"
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
                  label-width="80px"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item label="名称" prop="name$VLK">
                    <el-input v-model="query.name$VLK" placeholder="名称" />
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
                <router-link v-ab-btn-rights:tenantApp_add :to="{ name: 'TenantMgrAppEdit' }">
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
            v-model="selectedData"
            :height="tableHeight"
            :query-column="[
              'id',
              'desc',
              'name',
              'isOpen',
              'typeCode',
              'updater',
              'updateTime',
            ]"
            :query-param="query"
            row-key="id"
            :url="sysApi.tenant.appListUrl"
          >
            <ab-column label="名称" min-width="120" prop="name" />
            <ab-column label="描述" min-width="120" prop="desc" />
            <ab-column label="分类" prop="typeName" width="180" />
            <ab-column
              ab-text-formatter="0-否-info-dark|1-是-success-dark"
              label="是否开放"
              prop="isOpen"
              width="120"
            />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              prop="updateTime"
              width="140"
            />
            <ab-column label="更新人" prop="updater" width="160" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="240"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:tenantApp_detail
                :to="{
                  name: 'TenantMgrAppDetail',
                  query: { id: scope.row.id },
                }"
              >
                <el-button text type="primary">详情</el-button>
              </router-link>
              <router-link
                v-ab-btn-rights:tenantApp_edit
                :to="{
                  name: 'TenantMgrAppEdit',
                  query: { id: scope.row.id },
                }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:tenantApp_del
                text
                type="primary"
                @click="
                  sendAction(
                    `${sysApi.tenant.appRemoveUrl}?id=${scope.row.id}`,
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
  import { abTableMix, sysApi, abDictTree } from '~/agilebpm'
  export default { mixins: [abTableMix] }
</script>

<script lang="ts" setup>
  import { Search, RefreshRight, Plus } from '@element-plus/icons-vue'

  const query = reactive({
    name$VLK: '',
    format$VEQ: '',
    typeCode$VIN: '',
  })
</script>
