<template>
  <el-button closable type="default" @click="open">配置脚本</el-button>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :before-close="handleClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    draggable
    :title="`脚本配置`"
    :top="props.top"
    :width="props.width"
  >
    <div :style="{ height: info.height }">
      <scriptVariableSelect v-model="info.data.script" />
      脚本描述：
      <el-input
        v-model="info.data.desc"
        placeholder="请输入更便于别人理解的脚本的描述（为空时取脚本内容）"
      />
      <el-divider />
      <codemirror
        v-model="info.data.script"
        :autofocus="true"
        :extensions="info.extensions"
        :indent-with-tab="true"
        placeholder="请输入groovy代码（类java语言）"
        :style="{
          height: `90%`,
          border: `1px solid #e4e7ed`,
          width: `100%`,
        }"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="info.dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { Close, Plus, Delete } from '@element-plus/icons-vue'
  import { Codemirror } from 'vue-codemirror'
  import { javascript } from '@codemirror/lang-javascript'
  import scriptVariableSelect from './scriptVariableSelect.vue'

  const props = defineProps({
    modelValue: {
      required: true,
      type: Object,
      default: () => {
        return {}
      },
    },
    top: { required: false, type: String, default: '5vh' },
    width: { required: false, type: String, default: '75%' },
  })

  const emit = defineEmits(['update:modelValue'])

  const info: any = reactive({
    data: {
      script: '',
      desc: '',
    },
    dialogVisible: false,
    height: '60vh',
    extensions: [javascript()],
    scriptVariables: [],
  })

  const open = () => {
    info.dialogVisible = true
    info.data = abUtil.clone(props.modelValue)
  }

  const formRef = ref<FormInstance>()
  const ok = () => {
    if (!info.data.desc) {
      ElMessage({
        showClose: true,
        message: '请输入脚本描述',
        type: 'warning',
      })
      return
    }
    info.dialogVisible = false
    emit('update:modelValue', info.data)
  }
</script>
