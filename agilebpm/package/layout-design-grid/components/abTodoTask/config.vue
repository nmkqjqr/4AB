<template>
  <el-divider content-position="center">流程待办配置</el-divider>
  <el-table
    id="my-element"
    :cell-style="cellStyle"
    class="fieldListTable"
    :data="config.control.param"
    :header-cell-style="{ height: '10px' }"
    :row-key="rowKeyFunc"
    :row-style="cellStyle"
    style="padding: 0; margin-bottom: 40px"
  >
    <el-table-column align="center" label="数据类型" width="80">
      <template #default="{ row }">
        {{ row.type }}
      </template>
    </el-table-column>

    <el-table-column align="center" label="默认展示" width="80">
      <template #default="{ row }">
        <el-radio-group v-model="row.default" :disabled="!row.enable">
          <el-radio :label="true" size="large" @change="radioClick(row)">
            <template #default>
              <span style="display: none"></span>
            </template>
          </el-radio>
        </el-radio-group>
      </template>
    </el-table-column>
    <el-table-column align="center" label="启用" width="65">
      <template #default="{ row }">
        <el-switch v-model="row.enable" @change="changeSwitch(row)" />
      </template>
    </el-table-column>
    <el-table-column align="center" fixed="right" label="操作" width="90">
      <template #default="{ row, $index }">
        <el-button
          circle
          class="move-btn"
          :icon="Sort"
          size="small"
          type="primary"
        />
        <el-button
          circle
          :disabled="!row.enable"
          :icon="Edit"
          size="small"
          type="primary"
          @click="clickEdit($index)"
        />
      </template>
    </el-table-column>
  </el-table>
  <el-form-item label="分类过滤">
    <tree-select
      v-model="config.control.condition"
      clearable
      collapse-tags
      dic-code="flowType"
      multiple
    />
  </el-form-item>
  <el-form-item label="页签风格">
    <el-select v-model="config.control.type">
      <el-option label="default" value="" />
      <el-option label="border-card" value="border-card" />
      <el-option label="card" value="card" />
    </el-select>
  </el-form-item>
  <el-form-item label="页头自适应">
    <el-switch v-model="config.control.stretch" />
  </el-form-item>
  <el-form-item label="定时刷新">
    <el-switch v-model="config.control.timedRefresh" />
  </el-form-item>
  <el-form-item
    v-if="config.control.timedRefresh"
    prop="control.refreshCycle"
    :rules="[
      {
        pattern: /^[1-9]\d*$/,
        message: '请输入1以上的正整数（单位/秒）',
        trigger: 'change',
      },
    ]"
  >
    <template #label>
      <div>
        <el-tooltip
          class="box-item"
          content="刷新周期为1以上的正整数（单位/秒）"
          effect="dark"
          placement="top-start"
        >
          <el-icon style="width: 100%; font-style: normal">
            <QuestionFilled />
            刷新周期：
          </el-icon>
        </el-tooltip>
      </div>
    </template>

    <el-input
      v-model="config.control.refreshCycle"
      type="number"
      @change="
        () => {
          if (config.control.refreshCycle < 1) {
            config.control.refreshCycle = 1
          } else {
            if (!Number.isInteger(config.control.refreshCycle))
              // 如果输入值有小数部分，则省略小数部分
              config.control.refreshCycle = Math.floor(
                config.control.refreshCycle
              )
          }
        }
      "
    />
  </el-form-item>
  <el-dialog
    v-model="info.showDialog"
    :title="config.control.param[info.currentIndex].type + '配置'"
    width="500px"
  >
    <el-form
      label-position="left"
      label-width="120px"
      :model="config.control.param[0]"
    >
      <el-form-item label="数据类型" prop="type">
        <el-tag>{{ config.control.param[info.currentIndex].type }}</el-tag>
      </el-form-item>
      <el-form-item label="页签名称" prop="title">
        <el-input v-model="config.control.param[info.currentIndex].title" />
      </el-form-item>
      <el-form-item label="显示条数" prop="count">
        <el-input
          v-model="config.control.param[info.currentIndex].count"
          type="number"
          @change="changeCount"
        />
      </el-form-item>
      <el-form-item label="展示数据时间" prop="showTime">
        <el-switch v-model="config.control.param[info.currentIndex].showTime" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogOk">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import { Plus, Sort, Delete, Edit } from '@element-plus/icons-vue'
  import { cmsApi, sysApi, abUtil } from '~/agilebpm'
  import Sortable from 'sortablejs'
  import treeSelect from '../abBpmIndicatorCard/treeSelect.vue'
  const props = defineProps({
    config: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
    formCombination: {
      required: true,
      type: Object as PropType<FormCombination>,
    },
  })
  const { config, formCombination } = toRefs(props)

  const info = reactive({
    showDialog: false,
    currentIndex: 0,
  })

  const cellStyle = () => {
    return {
      height: '40px',
      padding: '0',
    }
  }

  //兼容老数据，对于之前没有过定时时间的都默认10
  if (!config.value.control.refreshCycle) {
    config.value.control.refreshCycle = 10
  }
  const rowKeyFunc = (row: any) => row.code

  const clickEdit = (index: number) => {
    info.currentIndex = index
    info.showDialog = true
  }

  const dialogOk = (row: any) => {
    info.showDialog = false
  }

  const changeSwitch = (row: any) => {
    if (row.default) {
      if (!config.value.control.param.find((s) => s?.enable)) {
        const obj = config.value.control.param.find((s) => s?.default)
        if (obj) {
          obj.default = false
        }
      }

      for (let index = 0; index < config.value.control.param.length; index++) {
        const element = config.value.control.param[index]
        if (element.default == false && element.enable) {
          element.default = true
          row.default = false
          return
        }
      }
    }
    if (!config.value.control.param.find((s) => s?.default)) {
      const obj = config.value.control.param.find((s) => s?.enable)
      if (obj) {
        obj.default = true
      }
    }
  }

  const changeCount = (row: any) => {
    props.config.relaod()
  }

  const radioClick = (row: any) => {
    config.value.control.param.forEach((element: any) => {
      if (element.code != row.code) {
        element.default = false
      }
    })
  }

  // 行拖拽
  const rowDrop = () => {
    nextTick(() => {
      const table = document.querySelector(
        '.fieldListTable .el-table__body-wrapper tbody'
      )
      Sortable.create(table, {
        animation: 300,
        handle: '.move-btn',
        onEnd: (evt: any) => {
          const arr = JSON.parse(JSON.stringify(config.value.control.param))
          let t
          if (
            evt.oldIndex > evt.newIndex &&
            table.children.length > arr.length
          ) {
            t = arr.splice(evt.oldIndex - 1, 1)[0]
          } else {
            t = arr.splice(evt.oldIndex, 1)[0]
          }
          arr.splice(evt.newIndex, 0, t)

          config.value.control.param = arr
        },
      })
    })
  }

  rowDrop()

  watch(
    () => props.config.key,
    () => props.config.initFunction()
  )
</script>

<style scoped lang="scss">
  .move-btn {
    cursor: move;
  }
</style>
