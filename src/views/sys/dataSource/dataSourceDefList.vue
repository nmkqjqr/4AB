<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="62px"
            :model="query"
            @submit.prevent
          >
            <el-form-item label="名称" prop="name$VLK">
              <el-input v-model="query.name$VLK" placeholder="请输入名称" />
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
          <el-space>
            <router-link v-ab-btn-rights:dataSourceDef_add to="DataSourceDefEdit">
              <el-button :icon="Plus" type="primary">添加</el-button>
            </router-link>
            <el-button
              v-ab-btn-rights:dataSourceDef_del
              :disabled="!selectedData || selectedData.length == 0"
              :icon="Delete"
              type="danger"
              @click="delBySeletedIds(sysApi.dataSource.dataSourceDefRemove)"
            >
              批量删除
            </el-button>
          </el-space>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="sysApi.dataSource.dataSourceDefList"
    >
      <ab-column label="名称" min-width="120" prop="name" />
      <ab-column label="类路径" min-width="220" prop="classPath" />
      <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="更新时间" min-width="160" prop="updateTime" />
      <ab-column label="更新人" min-width="160" prop="updater" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="140" />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:dataSourceDef_edit
          :to="{ name: 'DataSourceDefEdit', query: { id: scope.row.id } }"
        >
          <el-button text type="primary">编辑</el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:dataSourceDef_del
          text
          type="primary"
          @click="
            sendAction(
              sysApi.dataSource.dataSourceDefRemove + scope.row.id,
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
  import { Search, Plus, RefreshRight, Delete } from '@element-plus/icons-vue'
  export default defineComponent({
    name: 'DataSourceDefList',
    mixins: [abTableMix],
    setup() {
      // 条件入参展开时所占的行数，会根据行数计算table高度，建议设置下，默认2行
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const paramLine = 2
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
      })

      return {
        query,
        sysApi,
        Search,
        Plus,
        Delete,
        RefreshRight,
      }
    },
  })
</script>
