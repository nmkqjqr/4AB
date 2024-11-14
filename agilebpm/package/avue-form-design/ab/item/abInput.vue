<template>
  <div :style="{ height: '100%' }" v-if="item.type == 'multitext'">
    <el-input
      :disabled="item.readOnly"
      v-model="item.defaultValue"
      type="textarea"
      :rows="item.rows"
      class="ab-input"
      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
    />
  </div>
  <el-input
    :disabled="item.readOnly"
    v-model="item.defaultValue"
    :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
    v-else
  />
</template>

<script>
  export default {
    name: 'abInput',
    props: ['item'],
  }
</script>
