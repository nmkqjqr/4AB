<template>
  <div class="comprehensive-table-container">
    <!--查询区域-->
    <div ref="titleForm">
      <el-row>
        <el-col class="top-panel" :span="24">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="62px"
            :model="query"
          >
            <el-form-item label="名称" prop="name$VLK">
              <el-input v-model="query.name$VLK" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="编码" prop="code$VLK">
              <el-input v-model="query.code$VLK" placeholder="请输入编码" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                查询
              </el-button>
              <el-button :icon="Refresh" @click="reset()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!--按钮区域-->
      <el-space wrap>
        <router-link
          v-ab-btn-rights:bizPattern_add
          :to="{ name: 'BizPatternEdit' }"
        >
          <el-button :icon="Plus" type="primary">添加</el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:bizPattern_del
          :disabled="!selectedData || selectedData.length == 0"
          :icon="Delete"
          type="danger"
          @click="delBySeletedIds(bizApi.bizPattern.BizPatternRemove)"
        >
          批量删除
        </el-button>
      </el-space>
    </div>

    <!--列表区域-->
    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      highlight-current-row
      :query-param="query"
      row-key="id"
      :url="bizApi.bizPattern.BizPatternListJson"
    >
      <ab-column label="名称" min-width="120" prop="name" />
      <ab-column label="编码" min-width="120" prop="code" />
      <ab-column label="失败提示" min-width="200" prop="message" />
      <ab-column label="java正则" min-width="200" prop="javaPattern" />
      <ab-column label="js正则" min-width="200" prop="uiPattern" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="140" />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:bizPattern_edit
          :to="{ name: 'BizPatternEdit', query: { id: scope.row.id } }"
        >
          <el-button text type="primary">编辑</el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:bizPattern_del
          text
          type="primary"
          @click="
            sendAction(
              bizApi.bizPattern.BizPatternRemove + scope.row.id,
              '确定删除' + scope.row.name + '吗?'
            )
          "
        >
          删除
        </el-button>
      </template>
    </ab-table>
  </div>
</template>

<script>
  import { bizApi, abTableMix } from '~/agilebpm'
  import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
  export default {
    name: 'BizPatternList',
    mixins: [abTableMix],
    setup() {
      return {
        Search,
        Refresh,
        Plus,
        Delete,
        bizApi,
      }
    },
  }
</script>
