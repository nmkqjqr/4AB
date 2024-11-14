<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="104px"
            :model="query"
            @submit.prevent
          >
            <el-form-item label="流水号名称" prop="name$VLK">
              <el-input
                v-model="query.name$VLK"
                placeholder="请输入流水号名称"
              />
            </el-form-item>
            <el-form-item label="流水号别名" prop="code$VLK">
              <el-input
                v-model="query.code$VLK"
                placeholder="请输入流水号别名"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                查询
              </el-button>
              <el-button :icon="RefreshRight" @click="reset()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="left-panel">
          <router-link v-ab-btn-rights:serialNo_add to="/sys/serial/serialEdit">
            <el-button :icon="Plus" type="primary">添加</el-button>
          </router-link>
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
      :url="sysApi.serialNo.BpmSerialNoListUrl"
    >
      <ab-column label="流水号名称" min-width="120" prop="name" />
      <ab-column label="流水号别名" min-width="120" prop="code" />
      <ab-column label="流水号规则" min-width="120" prop="rule" />
      <ab-column
        ab-template="reviveRule"
        label="重编规则"
        min-width="120"
        prop="reviveRule"
      />
      <template #reviveRule="{ scope }">
        {{ getRule(scope.row.reviveRule) }}
      </template>
      <ab-column label="流水号长度" min-width="120" prop="noLength" />
      <ab-column ab-date-formatter="yyyy-MM-dd HH:mm" label="更新时间" min-width="160" prop="updateTime" />
      <ab-column label="更新人" min-width="160" prop="updater" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="220" />
      <template #edit="{ scope }">
        <router-link  v-ab-btn-rights:serialNo_edit :to="{ name: 'SerialEdit', query: { id: scope.row.id } }">
          <el-button text type="primary">编辑</el-button>
        </router-link>
        <el-button   v-ab-btn-rights:serialNo_preview  text type="primary" @click="handlewatch(scope.row)">
          预览
        </el-button>
        <el-button
          v-ab-btn-rights:serialNo_del
          text
          type="primary"
          @click="
            sendAction(
              sysApi.serialNo.removeserialNo + scope.row.id,
              `确定删除(${scope.row.name})吗?`
            )
          "
        >
          删除
        </el-button>
      </template>
    </ab-table>
    <Preview ref="previewRef" />
  </div>
</template>

<script lang="ts">
  import { ref, reactive, defineComponent } from 'vue'
  import { abTableMix, sysApi } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  import Preview from './components/preview.vue'
  export default defineComponent({
    name: 'SerialList',
    components: {
      Preview,
    },
    mixins: [abTableMix],
    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        name$VLK: '',
        code$VLK: '',
      })
      const previewRef = ref()
      const handlewatch = (row: any) => {
        previewRef.value.loadingopenFn(row)
        previewRef.value.loadingcloseFn()
      }
      return {
        previewRef,
        query,
        sysApi,
        handlewatch,
        Delete,
        Edit,
        Search,
        Plus,
        RefreshRight,
        getRule,
      }
    },
  })

  const getRule = (reviveRule: any) => {
    if (!reviveRule) {
      return '自增'
    }
    return ['increment', ''].includes(reviveRule) ? '自增' : reviveRule
  }
</script>
