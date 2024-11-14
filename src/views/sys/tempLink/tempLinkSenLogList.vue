<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
          type-code="tempLink"
          @node-click="searchResetPage()"
        />
      </el-aside> -->
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <el-row class="vab-query-form">
              <el-col class="left-panel">
                <el-space>
                  <router-link
                    :to="{
                      name: 'TempLinkList',
                    }"
                  >
                    <el-button icon="Plus" type="primary">返回</el-button>
                  </router-link>
                </el-space>
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
            :url="sysApi.tempLink.tempLinkLogListUrl"
          >
            <ab-column label="业务ID" min-width="200" prop="bizId" />
            <ab-column label="邮箱" min-width="200" prop="email" />
            <ab-column label="电话" prop="phone" width="200" />
            <!-- <ab-column
              ab-template="conten"
              label="消息内容"
              min-width="230"
              prop="content"
            />
            <template #conten="{ scope }">
              <el-popover placement="right" trigger="hover" :width="400">
                <template #reference>
                  <el-button style="margin-right: 16px">推送内容</el-button>
                </template>
                <p v-html="scope.row.content"></p>
              </el-popover>
            </template> -->

            <ab-column
              ab-template="isFail"
              label="结果"
              prop="isFail"
              width="80"
            />
            <template #isFail="{ scope }">
              <el-tag
                v-if="!scope.row.isFail || scope.row.isFail === '0'"
                type="success"
              >
                成功
              </el-tag>
              <el-tag v-else type="danger">失败</el-tag>
            </template>
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="创建时间"
              prop="createTime"
              width="160"
            />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              prop="key"
              width="170"
            />
            <template #edit="{ scope }">
              <el-popover placement="right" trigger="click" :width="400">
                <template #reference>
                  <el-button
                    v-ab-btn-rights:tempLink_log
                    text
                    type="primary"
                    @click="getMsg(scope.row.id)"
                  >
                    推送内容
                  </el-button>
                </template>
                <p v-html="pageData.msg"></p>
              </el-popover>
              <el-button
                v-ab-btn-rights:tempLink_detail
                text
                type="primary"
                @click="opentDialog(scope.row.id)"
              >
                详情
              </el-button>
            </template>
          </ab-table>
          <el-dialog
            v-model="pageData.dialogVisable"
            :before-close="closeDialog"
            title="推送日志详情"
          >
            <send-log-detail v-if="pageData.dialogVisable" :id="pageData.id" />
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts">
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, abDictTree, sysApi } from '~/agilebpm'
  import sendLogDetail from './sendLogDetail.vue'
  import {
    Search,
    Plus,
    RefreshRight,
    InfoFilled,
    Delete,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    //name: 'TempLinkSenLogList',
    components: { abDictTree, sendLogDetail },
    mixins: [abTableMix],
    setup() {
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const tempLinkId = proxy.$route.query.tempLinkId

      const query: any = reactive({
        url$VLK: '',
        code$VLK: '',
        tempLinkId$VEQ: tempLinkId,
      })

      const pageData = reactive({
        dialogVisable: false,
        id: '',
        msg: '',
      })

      const getMsg = async (id: any) => {
        pageData.msg = ''
        const res = await sysApi.tempLink.sendLogMsg(id)
        if (res.isOk && res.data) {
          pageData.msg = res.data
        } else {
          pageData.msg = '无推送消息'
        }
      }

      const opentDialog = (id: any) => {
        pageData.id = id
        pageData.dialogVisable = true
      }
      const closeDialog = () => {
        pageData.dialogVisable = false
        pageData.id = ''
      }

      return {
        abDictTree,
        query,
        sysApi,
        Search,
        Plus,
        RefreshRight,
        InfoFilled,
        Delete,
        pageData,
        opentDialog,
        closeDialog,
        sendLogDetail,
        getMsg,
      }
    },
  })
</script>
