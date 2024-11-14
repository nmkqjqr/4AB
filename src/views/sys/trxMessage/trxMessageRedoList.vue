<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row ref="titleForm" class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            :model="query"
            @submit.prevent
          >
            <el-form-item label="消息ID" label-width="76px" prop="id$VLK">
              <el-input v-model="query.id$VLK" placeholder="请输入消息ID" />
            </el-form-item>
            <el-form-item label="回调器" label-width="76px" prop="caller$VLK">
              <el-input v-model="query.caller$VLK" placeholder="请输入回调器" />
            </el-form-item>
            <el-form-item label="状态" label-width="62px" prop="status$VLK">
              <el-select v-model="query.status$VLK" clearable :placeholder="$abT('page.common.all','全部')">
                <el-option label="待处理" value="WAIT" />
                <el-option label="已死亡" value="DEATH" />
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
          <el-button
            v-ab-btn-rights:trxmMessageRedo_del
            :disabled="!selectedData || selectedData.length == 0"
            :icon="Delete"
            type="danger"
            @click="delBySeletedIds(trxMessageRedoRemoveUrl)"
          >
            批量删除
          </el-button>
          <el-button
            v-ab-btn-rights:trxmMessageRedo_retry
            :disabled="!selectedData || selectedData.length == 0"
            :icon="RefreshRight"
            type="primary"
            @click="batchRetry()"
          >
            批量重试
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
      :url="cptApi.trxMessageRedoListUrl"
    >
      <ab-column label="消息ID" min-width="300" prop="id" />
      <ab-column label="回调器" prop="caller" width="130px" />
      <ab-column label="重试次数" prop="times" width="85px" />
      <ab-column
        ab-tag-type="statusCss"
        label="状态"
        prop="statusDesc"
        width="88px"
      />
      <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="创建时间" min-width="190" prop="createTime" />
      <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="最近调用时间" min-width="190" prop="updateTime" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="230" />
      <template #edit="{ scope }">
        <router-link v-ab-btn-rights:trxmMessageRedo_get :to="{ name: 'trxmMessageRedoDetail', params: scope.row }">
          <el-button text type="primary">详情</el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:trxmMessageRedo_retry
          text
          type="primary"
          @click="
            sendAction(
              cptApi.trxMessageRedoRetryUrl + scope.row.id,
              `确定重试${scope.row.id}吗?`
            )
          "
        >
          重试
        </el-button>
        <el-button
          v-ab-btn-rights:trxmMessageRedo_del
          text
          type="primary"
          @click="
            sendAction(
              cptApi.trxMessageRedoRemoveUrl + scope.row.id,
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
  // eslint-disable-next-line no-unused-vars
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, cptApi } from '~/agilebpm'
  import { ElMessageBox } from 'element-plus'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  import { getData } from '~/agilebpm'
  export default defineComponent({
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        id$VLK: '',
        caller$VLK: '',
        status$VLK: '',
      })
      const vueInst: any = getCurrentInstance()
      const batchRetry = () => {
        ElMessageBox.confirm('确定批量重试吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const url =
            cptApi.trxMessageRedoRetryUrl +
            vueInst?.data.selectedData.map((row: any) => row.id).join(',')
          const request = getData(url)
          request.then((result: any) => {
            console.log(result)
          })
        })
      }

      return {
        query,
        batchRetry,
        cptApi,
        Delete,
        Edit,
        Search,
        RefreshRight,
      }
    },
  })
</script>
