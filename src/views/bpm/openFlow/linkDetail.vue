<template>
  <el-dialog
    :before-close="closeDialog"
    :destroy-on-close="true"
    :model-value="props.modelValue"
    :title="$abT('page.wfPublicShare.linkDetails','链接详情')"
  >
    <div style="text-align: center">
      <ab-qrcode :text="props.openFlowInfo.url" :showText = "false" :code-config="codeOptions" />
      <div style="margin-top: 10px" v-if="props.openFlowInfo && props.openFlowInfo.url">
        {{ $abT('page.wfPublicShare.linkAddress','链接地址') }}
        <el-tag class="mx-1" size="large" type="success">
          {{ props.openFlowInfo.url }}
        </el-tag>
      </div>
    </div>
    <template #footer>
      <el-button
        type="primary"
        @click="abUtil.handleClipboard(props.openFlowInfo.url)"
      >
        {{ $abT('page.wfPublicShare.copyLink','复制链接') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  // eslint-disable-next-line no-unused-vars
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abUtil, sysApi, bpmApi, request,abQrcode } from '~/agilebpm'
  import { ElMessage } from 'element-plus'

  const emit = defineEmits(['closeDialog'])

  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    openFlowInfo: { type: Object, required: true },
  })
  const codeOptions = {
    color: {
      dark: '#000',
      light: '#fff',
    },
    errorCorrectionLevel: 'M',
    type: 'canvas',
    background: 'white',
    width:200,
    height:200,
    margin:2
  }


  const closeDialog = () => {
    emit('closeDialog')
  }


</script>
