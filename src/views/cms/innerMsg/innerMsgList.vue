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
            <el-form-item :label="$abT('page.common.title','标题')" prop="title$VLK">
              <el-input v-model="query.title$VLK" placeholder=" " />
            </el-form-item>
            <el-form-item :label="$abT('page.common.status','状态')" prop="status$NEQ">
              <el-select v-model="query.status$NEQ" clearable :placeholder="$abT('page.common.all','全部')">
                <el-option :label="$abT('page.common.unread','未读')" :value="0" />
                <el-option :label="$abT('page.common.read','已读')" :value="1" />
                <el-option :label="$abT('page.common.overdue','过期')" :value="2" />
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
        <el-col class="left-panel">
          <el-button
            :disabled="!selectedData || selectedData.length == 0"
            :icon="Delete"
            style="margin-left: 12px"
            type="danger"
            @click="delBySeletedIds(cmsApi.innerMsg.cmsInnerMsgRemoveUrl)"
          >
            {{ $abT('page.common.batchDel','批量删除') }}
          </el-button>
        </el-col>
      </el-row>
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
      :url="cmsApi.innerMsg.cmsInnerMsgListUrl"
    >
      <ab-column
        :label="$abT('page.common.title','标题')"
        min-width="140"
        prop="title"
      />
      <ab-column
        ab-template="content"
        :label="$abT('page.common.content','内容')"
        min-width="160"
        prop="content"
        show-overflow-tooltip
      />
      <template #content="{ scope }">
        <span>{{ scope.row.content.replace(/<[^>]+>/g, '') }}</span>
      </template>
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        :label="$abT('page.news.releaseTime','发布时间')"
        prop="createTime"
        width="140"
      />
      <ab-column
        :ab-text-formatter="
          '0-' +
          $abT('page.common.unread', '未读') +
          '-default-light|1-' +
          $abT('page.common.read', '已读') +
          '-success-light|2-' +
          $abT('page.common.overdue', '过期') +
          '-danger-light'
        "
        align="center"
        :label="$abT('page.common.status','状态')"
        prop="status"
        width="100"
      />
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate','操作')"
        width="165"
      />
      <template #edit="{ scope }">
        <init-button
          :dialog-visible="dialogVisible"
          :search="search"
          text
          type="primary"
          @assignment="assignment($event, scope.row)"
        >
          {{ $abT('page.common.details','详情') }}
        </init-button>
        <el-button
          text
          type="primary"
          @click="
            sendAction(
              cmsApi.innerMsg.cmsInnerMsgRemoveUrl + scope.row.id,
               $abT('page.common.delMsg','确定删除 {a} 吗？',  { a: scope.row.title })
            )
          "
        >
          {{ $abT('page.common.del','删除') }}
        </el-button>
      </template>
    </ab-table>
    <el-dialog
      v-model="dialogVisible"
      :title="$abT('page.common.details','详情')"
      width="30%"
    >
      <div class="detailsBox" v-html="result.content"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">
            {{ $abT('page.common.ok','确定') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {
    Delete,
    Edit,
    Plus,
    RefreshRight,
    Search,
  } from '@element-plus/icons-vue'
  import { defineComponent, reactive, ref } from 'vue'
  import { abTableMix, cmsApi } from '~/agilebpm'
  import initButton from './initButton.vue'
  export default defineComponent({
    components: { initButton },
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        title$VLK: '',
        status$NEQ: undefined,
      })
      const dialogVisible = ref(false)
      const result = ref()

      const assignment = (search: any, row: { id: string; status: number }) => {
        dialogVisible.value = true
        result.value = row
        if (row.status == 0)
          cmsApi.innerMsg.cmsupdateReadFn(row.id).then(() => search())
      }

      return {
        assignment,
        query,
        result,
        dialogVisible,
        cmsApi,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
      }
    },
  })
</script>
<style lang="scss" scoped>
  .detailsBox {
    width: 100%;
    min-height: 50px;
  }
</style>
