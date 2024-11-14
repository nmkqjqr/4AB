<template>
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
            <el-form-item
              :label="$abT('bpm.office.processTitle', '流程标题')"
              prop="title$VLK"
            >
              <el-input
                v-model="query.title$VLK"
                :placeholder="
                  $abT('bpm.office.enterProcessTitle', '请输入流程标题')
                "
              />
            </el-form-item>
            <el-form-item
              :label="$abT('bpm.office.processCode', '流程编码')"
              prop="defKey$VLK"
            >
              <el-input
                v-model="query.defKey$VLK"
                :placeholder="$abT('page.common.enterCode', '请输入编码')"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                {{ $abT('page.common.search', '查询') }}
              </el-button>
              <el-button :icon="RefreshRight" @click="reset()">
                {{ $abT('page.common.reset', '重置') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- 关键字段设置minwith，特定枚举字段设置with（管理列、日期、状态、字典等），
         不重要字段放最后，管理列设置 fixed="right"
    -->
    <ab-table
      ref="abTable"
      v-model="selectedData"
      :checkable="false"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="bpmApi.myTask.bpmMyDraftTaskListUrl"
    >
      <ab-column
        :label="$abT('bpm.office.processTitle', '流程标题')"
        min-width="250"
        prop="title"
      />
      <ab-column
        :label="$abT('bpm.office.processCode', '流程编码')"
        min-width="100"
        prop="defKey"
      />
      <ab-column
        ab-tag-type="statusCss"
        :label="$abT('page.common.status', '状态')"
        prop="statusDesc"
        width="90"
      />
      <ab-column
        :label="$abT('page.common.createTime', '创建时间')"
        prop="createTime"
        width="160"
      />
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate', '操作')"
        width="160"
      />
      <template #edit="{ scope }">
        <router-link
          :to="{
            name: 'DraftStart',
            query: {
              instId: scope.row.id,
            },
          }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.edit', '编辑') }}
          </el-button>
        </router-link>
        <el-button
          text
          type="primary"
          @click="instanceDeleteRef.open(scope.row)"
        >
          删除
        </el-button>
      </template>
    </ab-table>
    <bpm-instance-delete
      ref="instanceDeleteRef"
      @delete-success="deleteInstanceOk"
    ></bpm-instance-delete>
  </div>
</template>

<script lang="ts">
  // eslint-disable-next-line no-unused-vars
  import { reactive, defineComponent, onMounted, getCurrentInstance } from 'vue'
  import { abTableMix, bpmApi } from '~/agilebpm'
  import bpmInstanceDelete from '../instance/bpmInstanceDelete.vue'
  import { abT } from '@/i18n'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  export default defineComponent({
    name: 'BpmMyDraftList',
    mixins: [abTableMix],
    components: { bpmInstanceDelete },
    setup() {
      const query = reactive({
        title$VLK: '',
        defKey$VLK: '',
      })
      // @ts-ignore
      const { proxy } = getCurrentInstance()

      const instanceDeleteRef = ref()
      const deleteInstanceOk = () => {
        proxy.selectedData.splice(0, proxy.selectedData.length)
        proxy.search()
      }

      return {
        query,
        bpmApi,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
        abT,
        instanceDeleteRef,
        deleteInstanceOk,
      }
    },
  })
</script>
