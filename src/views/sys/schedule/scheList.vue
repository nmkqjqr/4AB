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
            <el-form-item label="标题" prop="title$VLK">
              <el-input v-model="query.title$VLK" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="类型" prop="type$VLK">
              <el-select v-model="query.type$VLK" placeholder="请选择">
                <el-option key="single" label="个人" value="single" />
                <el-option key="share" label="共享" value="share" />
                <el-option key="ilka" label="共同任务" value="ilka" />
              </el-select>
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
          <router-link v-ab-btn-rights:schedule_add to="/sys/schedule/scheEdit">
            <el-button :icon="Plus" type="primary">添加</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :checkable="false"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="sysApi.schedule.scheduleList"
    >
      <ab-column label="标题" min-width="200" prop="title" />
      <ab-column
        ab-text-formatter="single-个人-success-dark|share-共享-success-dark|ilka-共同任务-success-dark"
        align="center"
        label="类型"
        prop="type"
        width="120"
      />
      <ab-column label="所属人" prop="ownerName" width="120" />
      <ab-column label="参与者" min-width="160" prop="participantNames" />
      <ab-column label="实际开始日期" prop="actualStartTime" width="180" />
      <ab-column label="完成时间" prop="completeTime" width="180" />
      <ab-column label="提交人" min-width="120" prop="submitterName" />
      <ab-column
        ab-template="rows"
        ab-text-formatter="0-否-warning-dark|1-是-success-dark"
        align="center"
        label="锁定"
        prop="isLock"
        width="80"
      />
      <ab-column ab-template="edit" fixed="right" label="操作" width="140" />
      <template #edit="{ scope }">
        <router-link v-ab-btn-rights:schedule_edit :to="{ name: 'ScheEdit', query: { id: scope.row.id } }">
          <el-button text type="primary">编辑</el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:schedule_del
          text
          type="primary"
          @click="
            sendAction(
              sysApi.schedule.removeSchedule + scope.row.id,
              `确定删除${scope.row.title}吗?`
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
  // eslint-disable-next-line no-unused-vars
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
    name: 'ScheList',
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        title$VLK: '',
        type$VLK: '',
      })
      return {
        query,
        sysApi,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
      }
    },
  })
</script>
