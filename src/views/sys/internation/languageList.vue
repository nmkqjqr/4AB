<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="62px"
            :model="query"
            @submit.prevent
          >
            <el-form-item
              :label="$abT('page.common.code', '编码')"
              prop="key$VLK"
            >
              <el-input v-model="query.key$VLK" placeholder=" " />
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
          <router-link
            v-ab-btn-rights:language_add
            to="/sys/internation/languageEdit"
          >
            <el-button :icon="Plus" type="primary">
              {{ $abT('page.common.add', '添加') }}
            </el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :checkable="false"
      :default-sort="{ order: 'desc', prop: 'createTime' }"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="sysApi.sysLanguage.languageList"
    >
      <ab-column
        :label="$abT('page.common.name', '名称')"
        min-width="120"
        prop="name"
      />
      <ab-column
        :label="$abT('page.common.code', '编码')"
        min-width="120"
        prop="key"
      />
      <ab-column
        :label="$abT('page.common.desc', '描述')"
        min-width="120"
        prop="remark"
      />
      <ab-column
        ab-template="enabled"
        :label="$abT('page.common.enable', '启用')"
        width="100"
      />
      <ab-column
        ab-date-formatter="yyyy-MM-dd HH:mm"
        :label="$abT('page.common.updateTime', '更新时间')"
        min-width="140"
        prop="updateTime"
      />
      <ab-column
        :label="$abT('page.common.updater', '更新人')"
        min-width="100"
        prop="updater"
      />
      <template #enabled="{ scope }">
        <el-switch
          v-model="scope.row.enabled"
          :active-value="1"
          :inactive-value="0"
          @change="(value) => changeEnable(scope.row.id, scope.row, value)"
        />
      </template>
      <ab-column
        ab-template="edit"
        fixed="right"
        :label="$abT('page.common.operate', '操作')"
        width="140"
      />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:language_edit
          :to="{ name: 'LanguageEdit', query: { id: scope.row.id } }"
        >
          <el-button text type="primary">
            {{ $abT('page.common.edit', '编辑') }}
          </el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:language_del
          text
          type="primary"
          @click="
            sendAction(
              sysApi.sysLanguage.removeLanguage + scope.row.id,
              $abT('page.common.delMsg', '确定删除 {a} 吗？', {
                a: scope.row.name,
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
  import { abT } from '@/i18n'
  // eslint-disable-next-line no-unused-vars
  import {
    Delete,
    Edit,
    Plus,
    RefreshRight,
    Search,
  } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { defineComponent, reactive } from 'vue'
  import { abTable, abTableMix, sysApi } from '~/agilebpm'
  export default defineComponent({
    name: 'LanguageList',
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        key$VLK: '',
      })

      const abTable = ref()

      const changeEnable = (id: string, row: any, enabled: any) => {
        if (!id) return
        abTable.value.loading = true
        sysApi.sysLanguage
          .changeEnable(id, enabled)
          .then(() => {
            ElMessage({
              message: abT('page.common.operateSuccess', '操作成功'),
              type: 'success',
            })
          })
          .catch(() => {
            if (enabled) row.enabled = 0
            else row.enabled = 1
          })
          .finally(() => (abTable.value.loading = false))
      }

      return {
        query,
        sysApi,
        changeEnable,
        abTable,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
      }
    },
  })
</script>
