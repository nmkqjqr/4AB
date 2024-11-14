<template>
  <div v-if="subTempData[props.tableRel + '_Dialog']">
    <el-dialog
      v-if="props.openType == 'dialog'"
      v-model="subTempData[props.tableRel + '_Dialog']"
      destroy-on-close
      draggable
      :title="props.title"
      :width="props.width"
    >
      <slot v-bind="subTempData"></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="cancel">
            {{ $abT('page.common.cancel', '取消') }}
          </el-button>
          <el-button
            type="primary"
            @click="subTempData[props.tableRel + '_okFn']"
          >
            {{ $abT('page.common.ok', '确定') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-drawer
      v-else
      v-model="subTempData[props.tableRel + '_Dialog']"
      :size="props.width"
    >
      <template #header>
        <h4>{{ props.title }}</h4>
      </template>
      <template #default>
        <slot v-bind="subTempData"></slot>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button text @click="cancel">
            {{ $abT('page.common.cancel', '取消') }}
          </el-button>
          <el-button
            type="primary"
            @click="subTempData[props.tableRel + '_okFn']"
          >
            {{ $abT('page.common.ok', '确定') }}
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
  import { PropType } from 'vue'

  const props = defineProps({
    subTempData: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: '详情信息',
    },
    // SchoolStudent_Student"
    tableRel: {
      type: String,
      required: true,
    },
    width: {
      type: [String, Number],
      default: '70%',
    },
    openType: {
      type: String,
      default: 'drawer',
    },
  })
  //双向绑定
  const { subTempData } = toRefs(props)
  const tableRel = props.tableRel.split('.')
  if (tableRel.length != 3) {
    console.error('子表信息有误，tableRel 必须为 业务对象.父表.子表三层形式')
  }
  const cancel = () => {
    nextTick(() => {
      subTempData.value[`${props.tableRel}_Dialog`] = false
    })
  }
</script>
