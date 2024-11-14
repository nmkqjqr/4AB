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
                  @submit.prevent
                >
                  <el-form-item
                    :label="
                      $abT('page.workHandover.handoverPersonnel', '交接人员')
                    "
                    prop="h.fullname$VLK"
                  >
                    <el-input
                      v-model="query['h.fullname$VLK']"
                      :placeholder="$abT('page.common.enterName', '请输入名称')"
                    />
                  </el-form-item>
                  <el-form-item
                    :label="
                      $abT('page.workHandover.receivingPersonnel', '接收人员')
                    "
                    prop="r.fullname$VLK"
                  >
                    <el-input
                      v-model="query['r.fullname$VLK']"
                      :placeholder="$abT('page.common.enterName', '请输入名称')"
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
              <el-col class="left-panel">
                <el-space>
                  <router-link
                    v-ab-btn-rights:workHandover_add
                    :to="{
                      name: 'WorkHandoverEdit',
                      query: {},
                    }"
                  >
                    <el-button type="primary">
                      {{ $abT('page.common.add', '添加') }}
                    </el-button>
                  </router-link>

                  <el-button
                    v-ab-btn-rights:workHandover_del
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Delete"
                    type="danger"
                    @click="delBySeletedIds(sysApi.workHandover.deleteUrl)"
                  >
                    {{ $abT('page.common.batchDel', '批量删除') }}
                  </el-button>
                </el-space>
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
            :url="sysApi.workHandover.listJsonUrl"
          >
            <ab-column
              :label="$abT('page.workHandover.handoverPersonnel', '交接人员')"
              min-width="80"
              prop="handoverName"
            />
            <ab-column
              :label="$abT('page.workHandover.receivingPersonnel', '接收人员')"
              min-width="80"
              prop="receiveName"
            />
            <ab-column
              :label="$abT('page.workHandover.handoverTime', '交接时间')"
              prop="createTime"
              width="200"
            />
            <ab-column
              :label="$abT('page.common.remark', '备注')"
              min-width="120"
              prop="desc"
            />
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate', '操作')"
              width="180"
            />
            <template #edit="{ scope }">
              <router-link
                :to="{
                  name: 'WorkHandoverEdit',
                  query: { userId: scope.row.handoverUserId },
                }"
              >
                <el-button v-ab-btn-rights:workHandover_add text type="primary">
                  {{ $abT('page.common.edit', '编辑') }}
                </el-button>
              </router-link>

              <el-button
                v-ab-btn-rights:workHandover_del
                text
                type="primary"
                @click="
                  sendAction(
                    `${sysApi.workHandover.deleteUrl}${scope.row.id}`,
                    $abT('page.common.delMsg', '确定删除{a}吗?', {
                      a: scope.row.desc,
                    })
                  )
                "
              >
                {{ $abT('page.common.del', '删除') }}
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, abDictTree, sysApi } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    InfoFilled,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'WorkHandoverList',
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query: any = reactive({
        'h.fullname$VLK': '',
        'r.fullname$VLK': '',
      })

      const showAddDialog = ref(false)

      return {
        query,
        sysApi,
        abDictTree,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
        InfoFilled,
        showAddDialog,
      }
    },
  })
</script>
