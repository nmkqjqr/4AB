<template>
  <el-checkbox-group
    :disabled="item.readOnly"
    :model-value="item.defaultValue ? item.defaultValue.split(',') : []"
  >
    <span v-if="item.dicType == 'dicData'">
      <span v-if="item.buttonStyle == 'button'">
        <el-checkbox-button
          v-for="i in item.dicNodeSelect"
          :key="i.code"
          :label="i.code"
        >
          {{ i.name }}
        </el-checkbox-button>
      </span>
      <span v-else>
        <el-checkbox
          v-for="i in item.dicNodeSelect"
          :key="i.code"
          :label="i.code"
        >
          {{ i.name }}
        </el-checkbox>
      </span>
    </span>
    <span v-else>
      <span v-if="item.buttonStyle == 'button'">
        <el-checkbox-button
          v-for="i in item.dicData"
          :key="i.value"
          :label="i.value"
        >
          {{ i.label }}
        </el-checkbox-button>
      </span>
      <span v-else>
        <el-checkbox v-for="i in item.dicData" :key="i.value" :label="i.value">
          {{ i.label }}
        </el-checkbox>
      </span>
    </span>
  </el-checkbox-group>
</template>

<script>
  export default {
    name: 'abCheckbox',
    props: ['item'],
  }
</script>
<style lang="scss" scoped>
  ::v-deep
    .el-checkbox-button.is-disabled.is-checked
    .el-checkbox-button__inner {
    background-color: #f2f6fc;
  }
</style>
