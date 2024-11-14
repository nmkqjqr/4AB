<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="104px"
            :model="query"
            @submit.prevent
          >
            <el-form-item label="数据源名称" prop="name$VLK">
              <el-input v-model="query.name$VLK" placeholder="请输入数据源名称" />
            </el-form-item>
            <el-form-item label="数据源别名" prop="alias$VLK">
              <el-input v-model="query.alias$VLK" placeholder="请输入数据源别名" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                查询
              </el-button>
              <el-button :icon="RefreshRight" @click="reset()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="left-panel">
          <router-link v-ab-btn-rights:dataSource_add to="DataSourceEdit">
            <el-button :icon="Plus" type="primary">添加</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      :checkable="false"
      :query-param="query"
      :url="sysApi.dataSource.dataSourceList"
    >
      <ab-column label="数据源名称" min-width="120" prop="name" />
      <ab-column label="数据源别名" min-width="120" prop="alias" />
      <ab-column label="数据源类型" min-width="120" prop="dbTypeDesc" />
      <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="更新时间" min-width="160" prop="updateTime" />
      <ab-column label="更新人" min-width="160" prop="updater" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="220" />
      <template #edit="{ scope }">
        <el-button
          v-ab-btn-rights:dataSource_test
          text
          type="primary"
          @click="sysApi.dataSource.dataSourceCheck(scope.row.alias)"
        >
          测试连接
        </el-button>
        <router-link
          v-ab-btn-rights:dataSource_edit
          :to="{ name: 'DataSourceEdit', query: { id: scope.row.id } }"
        >
          <el-button
            v-if="scope.row.alias != 'dataSourceDefault'"
            text
            type="primary"
          >
            编辑
          </el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:dataSource_del
          v-if="scope.row.alias != 'dataSourceDefault'"
          text
          type="primary"
          @click="
            sendAction(
              sysApi.dataSource.dataSourceRemove + scope.row.id,
              `确定删除${scope.row.name}吗?`
            )
          "
        >
          删除
        </el-button>
      </template>
    </ab-table>
  </div>
</template>

<script lang="ts">
  import { reactive, defineComponent } from 'vue'
  import { abTableMix, sysApi } from '~/agilebpm'
  import { Search, Plus, RefreshRight } from '@element-plus/icons-vue'
  export default defineComponent({
    name: 'DataSourceList',
    mixins: [abTableMix],
    setup() {
      const query = reactive({
        name$VLK: '',
        alias$VLK: '',
      })

      return {
        query,
        sysApi,
        Search,
        Plus,
        RefreshRight,
      }
    },
  })
</script>
