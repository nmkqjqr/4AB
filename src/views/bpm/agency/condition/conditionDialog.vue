<template>
  <el-button :icon="Edit" text type="primary" @click="open">
    {{ $abT('bpm.office.configurationScript', '配置脚本') }}
  </el-button>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :destroy-on-close="true"
    draggable
    style="max-width: 1100px"
    :title="$abT('bpm.office.conditionConfig', '条件配置')"
    :top="props.top"
    :width="props.width"
  >
    <condition-script
      ref="script"
      v-model="info.data"
      :flow-setting="props.flowSetting"
      :default-config="defaultConfig"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="info.dialogVisible = false">
          {{ $abT('page.common.cancel', '取消') }}
        </el-button>
        <el-button type="primary" @click="dialogOk">
          {{ $abT('page.common.ok', '确定') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { reactive } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  import { Edit } from '@element-plus/icons-vue'
  import type { FormInstance } from 'element-plus'
  import conditionScript from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/conditionScript.vue'
  import { defaultConditionScript, defaultConfig } from './config'

  const props = defineProps({
    modelValue: { required: true, type: Object },
    top: { required: false, type: String, default: '5vh' },
    width: { required: false, type: String, default: '75%' },
    flowSetting: { required: false, type: Object, default: () => {} },
  })

  const emit = defineEmits(['update:modelValue', 'dialogOk'])
  const info: any = reactive({
    dialogVisible: false,
    data: abUtil.clone(defaultConditionScript),
  })

  const open = () => {
    info.dialogVisible = true
    if (props.modelValue && props.modelValue.type) {
      info.data = abUtil.clone(props.modelValue)
    } else {
      info.data = abUtil.clone(defaultConditionScript)
    }
  }
  const dialogOk = () => {
    info.dialogVisible = false
    emit('update:modelValue', info.data)
    emit('dialogOk', info.data)
  }
</script>
