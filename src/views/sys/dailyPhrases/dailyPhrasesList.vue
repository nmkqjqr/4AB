<template>
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
              :label="$abT('page.common.dailyPhrases', '常用语')"
              prop="locution$VLK"
            >
              <el-input v-model="query.locution$VLK" placeholder=" " />
            </el-form-item>
            <el-form-item
              :label="$abT('page.common.status', '状态')"
              prop="enable$NEQ"
            >
              <el-select v-model="query.enable$NEQ" clearable :placeholder="$abT('page.common.all','全部')">
                <el-option
                  :label="$abT('page.common.enable', '启用')"
                  value="1"
                />
                <el-option
                  :label="$abT('page.common.disable', '禁用')"
                  value="0"
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
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="left-panel">
          <el-space wrap>
            <router-link
              v-ab-btn-rights:sysDailyPhrases_add
              :to="{
                name: 'DailyPhrasesEdit',
                query: { type: '1' },
              }"
            >
              <el-button :icon="Plus" type="primary">
                {{ $abT('page.common.add', '添加') }}
              </el-button>
            </router-link>
            <el-button
              v-ab-btn-rights:sysDailyPhrases_del
              :disabled="!selectedData || selectedData.length == 0"
              :icon="Delete"
              type="danger"
              @click="
                delBySeletedIds(sysApi.sysDailyPhrases.dailyPhrasesRemove)
              "
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
      :url="sysApi.sysDailyPhrases.dailyPhrasesListJson"
    >
      <ab-column
        :label="$abT('page.common.dailyPhrases', '常用语')"
        min-width="160"
        prop="locution"
      />
      <ab-column
        ab-template="changeEnable"
        :label="$abT('page.common.enable', '启用')"
        width="100"
      />
      <template #changeEnable="{ scope }">
        <el-switch
          v-model="scope.row.enable"
          :active-value="1"
          :inactive-value="0"
          inline-prompt
          @change="changeEnable(scope.row.id, scope.row.enable)"
        />
      </template>
      <ab-column
        :ab-text-formatter="
          '1-' +
          $abT('page.common.yes', '是') +
          '-default-light|0-' +
          $abT('page.common.no', '否') +
          '-success-light'
        "
        :label="$abT('page.common.builtin', '内置')"
        prop="isDefault"
        width="120"
      />
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        :label="$abT('page.common.createTime', '创建时间')"
        prop="createTime"
        width="200"
      />
      <ab-column
        :label="$abT('page.common.creator', '创建人')"
        prop="creator"
        width="160"
      />
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate', '操作')"
        width="210"
      />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:sysDailyPhrases_get
          :to="{
            name: 'DailyPhrasesEdit',
            query: { id: scope.row.id },
          }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.details', '详情') }}
          </el-button>
        </router-link>
        <router-link
          v-ab-btn-rights:sysDailyPhrases_edit
          :to="{
            name: 'DailyPhrasesEdit',
            query: { id: scope.row.id, type: '1' },
          }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.edit', '编辑') }}
          </el-button>
        </router-link>
        <el-button
          v-if="scope.row.isDefault === 0"
          v-ab-btn-rights:sysDailyPhrases_del
          text
          type="primary"
          @click="
            sendAction(
              sysApi.sysDailyPhrases.dailyPhrasesRemove + scope.row.id,
              $abT('page.common.delMsg', '确定删除 {a} 吗？', {
                a: scope.row.locution,
              })
            )
          "
        >
          {{ $abT('page.common.del', '删除') }}
        </el-button>
      </template>
    </ab-table>
  </div>
</template>

<script lang="ts">
  import { ElMessage } from 'element-plus'
  import { defineComponent, reactive } from 'vue'
  import { abTableMix, postData, sysApi } from '~/agilebpm'
  import { abT } from '~/src/i18n'

  import {
    Delete,
    Edit,
    Plus,
    RefreshLeft,
    RefreshRight,
    Search,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'DailyPhrasesList',
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        locution$VLK: '',
        enable$NEQ: '',
      })
      const loading = ref(false)

      const changeEnable = (id: string, enable: number) => {
        if (id)
          postData(sysApi.sysDailyPhrases.dailyPhrasesUpdateEnable, {
            id: id,
            enable: enable,
          })
            .then(() => {
              ElMessage.success(abT('page.common.operateSuccess', '操作成功'))
              loading.value = true
            })
            .catch(() => (loading.value = true))
      }
      return {
        changeEnable,
        query,
        sysApi,
        Plus,
        Edit,
        Delete,
        Search,
        RefreshRight,
        RefreshLeft,
      }
    },
  })
</script>
