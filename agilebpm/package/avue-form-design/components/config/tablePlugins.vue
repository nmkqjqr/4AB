<template>
  <div>
    <br />
    <el-divider content-position="left">表单插件</el-divider>
    <el-dropdown @command="pluginAdd">
      <el-button type="primary" style="margin-bottom: 12px">
        添加表单插件
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="Plus" command="tableCal">
            函数计算
          </el-dropdown-item>
          <el-dropdown-item :icon="Search" command="custSearch">
            联动查询
          </el-dropdown-item>
          <el-dropdown-item :icon="Operation" command="dynPerm">
            动态权限
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-table :data="option.tablePlugins">
      <el-table-column prop="name" label="插件名" />
      <el-table-column prop="desc" label="备注" />
      <el-table-column prop="name" label="操作" width="93">
        <template #default="{ row, column, $index }">
          <el-button link type="primary">
            <el-icon :size="22" @click="editPlugin(row, $index)">
              <Edit />
            </el-icon>
          </el-button>
          <el-button link type="danger">
            <el-icon :size="22" @click="option.tablePlugins.splice($index, 1)">
              <Delete />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <tableCalPlugin
      @dialogOk="okEvent"
      :tableName="tableName"
      v-model="pageData.showPlugin.tableCal"
      :plugin="pageData.currentPlugin"
    ></tableCalPlugin>
    <dyn-perm
      v-if="pageData.showPlugin.dynPerm"
      @dialogOk="okEvent"
      :tableName="tableName"
      v-model="pageData.showPlugin.dynPerm"
      :plugin="pageData.currentPlugin"
      :form="form"
    ></dyn-perm>
    <custSearchPlugin
      v-if="pageData.showPlugin.custSearch"
      @dialogOk="okEvent"
      :tableName="tableName"
      v-model="pageData.showPlugin.custSearch"
      :plugin="pageData.currentPlugin"
    ></custSearchPlugin>
  </div>
</template>
<script setup>
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import {
    ArrowDown,
    Operation,
    Search,
    Plus,
    Delete,
    Edit,
  } from '@element-plus/icons-vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  import tableCalPlugin from './plugins/tableCalPlugin.vue'
  import custSearchPlugin from './plugins/custSearchPlugin.vue'
  import dynPerm from './plugins/dynPerm.vue'

  const props = defineProps({
    option: {
      type: Object,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
  })

  const { option } = toRefs(props)
  const isBo = abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo'
  let tableName = option.value.subTable ? option.value.code : ''
  if (!isBo && tableName) {
    const designCode = props.form.code || window.DESIGN_CODE
    tableName = `${designCode}_${tableName}${window.BIZ_TABLE_SUFFIX}`
  }

  const pageData = reactive({
    currentPlugin: {},
    currentIndex: 0,
    showPlugin: {},
  })

  const editPlugin = (plugin, index) => {
    pageData.currentPlugin = abUtil.clone(plugin)
    pageData.currentIndex = index
    pageData.showPlugin[plugin.key] = true
  }

  const pluginDefaultJson = {
    tableCal: {
      key: 'tableCal',
      name: '函数计算',
      decimals: 2,
      easyScript: true,
    },
    custSearch: { key: 'custSearch', name: '联动查询' },
    dynPerm: { key: 'dynPerm', name: '动态权限', list: [] },
  }

  const pluginAdd = (commond) => {
    pageData.currentPlugin = abUtil.clone(pluginDefaultJson[commond])
    pageData.showPlugin[pageData.currentPlugin.key] = true
    pageData.currentIndex = -1
  }

  const okEvent = () => {
    pageData.showPlugin[pageData.currentPlugin.key] = false
    if (pageData.currentIndex == -1) {
      if (!option.value.tablePlugins) {
        option.value.tablePlugins = []
      }
      option.value.tablePlugins.push(pageData.currentPlugin)
    } else {
      option.value.tablePlugins[pageData.currentIndex] = pageData.currentPlugin
    }
  }
</script>
<style lang="scss" scoped>
  .afd-config-form {
    padding: 10px 0 0 0;
  }
</style>
