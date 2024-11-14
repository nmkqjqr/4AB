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
              <el-select v-model="query.status$NEQ" :placeholder="$abT('page.common.all','全部')" clearable>
                <el-option :label="$abT('page.news.unpublished','未发布')" :value="0" />
                <el-option :label="$abT('page.news.release','发布')" :value="1" />
                <el-option :label="$abT('page.common.shelves','下架')" :value="2" />
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
          <router-link v-ab-btn-rights:notify_add to="/cms/notice/noticeEdit">
            <el-button :icon="Plus" type="primary">
              {{ $abT('page.common.add','添加') }}
            </el-button>
          </router-link>
          <el-button
            v-ab-btn-rights:notify_del
            :disabled="!selectedData || selectedData.length === 0"
            :icon="Delete"
            style="margin-left: 12px"
            type="danger"
            @click="delBySeletedIds(cmsApi.notify.cmsNotifyRemoveUrl)"
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
      :url="cmsApi.notify.cmsNotifyListUrl"
    >
      <ab-column
        :label="$abT('page.common.title','标题')"
        min-width="160"
        prop="title"
      />
      <ab-column
        :label="$abT('page.common.type','类型')"
        min-width="100"
        prop="typeIdName"
      />
      <ab-column
        :ab-text-formatter="
          '0-' +
          $abT('page.news.unpublished', '未发布') +
          '-default-light|1-' +
          $abT('page.news.release', '发布') +
          '-success-light|2-' +
          $abT('page.common.shelves', '下架') +
          '-danger-light'
        "
        aligin="center"
        :label="$abT('page.common.status','状态')"
        prop="status"
        width="100"
      />
      <ab-column
        :label="$abT('page.news.operator','操作人')"
        prop="releaseName"
        width="120"
      />
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        :label="$abT('page.news.releaseTime','发布时间')"
        prop="releaseTime"
        width="140"
      />
      <ab-column
        ab-template="cmsNotifyShareList"
        :label="$abT('page.notice.notification','通知部门')"
        min-width="150"
      />
      <template #cmsNotifyShareList="{ scope }">
        <span v-for="item in scope.row.cmsNotifyShareList" :key="item.id">
          {{ item.groupName + ' ' }}
        </span>
      </template>
      <ab-column
        :label="$abT('page.news.readCount','阅读量')"
        prop="visitNum"
        width="100"
      />
      <ab-column
        :label="$abT('page.news.commentCount','评论量')"
        prop="commentsNum"
        width="100"
      />
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        :label="$abT('page.common.updateTime','更新时间')"
        prop="updateTime"
        width="140"
      />
      <ab-column
        :label="$abT('page.common.updater','更新人')"
        prop="updater"
        width="100"
      />
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate','操作')"
        width="285"
      />
      <template #edit="{ scope }">
        <router-link
          v-if="
            scope.row.status === 1 ||
            scope.row.status === 0 ||
            scope.row.status === 2
          "
          v-ab-btn-rights:notify_get
          :to="{
            name: 'NoticeDetails',
            query: { id: scope.row.id, form: true, type: 'NoticeList' },
          }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.details','详情') }}
          </el-button>
        </router-link>
        <el-button
          v-if="scope.row.status === 1"
          v-ab-btn-rights:notify_withdraw
          text
          type="primary"
          @click="
            sendAction(
              cmsApi.notify.cmsNotifywithdrawNotifyUrl + scope.row.id,
              $abT('page.news.removeTip','确定取消发布{a}吗?', scope.row.title)
            )
          "
        >
          {{ $abT('page.common.shelves','下架') }}
        </el-button>
        <router-link
          v-if="scope.row.status === 0 || scope.row.status === 2"
          v-ab-btn-rights:notify_edit
          :to="{ name: 'NoticeEdit', query: { id: scope.row.id } }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.edit','编辑') }}
          </el-button>
        </router-link>
        <el-button
          v-if="scope.row.status === 0 || scope.row.status === 2"
          v-ab-btn-rights:notify_del
          text
          type="primary"
          @click="
            sendAction(
              cmsApi.notify.cmsNotifyRemoveUrl + scope.row.id,
              $abT('page.common.delMsg','确定删除 {a} 吗？', { a: scope.row.title })
            )
          "
        >
          {{ $abT('page.common.del','删除') }}
        </el-button>
        <el-button
          v-if="scope.row.status === 0 || scope.row.status === 2"
          v-ab-btn-rights:notify_release
          text
          type="primary"
          @click="
            sendAction(
              cmsApi.notify.cmsNotifyreleaseNotifyUrl + scope.row.id,
              $abT('page.common.confirmPublish','确认发布吗?')
            )
          "
        >
          {{ $abT('page.news.release','发布') }}
        </el-button>
      </template>
    </ab-table>
  </div>
</template>

<script lang="ts">
  // eslint-disable-next-line no-unused-vars
  import {
    Delete,
    Edit,
    Plus,
    RefreshRight,
    Search,
  } from '@element-plus/icons-vue'
  import { defineComponent, reactive } from 'vue'
  import { abTableMix, cmsApi } from '~/agilebpm'

  export default defineComponent({
    name: 'NoticeList',
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        title$VLK: '',
        status$NEQ: '',
      })
      return {
        query,
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
