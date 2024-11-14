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
                    label="资源路径"
                    label-width="76px"
                    prop="url$VLK"
                  >
                    <el-input
                      v-model="query.url$VLK"
                      placeholder="请输入资源路径"
                    />
                  </el-form-item>
                  <el-form-item
                    label="备注"
                    label-width="76px"
                    prop="comment$VLK"
                  >
                    <el-input
                      v-model="query['comment$VLK']"
                      placeholder="请输入备注"
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button :icon="Search" type="primary" @click="search()">
                      查询
                    </el-button>
                    <el-button :icon="RefreshRight" @click="toReset()">
                      重置
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col class="left-panel">
                <el-space wrap>
                  <el-button :icon="Plus" type="primary" @click="addData()">
                    添加
                  </el-button>

                  <el-button
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Edit"
                    type="primary"
                    @click="
                      enableSwitchChange(
                        1,
                        selectedData.map((row) => row.id).join(',')
                      )
                    "
                  >
                    批量启用
                  </el-button>
                  <el-button
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Edit"
                    type="primary"
                    @click="
                      enableSwitchChange(
                        0,
                        selectedData.map((row) => row.id).join(',')
                      )
                    "
                  >
                    批量禁用
                  </el-button>
                  <el-button
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Delete"
                    type="danger"
                    @click="
                      delBySeletedIds(sysApi.resourceAuth.publicResourceDel)
                    "
                  >
                    批量删除
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
            :default-sort="{ order: 'dx', prop: 'createTime' }"
            :height="tableHeight"
            :query-param="query"
            row-key="id"
            :url="sysApi.resourceAuth.publicResourceList"
          >
            <ab-column
              v-if="dialogConf.authType != 'nfCsrfIngores'"
              label="资源路径"
              min-width="260"
              prop="url"
            />
            <ab-column
              v-if="dialogConf.authType == 'nfCsrfIngores'"
              label="CSRF忽略地址"
              min-width="260"
              prop="url"
            />
            <ab-column label="备注" min-width="160" prop="comment" />
            <ab-column
              v-if="dialogConf.authType == 'infIngores'"
              label="ip白名单"
              min-width="120"
              prop="ipMatches"
            />
            <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="更新时间" min-width="160" prop="updateTime" />
            <ab-column label="更新人" min-width="160" prop="operator" />
            <ab-column
              ab-text-formatter="1-启用-success-dark|0-禁用-danger-dark"
              label="是否开启"
              min-width="100"
              prop="status"
            />

            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="260"
            />
            <template #edit="{ scope }">
              <el-button text type="primary" @click="opentDialog(scope.row)">
                编辑
              </el-button>
              <el-button
                text
                type="primary"
                @click="
                  enableSwitchChange(
                    scope.row.status == 1 ? 0 : 1,
                    scope.row.id
                  )
                "
              >
                {{ scope.row.status ? '禁用' : '启用' }}
              </el-button>
              <el-button
                text
                type="primary"
                @click="
                  sendAction(
                    sysApi.resourceAuth.publicResourceDel + scope.row.id,
                    `确定删除 ${scope.row.comment} 吗?`
                  )
                "
              >
                删除
              </el-button>
            </template>
          </ab-table>
          <el-dialog
            v-model="dialogConf.dialogVisable"
            :before-close="closeDialog"
            destroy-on-close
            :title="
              authType == 'infWhiteList'
                ? '公共资源配置'
                : authType == 'infIngores'
                ? '匿名接口配置'
                : authType == 'infCsrfIngores'
                ? 'csrf忽略地址配置'
                : authType == 'signIngores'
                ? '接口签名配置'
                : '资源配置'
            "
            width="660"
          >
            <resource-auth-detail
              :data="rowData"
              :dialog-conf="dialogConf"
              @callback="callbackFn"
            />
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import { abTableMix } from '~/agilebpm'
  export default {
    name: 'ResourceAuthList',
    mixins: [abTableMix],
  }
</script>
<script setup>
  // eslint-disable-next-line no-unused-vars
  import { ref, reactive, defineComponent, getCurrentInstance } from 'vue'
  import { sysApi,abUtil } from '~/agilebpm'
  import ResourceAuthDetail from './resourceAuthDetail.vue'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'

  const authType = getCurrentInstance()?.proxy?.$route.params.code

  // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
  const query = reactive({
    operator$VLK: '',
    url$VLK: '',
    comment$VLK: '',
    authType$VLK: authType,
  })
  // @ts-ignore
  const { proxy } = getCurrentInstance()

  const timeRange = ref()

  const toReset = () => {
    timeRange.value = []
    query.url$VLK = ''
    query.comment$VLK = ''
    proxy.search()
  }
  const addData = () => {
    dialogConf.value.dialogVisable = true
    rowData.value = {
      url: '',
      comment: '',
      ipMatches: '',
      status: 1,
      authType: authType,
    }
  }

  const dialogConf = ref({
    dialogVisable: false,
    authType: authType,
  })
  const rowData = ref()

  const opentDialog = (data) => {
    
    rowData.value = abUtil.clone(data)
    dialogConf.value.dialogVisable = true
  }
  const closeDialog = () => {
    dialogConf.value.dialogVisable = false
    rowData.value = null
  }
  const callbackFn = () => {
    proxy.search()
  }

  const enableSwitchChange = (type, id) => {
    sysApi.resourceAuth.publicResourceUpdateStatus(id, type).then((result) => {
      proxy.search()
      ElMessage({
        message: result.msg,
        type: 'success',
      })
    })
  }
</script>
