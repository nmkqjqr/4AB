<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
          type-code="auditLogType"
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
                  <el-form-item label="接口地址" prop="path$VLK">
                    <el-input
                      v-model="query.path$VLK"
                      placeholder="请输入接口地址"
                    />
                  </el-form-item>
                  <el-form-item label="动作" prop="action$VLK">
                    <el-input
                      v-model="query.action$VLK"
                      placeholder="请输入动作"
                    />
                  </el-form-item>
                  <el-form-item
                    label="是否启用"
                    label-width="90px"
                    prop="enabled$NEQ"
                  >
                    <el-select
                      v-model="query.enabled$NEQ"
                      :placeholder="$abT('page.common.all','全部')"
                      clearable
                    >
                      <el-option label="是" value="1" />
                      <el-option label="否" value="0" />
                    </el-select>
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
                  <router-link
                    v-ab-btn-rights:auditLogMetadata_add
                    :to="{
                      name: 'LogMetadataEdit',
                      query: { typeCode: query.typeCode$VEQ },
                    }"
                  >
                    <el-button :icon="Plus" type="primary">添加</el-button>
                  </router-link>
                  <el-button
                    v-ab-btn-rights:auditLogMetadata_del
                    :disabled="!selectedData || selectedData.length == 0"
                    :icon="Delete"
                    type="danger"
                    @click="
                      delBySeletedIds(sysApi.sysAuditlog.logMetadataRemove)
                    "
                  >
                    批量删除
                  </el-button>
                  <el-button
                    v-ab-btn-rights:auditLogMetadata_updateEnabled
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
                    批量启用
                  </el-button>
                  <el-button
                    v-ab-btn-rights:auditLogMetadata_updateEnabled
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
                    批量禁用
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
            :url="sysApi.sysAuditlog.logMetadataList"
          >
            <ab-column label="操作" min-width="160" prop="action" />
            <ab-column label="记录接口地址" min-width="140" prop="path" />
            <ab-column
              label="记录描述模板"
              min-width="180"
              prop="descriptionTpl"
            />
            <ab-column
              ab-text-formatter="true-启用-success-dark|false-禁用-danger-dark"
              label="是否启用"
              prop="enabled"
              width="90"
            />
            <ab-column
              ab-date-formatter="yyyy-MM-dd HH:mm"
              label="更新时间"
              min-width="120"
              prop="updateTime"
            />
            <ab-column label="更新人" min-width="120" prop="updater" />

            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="200"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:auditLogMetadata_edit
                :to="{ name: 'LogMetadataEdit', query: { id: scope.row.id } }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:auditLogMetadata_updateEnabled
                text
                type="primary"
                @click="enableSwitchChange(scope.row.enabled, scope.row.id)"
              >
                {{ scope.row.enabled ? '禁用' : '启用' }}
              </el-button>
              <el-button
                v-ab-btn-rights:auditLogMetadata_del
                text
                type="primary"
                @click="
                  sendAction(
                    sysApi.sysAuditlog.logMetadataRemove + scope.row.id,
                    `确定删除${scope.row.action}吗?`
                  )
                "
              >
                删除
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
  import { ElMessage } from 'element-plus'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  export default defineComponent({
    name: 'LogMetadataList',
    components: { abDictTree },
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        path$VLK: '',
        action$VLK: '',
        enabled$NEQ: '',
        typeCode$VIN: '',
      })
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const enableSwitchChange = (enabledStatus: any, id: any) => {
        sysApi.sysAuditlog
          .logMetadataUpdateEnable(id, !enabledStatus)
          .then((result: any) => {
            proxy.search()
            ElMessage({
              message: result.msg,
              type: 'success',
            })
          })
      }
      return {
        query,
        sysApi,
        abDictTree,
        enableSwitchChange,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
      }
    },
  })
</script>
