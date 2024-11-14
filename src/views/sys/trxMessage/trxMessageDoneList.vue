<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="76px"
            :model="query"
            @submit.prevent
          >
            <el-form-item label="消息ID" prop="id$VLK">
              <el-input v-model="query.id$VLK" placeholder="请输入消息ID" />
            </el-form-item>
            <el-form-item label="回调器" prop="caller$VLK">
              <el-input v-model="query.caller$VLK" placeholder="请输入回调器" />
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
          <el-button
            v-ab-btn-rights:trxmMessageDone_del
            :disabled="!selectedData || selectedData.length == 0"
            icon="delete"
            type="danger"
            @click="delBySeletedIds(cptApi.trxMessageDoneRemoveUrl)"
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
      :url="cptApi.trxMessageDoneListUrl"
    >
      <ab-column label="消息ID" min-width="180" prop="id" />
      <ab-column label="回调器" min-width="80" prop="caller" />
      <ab-column label="重试次数" min-width="100" prop="times" />
      <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="创建时间" min-width="180" prop="createTime" />
      <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="完成时间" min-width="180" prop="updateTime" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="170" />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:trxmMessageDone_get
          :to="{ name: 'trxmMessageDoneDetail', query: { id: scope.row.id } }"
        >
          <el-button text type="primary">详情</el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:trxmMessageDone_del
          text
          type="primary"
          @click="
            sendAction(
              cptApi.trxMessageDoneRemoveUrl + scope.row.id,
              `确定删除${scope.row.id}吗?`
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
  import { abTableMix, cptApi } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  export default defineComponent({
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        id$VLK: '',
        caller$VLK: '',
        status$VLK: '',
      })
      return {
        query,
        Delete,
        cptApi,
        Edit,
        Search,
        RefreshRight,
      }
    },
  })
</script>
