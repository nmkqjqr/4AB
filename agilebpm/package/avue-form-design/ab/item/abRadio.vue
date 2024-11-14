<template>
  <el-radio-group
    v-if="item.buttonStyle == 'button'"
    v-model="item.defaultValue"
    :disabled="item.readOnly"
  >
    <el-radio-button
      class="radioBtn"
      v-for="i in item.dicType == 'dicData' ? item.dicNodeSelect : item.dicData"
      :key="item.dicType == 'dicData' ? i.code : i.value"
      :label="item.dicType == 'dicData' ? i.code : i.value"
    >
      {{ item.dicType == 'dicData' ? i.name : i.label }}
    </el-radio-button>
  </el-radio-group>
  <el-radio-group v-else v-model="item.defaultValue" :disabled="item.readOnly">
    <el-radio
      v-for="i in item.dicType == 'dicData' ? item.dicNodeSelect : item.dicData"
      :key="item.dicType == 'dicData' ? i.code : i.value"
      :label="item.dicType == 'dicData' ? i.code : i.value"
    >
      {{ item.dicType == 'dicData' ? i.name : i.label }}
    </el-radio>
  </el-radio-group>
</template>

<script>
  export default {
    name: 'abRadio',
    props: ['item'],
  }
</script>
<style lang="scss" scoped>
  :deep(.radioBtn) {
    height: 32px;
  }
</style>
