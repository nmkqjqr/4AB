<template>
  <el-form-item label="分类过滤">
    <tree-select
      v-model="config.control.condition"
      clearable
      collapse-tags
      dic-code="flowType"
      multiple
    />
  </el-form-item>
  <span>
    <el-form-item label="指标配置">
      <el-button
        :disabled="config.control.param && config.control.param.length > 7"
        :icon="Plus"
        round
        size="small"
        type="primary"
        @click="addParam"
      >
        添加
      </el-button>
    </el-form-item>

    <el-table
      v-if="config.control.param && config.control.param.length > 0"
      id="my-element"
      :cell-style="cellStyle"
      class="fieldListTable"
      :data="config.control.param"
      :header-cell-style="{ height: '10px' }"
      :row-key="rowKeyFunc"
      :row-style="cellStyle"
      style="padding: 0; margin-bottom: 40px"
    >
      <el-table-column align="center" label="数据卡">
        <template #default="{ row }">
          <el-select v-model="row.code" placeholder="选择数据卡">
            <el-option label="总待办量" value="todoTask" />
            <el-option label="总发起量" value="apply" />
            <el-option label="总驳回量" value="back" />
            <el-option label="总已办量" value="approve" />
            <el-option label="未读抄送" value="copyMeCount" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="颜色" width="60">
        <template #default="{ row }">
          <el-color-picker
            v-model="row.color"
            :predefine="predefineColors"
            show-alpha
          />
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="90">
        <template #default="{ $index }">
          <el-button
            circle
            class="move-btn"
            :icon="Sort"
            size="small"
            type="primary"
          />
          <el-button
            circle
            :icon="Delete"
            size="small"
            type="danger"
            @click.prevent="() => config.control.param.splice($index, 1)"
          />
        </template>
      </el-table-column>
    </el-table>

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
  </span>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import { Plus, Sort, Delete } from '@element-plus/icons-vue'
  import { cmsApi, sysApi, abUtil } from '~/agilebpm'
  import Sortable from 'sortablejs'
  import treeSelect from './treeSelect.vue'
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

  //兼容老数据，对于之前没有过定时时间的都默认10
  if (!config.value.control.refreshCycle) {
    config.value.control.refreshCycle = 10
  }

  //定义的配置对象泛型
  interface FlowCounts {
    todoTask: string // 总待办量
    apply: string // 总发起量
    back: string // 总驳回量
    approve: string // 总已办量
    copyMeCount: any //未审阅抄送数
    weather: any
  }

  const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#8fc99a',
    '#00ced1',
    '#4398f0',
    '#c71585',
    '#f4a074',
    '#8870b4',
    '#ffa0c0',
  ])

  const cellStyle = () => {
    return {
      height: '40px',
      padding: '0',
    }
  }
  const rowKeyFunc = (row: any) => row.sn

  const addParam = () => {
    if (!config.value.control.param || config.value.control.param.length == 0) {
      config.value.control.param = [
        {
          sn: 1,
          code: '',
          color: '#4398f0',
        },
      ]
      rowDrop()
    } else {
      config.value.control.param.push({
        sn: config.value.control.param.length + 1,
        code: '',
        color: '#4398f0',
      })
    }
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

  const init = () => {
    if (config.value?.control.param && config.value?.control.param.length > 0) {
      rowDrop()
    }
  }
  //执行初始化方法
  init()

  watch(
    () => props.config.key,
    () => init()
  )

  const updateData = () => {
    props.config.initFunction()
  }
</script>

<style scoped lang="scss">
  .move-btn {
    cursor: move;
  }
</style>
