<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="90px"
            :model="query"
            @submit.prevent
          >
            <el-form-item label="科目名称" prop="name$VLK">
              <el-input v-model="query.name$VLK" placeholder="请输入薪酬科目" />
            </el-form-item>
            <el-form-item label="科目编码" prop="code$VLK">
              <el-input
                v-model="query.code$VLK"
                placeholder="请输入薪酬科目编码"
              />
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
          <router-link
            v-ab-btn-rights:salaryRule_add
            style="margin-right: 8px"
            :to="{
              name: 'SalaryRuleEdit',
              query: { type: '1' },
            }"
          >
            <el-button :icon="Plus" type="primary">添加</el-button>
          </router-link>
          <el-button
            v-ab-btn-rights:salaryRule_del
            :disabled="!selectedData || selectedData.length == 0"
            icon="delete"
            type="danger"
            @click="delBySeletedIds(salaryApi.salaryRuleDelUrl)"
          >
            批量删除
          </el-button>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="salaryApi.salaryRuleListUrl"
    >
      <ab-column label="科目名称" min-width="180" prop="name" />
      <ab-column label="科目编码" min-width="120" prop="code" />
      <ab-column label="科目类型" min-width="120" prop="typeName" />
      <ab-column label="计算方式" min-width="100" prop="typeDesc" />
      <ab-column label="薪酬说明" min-width="100" prop="salaryComment" />

      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        label="更新时间"
        min-width="150"
        prop="updateTime"
      />
      <ab-column label="更新人" min-width="150" prop="operator" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="230" />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:salaryRule_get
          :to="{ name: 'SalaryRuleEdit', query: { id: scope.row.id } }"
        >
          <el-button text type="primary">详情</el-button>
        </router-link>
        <router-link
          v-ab-btn-rights:salaryRule_edit
          :to="{
            name: 'SalaryRuleEdit',
            query: { id: scope.row.id, type: '1' },
          }"
        >
          <el-button text type="primary">编辑</el-button>
        </router-link>

        <el-button
          v-ab-btn-rights:salaryRule_del
          text
          type="primary"
          @click="
            sendAction(
              salaryApi.salaryRuleDelUrl + scope.row.id,
              `确定删除【 ${scope.row.name} 】吗?`
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
  import { abTableMix, salaryApi } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  export default defineComponent({
    name: 'SalaryRuleList',
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
        code$VLK: '',
        enabled$VLK: '',
      })
      return {
        query,
        Delete,
        Edit,
        Search,
        Plus,
        salaryApi,
        RefreshRight,
      }
    },
  })
</script>
