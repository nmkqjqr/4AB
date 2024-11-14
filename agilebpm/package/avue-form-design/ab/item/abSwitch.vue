<template>
  <el-switch
    v-model="item.defaultValue"
    :active-text="item.activeText"
    :inactive-text="item.inactiveText"
    :active-value="item.activeValue"
    :inactive-value="item.inactiveValue"
    :disabled="item.readOnly"
  />
</template>

<script>
  export default {
    name: 'abSwitch',
    props: ['item'],
  }
</script>
