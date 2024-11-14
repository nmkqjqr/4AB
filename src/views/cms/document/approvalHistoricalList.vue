<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="top-panel">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  :model="query"
                  style="float: left"
                  @submit.prevent
                >
                  <el-form-item
                    label="文档名称"
                    label-width="90px"
                    prop="name$VLK"
                  >
                    <el-input
                      v-model="query.name$VLK"
                      placeholder="请输入文档名称"
                    />
                  </el-form-item>
                  <el-form-item
                    label="借阅人"
                    label-width="76px"
                    prop="userName$VLK"
                  >
                    <el-input
                      v-model="query.userName$VLK"
                      placeholder="请输入借阅人"
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      查询
                    </el-button>
                    <el-button :icon="RefreshRight" @click="reset()">
                      重置
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col class="top-panel">
                <el-form-item label="" prop="source">
                  状态:
                  <div>
                    <el-check-tag
                      v-for="(item, index) in info.tagList"
                      :key="index"
                      :checked="item.checked"
                      class="range"
                      @change="changeTag(item)"
                    >
                      {{ item.name }}
                    </el-check-tag>
                  </div>
                </el-form-item>
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
            :url="cmsApi.document.cmsHistoricalListUrl"
          >
            <ab-column label="文档名称" prop="documentName" width="140" />
            <ab-column label="文件作者" prop="documentAuthor" width="120" />
            <ab-column label="借阅人" prop="userName" width="120" />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="借阅时间"
              prop="borrowTime"
              width="160"
            />
            <ab-column label="借阅说明" min-width="160" prop="remark" />
            <ab-column label="审批人" prop="updater" width="120" />
            <ab-column
              ab-text-formatter="borrow-已提交|pass-已通过|reject-已驳回|revert-已归还"
              aligin="center"
              label="审批结果"
              prop="status"
              width="100"
            />

            <ab-column label="审批时间" prop="revertTime" width="160" />
          </ab-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import { abTableMix, cmsApi } from '~/agilebpm'
  export default {
    name: 'ApprovalDocumentList',
    mixins: [abTableMix],
  }
</script>

<script setup lang="ts">
  import { Search, RefreshRight } from '@element-plus/icons-vue'

  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query = reactive({
    name$VLK: '',
    userName$VLK: '',
    parentId$VIN: '',
    status$VEQ: '',
  })
  // @ts-ignore
  const { proxy } = getCurrentInstance()
  const info = reactive({
    tagList: [
      {
        checked: true,
        name: '不限',
        code: '',
      },
      {
        checked: false,
        name: '已提交',
        code: 'borrow',
      },
      {
        checked: false,
        name: '已通过',
        code: 'pass',
      },
      {
        checked: false,
        name: '已驳回',
        code: 'reject',
      },
      {
        checked: false,
        name: '已归还',
        code: 'revert',
      },
    ],
  })
  const changeTag = (item: any) => {
    info.tagList.forEach((tagItem) => (tagItem.checked = false))
    item.checked = true
    query.status$VEQ = item.code
    proxy.search()
  }
</script>
<style scoped>
  .range {
    margin-right: 0px;
    margin-left: 15px;
  }
</style>
