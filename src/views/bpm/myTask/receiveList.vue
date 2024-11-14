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
                  label-width="120px"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item
                    :label="$abT('bpm.office.processTitle', '流程标题')"
                    prop="b.title$VLK"
                  >
                    <el-input
                      v-model="query['b.title$VLK']"
                      :placeholder="
                        $abT('page.common.enterTitle', '请输入标题')
                      "
                    />
                  </el-form-item>
                  <el-form-item
                    :label="$abT('bpm.office.taskName', '任务名称')"
                    prop="taskName$VLK"
                  >
                    <el-input
                      v-model="query.taskName$VLK"
                      :placeholder="$abT('page.common.enterName', '请输入名称')"
                    />
                  </el-form-item>
                  <el-form-item
                    v-show="collapse"
                    :label="$abT('page.common.status', '状态')"
                    prop="a.status$VEQ"
                  >
                    <el-select v-model="query['a.status$VEQ']" clearable :placeholder="$abT('page.common.all','全部')">
                      <el-option
                        :label="$abT('page.common.read', '已读')"
                        value="read"
                      />
                      <el-option
                        :label="$abT('page.common.unread', '未读')"
                        value="unread"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-show="collapse"
                    :label="$abT('page.common.type', '类型')"
                    prop="b.type$VEQ"
                  >
                    <el-select v-model="query['b.type$VEQ']" clearable :placeholder="$abT('page.common.all','全部')">
                      <el-option
                        :label="$abT('bpm.office.cc', '抄送')"
                        value="cc"
                      />
                      <el-option
                        :label="$abT('bpm.office.circulation', '传阅')"
                        value="circularize"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      {{ $abT('page.common.search', '查询') }}
                    </el-button>
                    <el-button :icon="RefreshRight" @click="reset()">
                      {{ $abT('page.common.reset', '重置') }}
                    </el-button>
                    <el-button type="text" @click="handleCollapse()">
                      <span v-if="!collapse" type="text">
                        {{ $abT('page.common.expand', '展开') }}
                      </span>
                      <span v-else type="text">
                        {{ $abT('page.common.merge', '合并') }}
                      </span>
                      <el-icon class="el-icon--right">
                        <ArrowUp v-if="collapse" />
                        <ArrowDown v-else />
                      </el-icon>
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col class="left-panel">
                <el-button
                  :disabled="!selectedData || selectedData.length == 0"
                  type="primary"
                  @click="
                    delBySeletedIds(
                      bpmApi.bpmPlugincarboncopy.bpmCarbonCopyUpdateReadUrl,
                      `${abT(
                        'bpm.office.confirmRead',
                        '请确认将选中记录更新为已读吗'
                      )}？`
                    )
                  "
                >
                  {{ $abT('bpm.office.markRead', '标记已读') }}
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
            :url="bpmApi.bpmPlugincarboncopy.bpmMyReceiveListUrl"
          >
            <ab-column
              :label="$abT('page.common.title', '标题')"
              prop="title"
            />
            <ab-column
              :label="$abT('bpm.office.taskName', '任务名称')"
              prop="taskName"
            />
            <ab-column
              :label="$abT('page.common.sender', '发送人')"
              prop="triggerUserName"
              width="120"
            />
            <ab-column
              :ab-text-formatter="`cc-${$abT(
                'bpm.office.cc',
                '抄送'
              )}-success|circularize-${$abT(
                'bpm.office.circulation',
                '传阅'
              )}-success`"
              :label="$abT('bpm.office.ccAndCirculate', '抄送/传阅')"
              prop="type"
              width="120"
            />
            <ab-column
              :ab-text-formatter="`read-${$abT(
                'page.common.read',
                '已读'
              )}-info|unread-${$abT(
                'page.common.unread',
                '未读'
              )}-warning|reviewed-${$abT(
                'bpm.office.reviewed',
                '已审阅'
              )}-success`"
              :label="$abT('page.common.status', '状态')"
              prop="status"
              width="110"
            />
            <ab-column
              :label="$abT('bpm.office.sendTime', '抄送/传阅')"
              prop="receiveTime"
              width="180"
            />
            <ab-column
              ab-template="edit"
              fixed="right"
              :label="$abT('page.common.operate', '操作')"
              prop="key"
              width="230"
            />
            <template #edit="{ scope }">
              <router-link
                :to="{
                  name: 'BpmInstanceDetail',
                  query: {
                    id: scope.row.id,
                    type: 'carbonId',
                  },
                }"
              >
                <el-button
                  text
                  type="primary"
                  @click="
                    bpmApi.bpmPlugincarboncopy.updateReadStatus(scope.row)
                  "
                >
                  {{ $abT('page.common.details', '详情') }}
                </el-button>
              </router-link>
              <el-button text type="primary" @click="showMsg(scope.row)">
                {{ $abT('page.common.messageContent', '消息内容') }}
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts">
  import { reactive, defineComponent } from 'vue'
  import { abTableMix, bpmApi, abTools } from '~/agilebpm'
  import { ElMessageBox } from 'element-plus'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    InfoFilled,
    ArrowUp,
    ArrowDown,
  } from '@element-plus/icons-vue'
  import { Codemirror } from 'vue-codemirror'
  import { abT } from '@/i18n'

  export default defineComponent({
    name: 'BpmMyReceiveList',
    components: { ArrowUp, ArrowDown },
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query: any = reactive({
        'b.title$VLK': '',
        taskName$VLK: '',
        'a.status$VEQ': '',
        'b.type$VEQ': '',
      })
      const showMsg = (row: any) => {
        bpmApi.bpmPlugincarboncopy
          .getCarbonCopyRecord(row.recordId)
          .then((result: any) => {
            ElMessageBox.alert(result.data.content, row.subject, {
              confirmButtonText: abT('page.common.close', '关闭'),
              dangerouslyUseHTMLString: true,
            })
          })
      }
      // @ts-ignore
      const { proxy } = abTools.useCurrentInstance()
      const status = proxy.$route.query.status
      if (status) {
        query['a.status$VEQ'] = 'unread'
      }
      return {
        bpmApi,
        showMsg,
        query,
        Search,
        Plus,
        RefreshRight,
        Delete,
        Edit,
        InfoFilled,
        ArrowUp,
        ArrowDown,
        abT,
      }
    },
  })
</script>
