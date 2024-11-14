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
            <el-form-item label="模板名称" prop="name$VLK">
              <el-input v-model="query.name$VLK" placeholder="请输入模板名称" />
            </el-form-item>
            <el-form-item label="模板编码" prop="code$VLK">
              <el-input v-model="query.code$VLK" placeholder="请输入模板编码" />
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
            v-ab-btn-rights:messageTemplate_add
            style="margin-right: 8px"
            :to="{
              name: 'messageTemplateEdit',
              query: { type: '1' },
            }"
          >
            <el-button :icon="Plus" type="primary">添加</el-button>
          </router-link>
          <el-button
            v-ab-btn-rights:messageTemplate_del
            :disabled="!selectedData || selectedData.length == 0"
            icon="delete"
            type="danger"
            @click="
              delBySeletedIds(sysApi.messageTemplate.messageTemplateDelUrl)
            "
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
      :url="sysApi.messageTemplate.messageTemplateListUrl"
    >
      <ab-column label="模板名称" min-width="160" prop="name" />
      <ab-column label="模板编码" min-width="120" prop="code" />
      <ab-column label="模板描述" min-width="100" prop="desc" />
      <ab-column
        ab-text-formatter="1-是-default-light|0-否-success-light"
        label="是否启用"
        min-width="80"
        prop="enabled"
      />
      <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="更新时间" min-width="150" prop="updateTime" />
      <ab-column label="更新人" min-width="150" prop="updater" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="230" />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:messageTemplate_get
          :to="{ name: 'messageTemplateEdit', query: { id: scope.row.id } }"
        >
          <el-button text type="primary">详情</el-button>
        </router-link>
        <router-link
          v-ab-btn-rights:messageTemplate_edit
          :to="{
            name: 'messageTemplateEdit',
            query: { id: scope.row.id, type: '1' },
          }"
        >
          <el-button text type="primary">编辑</el-button>
        </router-link>

        <el-button
          v-ab-btn-rights:messageTemplate_del
          text
          type="primary"
          @click="
            sendAction(
              sysApi.messageTemplate.messageTemplateDelUrl + scope.row.id,
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
  import { abTableMix, sysApi } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  export default defineComponent({
    name: 'MessageTemplateList',
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
        sysApi,
        RefreshRight,
      }
    },
  })
</script>
