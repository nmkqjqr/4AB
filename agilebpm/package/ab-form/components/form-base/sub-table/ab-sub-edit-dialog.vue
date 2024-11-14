<template>
  <div>
    <el-dialog
      v-if="openType == 'dialog'"
      v-model="subTempData[props.tablePath + '_Dialog']"
      destroy-on-close
      draggable
      :title="props.title"
      :width="props.width"
    >
      <slot v-bind="subTempData"></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="cancel">取消</el-button>
          <el-button
            type="primary"
            @click="subTempData[props.tablePath + '_okFn']"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-drawer
      v-else
      v-model="subTempData[props.tablePath + '_Dialog']"
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
          <el-button text @click="cancel">取消</el-button>
          <el-button
            type="primary"
            @click="subTempData[props.tablePath + '_okFn']"
          >
            确定
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
    tablePath: {
      type: String,
      required: true,
    },
    width: {
      type: [String, Number],
      default: '70%',
    },
    openType: {
      type: String,
      default: 'dialog',
    },
  })
  //双向绑定
  const { subTempData,openType } = toRefs(props)
  const editOk = () => {
      subTempData.value[`${props.tablePath}_Dialog`] = false
  }
  const cancel = () => {
    nextTick(() => {
      subTempData.value[`${props.tablePath}_Dialog`] = false
    })
  }
</script>
