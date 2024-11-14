<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
          type-code="tempLink"
          @node-click="searchResetPage()"
        />
      </el-aside>
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
                  <el-form-item label="编码" prop="code$VLK">
                    <el-input
                      v-model="query.code$VLK"
                      placeholder="请输入编码"
                    />
                  </el-form-item>
                  <el-form-item label="跳转路径" prop="url$VLK">
                    <el-input
                      v-model="query.url$VLK"
                      placeholder="请输入跳转路径"
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
              <el-col class="left-panel">
                <el-space>
                  <!-- <router-link
                    :to="{
                      name: 'ScriptEdit',
                      query: { typeCode: query.typeCode$VEQ },
                    }"
                  >
                    <el-button icon="Plus" type="primary">添加</el-button>
                  </router-link> -->
                  <el-button
                    v-ab-btn-rights:tempLink_del
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Delete"
                    type="danger"
                    @click="delBySeletedIds(sysApi.tempLink.tempLinkRemove)"
                  >
                    批量删除
                  </el-button>
                </el-space>
              </el-col>
            </el-row>
          </div>

          <ab-table
            ref="abTable"
            v-model="selectedData"
            :height="tableHeight"
            :query-param="query"
            row-key="id"
            :url="sysApi.tempLink.tempLinkListUrl"
          >
            <ab-column label="编码" prop="code" width="280" />
            <ab-column label="备注" min-width="200" prop="desc" />
            <ab-column label="跳转路径" min-width="230" prop="url" />
            <ab-column
              ab-template="expirationTime"
              label="到期时间"
              width="160"
            />
            <template #expirationTime="{ scope }">
              <span
                v-if="new Date(scope.row.expirationTime) < new Date()"
                style="color: crimson"
              >
                {{ scope.row.expirationTime }}
              </span>
              <span v-else>{{ scope.row.expirationTime }}</span>
            </template>
            <ab-column label="最大访问次数" prop="maxVisits" width="120" />
            <ab-column ab-template="visits" label="已访问次数" width="100" />
            <template #visits="{ scope }">
              <span
                v-if="scope.row.visits >= scope.row.maxVisits"
                style="color: crimson"
              >
                {{ scope.row.maxVisits }}
              </span>
              <span v-else>{{ scope.row.visits }}</span>
            </template>

            <ab-column
              ab-text-formatter="1-是-success-dark|0-否-danger-dark|200-过期-warning-dark|100-限次-warning-dark"
              label="可用"
              prop="enabled"
              width="60"
            />
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
              width="220"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:tempLink_logList
                :to="{
                  name: 'TempLinkSenLogList',
                  query: { tempLinkId: scope.row.id },
                }"
              >
                <el-button text type="primary">推送日志</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:tempLink_del
                text
                type="primary"
                @click="
                  sendAction(
                    sysApi.tempLink.tempLinkRemove + scope.row.id,
                    `确定删除${scope.row.code}吗?`
                  )
                "
              >
                删除
              </el-button>
              <el-button
                v-ab-btn-rights:tempLink_updateTime
                text
                type="primary"
                @click="openDialog(scope.row)"
              >
                续期
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      v-model="dialogVisible"
      title="续期"
      width="600"
      :destroy-on-close="true"
    >
      <el-form :model="renewalForm" label-suffix="：" label-width="150px">
        <el-form-item label="临时链接备注">
          {{ pageData.title }}
        </el-form-item>
        <el-form-item label="新的到期时间">
          <el-date-picker
            v-model="renewalForm.dueTime"
            type="date"
            placeholder="请选择到期时间"
            :disabled-date="disabledDate"
            value-format="x"
          />
        </el-form-item>
        <el-form-item label="新增访问次数">
          <el-input-number
            :min="0"
            controls-position="right"
            v-model="renewalForm.visits"
            placeholder="请输入访问次数"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="renewalFn()">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, abDictTree, sysApi, abTools } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  import {
    Search,
    Plus,
    RefreshRight,
    InfoFilled,
    Delete,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'TempLinkList',
    components: { abDictTree },
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query: any = reactive({
        url$VLK: '',
        code$VLK: '',
        typeCode$VEQ: '',
      })
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const pageData = reactive({
        title: '',
        dueTime: '',
      })
      const renewalForm = reactive({
        id: '',
        dueTime: '',
        visits: 0,
      })

      const disabledDate = (time: Date) => {
        if (!pageData.dueTime) {
          return new Date().getTime() > time.getTime()
        }
        return (
          new Date(pageData.dueTime).getTime() >= time.getTime() ||
          new Date().getTime() > time.getTime()
        )
      }

      const dialogVisible = ref(false)
      const openDialog = (row: any) => {
        dialogVisible.value = true
        renewalForm.id = row.id
        renewalForm.dueTime = ''
        renewalForm.visits = 0
        pageData.title = row.desc
        pageData.dueTime = row.expirationTime
      }
      const renewalFn = async () => {
        if (!renewalForm.id) {
          ElMessage({
            message: '链接id不能为空',
            type: 'warning',
          })
          return
        }
        const res = await sysApi.tempLink.renewal(renewalForm)

        ElMessage({
          message: res.msg,
          type: 'success',
        })
        renewalForm.id = ''
        renewalForm.dueTime = ''
        renewalForm.visits = 0
        pageData.title = ''
        pageData.dueTime = ''
        dialogVisible.value = false
        proxy.search()
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
        dialogVisible,
        openDialog,
        renewalForm,
        disabledDate,
        pageData,
        renewalFn,
      }
    },
  })
</script>
