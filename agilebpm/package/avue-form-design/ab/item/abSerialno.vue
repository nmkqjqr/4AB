<template>
  <div v-if="item && item.serialnoConfig">
    <div v-if="item.serialnoConfig.showCode">
      <ab-qrcode
        :text="text"
        :showText="true"
        :code-config="codeOptions"
        v-if="item.serialnoConfig.codeType === 'qr'"
      />
      <ab-barcode
        :text="text"
        :showText="true"
        :code-config="codeOptions"
        v-else
      />
    </div>
    <el-input
      v-else
      v-model="item.serialnoConfig.serialName"
      :readonly="true"
      disabled
    >
      <template #prepend>流水号：</template>
    </el-input>
  </div>

  <div v-else-if="item">
    <el-input v-model="item.serialName" :readonly="true" disabled>
      <template #prepend>流水号：</template>
    </el-input>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'abSerialno',
  }
</script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { abQrcode, abBarcode } from '@ab-core'

  const props = defineProps({ item: { type: Object, required: true } })
  const { item } = toRefs(props)
  const text = computed(() => {
    return `test${Math.random()}`
  })

  const codeOptions = computed(() => {
    if (item.value.serialnoConfig.codeConfig) {
      if (item.value.serialnoConfig.codeType === 'bar') {
        return {
          format: 'CODE128',
          displayValue: false,
          ...item.value.serialnoConfig.codeConfig,
        }
      } else {
        return {
          color: {
            dark: '#000',
            light: '#fff',
          },
          errorCorrectionLevel: 'M',
          type: 'canvas',
          background: 'white',
          ...item.value.serialnoConfig.codeConfig,
        }
      }
    }
    return {}
  })
</script>
