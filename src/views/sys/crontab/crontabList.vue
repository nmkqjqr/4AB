<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left-tree">
        <ab-dict-tree
          v-model="query.typeCode$VIN"
          type-code="crontab"
          @node-click="searchResetPage()"
        />
      </el-aside>
      <el-main>
        <div class="comprehensive-table-container">
          <div ref="titleForm">
            <!-- 查询条件 -->
            <el-row>
              <el-col class="top-panel" :span="24">
                <el-form
                  ref="queryForm"
                  :inline="true"
                  :model="query"
                  @submit.prevent
                >
                  <el-form-item
                    label="任务标识"
                    label-width="90px"
                    prop="jobKey$VLK"
                  >
                    <el-input
                      v-model="query.jobKey$VLK"
                      placeholder="任务标识"
                    />
                  </el-form-item>
                  <el-form-item
                    label="任务描述"
                    label-width="90px"
                    prop="description$VLK"
                  >
                    <el-input
                      v-model="query.description$VLK"
                      placeholder="任务描述"
                    />
                  </el-form-item>
                  <el-form-item
                    label="执行器类型"
                    label-width="104px"
                    prop="executorType$VEQ"
                  >
                    <el-select v-model="query.executorType$VEQ" clearable :placeholder="$abT('page.common.all','全部')">
                      <el-option label="注解" value="annotation" />
                      <el-option label="Bean" value="bean" />
                      <el-option label="脚本" value="groovyScript" />
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
            </el-row>
            <!-- 按钮区域 -->
            <el-space wrap>
              <router-link
                v-ab-btn-rights:crontab_add
                :to="{
                  name: 'crontabEdit',
                  query: { typeCode: query['typeCode$VEQ'] },
                }"
              >
                <el-button  :icon="Plus" type="primary">添加</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:crontab_del
                :disabled="!selectedData || selectedData.length == 0"
                :icon="Delete"
                type="danger"
                @click="delBySeletedIds(sysApi.crontab.crontabRemove + '?id=')"
              >
                批量删除
              </el-button>
            </el-space>
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
            :url="sysApi.crontab.crontabList"
          >
            <ab-column label="任务标识" min-width="160" prop="jobKey" />
            <ab-column label="任务描述" min-width="120" prop="description" />
            <ab-column
              ab-text-formatter="annotation-注解|groovyScript-脚本|bean-Bean"
              label="执行器类型"
              prop="executorType"
              width="100"
            />
            <ab-column label="执行器" min-width="120" prop="executor" />
            <ab-column label="Cron表达式" min-width="100" prop="cron" />
            <ab-column
              ab-text-formatter="0-否-info-dark|1-是-success-dark"
              label="启用"
              prop="enable"
              width="70"
            />
            <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="更新时间" min-width="160" prop="updateTime" />
            <ab-column label="更新人" min-width="160" prop="updater" />
            <ab-column
              ab-template="edit"
              fixed="right"
              label="操作"
              width="260"
            />
            <template #edit="{ scope }">
              <router-link
                v-ab-btn-rights:crontab_edit
                :to="{ name: 'crontabEdit', query: { id: scope.row.id } }"
              >
                <el-button text type="primary">编辑</el-button>
              </router-link>
              <el-button
                v-ab-btn-rights:crontab_del
                text
                type="primary"
                @click="
                  sendAction(
                    `${sysApi.crontab.crontabRemove}?id=${scope.row.id}`,
                    `确定删除 ${scope.row.jobKey} 吗?`
                  )
                "
              >
                删除
              </el-button>
              <el-button
                v-ab-btn-rights:crontab_atOnceTask
                text
                type="primary"
                @click="
                  sendAction(
                    sysApi.crontab.crontabAtOnce +
                      '?jobKey=' +
                      scope.row.jobKey,
                    `确定运行 ${scope.row.jobKey} 吗?`
                  )
                "
              >
                运行
              </el-button>
              <el-button
                v-ab-btn-rights:crontab_changeEnable
                text
                type="primary"
                @click="
                  sendAction(
                    `${sysApi.crontab.crontabChangeEnable}?jobKeys=${
                      scope.row.jobKey
                    }&enable=${scope.row.enable === 1 ? 0 : 1}`,
                    `确定${scope.row.enable === 1 ? '禁用' : '启用'} ${
                      scope.row.jobKey
                    } 吗?`
                  )
                "
              >
                {{ scope.row.enable ? '禁用' : '启用' }}
              </el-button>
            </template>
          </ab-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
  import { abTableMix, abDictTree } from '~/agilebpm'
  export default { mixins: [abTableMix] }
</script>

<script lang="ts" setup>
  // eslint-disable-next-line no-unused-vars
  import { ref, reactive, defineComponent } from 'vue'

  import { sysApi } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
    Check,
  } from '@element-plus/icons-vue'

  const query = reactive({
    typeCode$VIN: '',
    jobKey$VLK: '',
    executorType$VEQ: '',
    description$VLK: '',
  })
</script>
