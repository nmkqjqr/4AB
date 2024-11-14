<template>
  <el-form-item label="开启文本">
    <el-input v-model="data.activeText" placeholder="非必选,默认不显示" />
  </el-form-item>
  <el-form-item label="关闭文本">
    <el-input v-model="data.inactiveText" placeholder="非必选,默认不显示" />
  </el-form-item>
  <el-form-item label="开启值">
    <el-input
      v-model="data.activeValue"
      placeholder="默认为true"
      :type="data?.fieldType == 'number' ? 'number' : 'text'"
    />
  </el-form-item>
  <el-form-item label="关闭值">
    <el-input
      v-model="data.inactiveValue"
      placeholder="默认为false"
      :type="data?.fieldType == 'number' ? 'number' : 'text'"
    />
  </el-form-item>
  <el-form-item label="默认值">
    <el-switch
      v-model="data.defaultValue"
      :active-text="data.activeText"
      :inactive-text="data.inactiveText"
      :active-value="data.activeValue"
      :inactive-value="data.inactiveValue"
    />
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'ab-switch-config',
  }
</script>

<script lang="ts" setup>
  //继承的属性data
  const props = defineProps({ data: { type: Object, required: true } })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)
  console.log('propsprops', props)
  if (data.value.activeValue == null || data.value.activeValue == undefined) {
    data.value.activeValue = '1'
  }
  if (
    data.value.inactiveValue == null ||
    data.value.inactiveValue == undefined
  ) {
    data.value.inactiveValue = '0'
  }
</script>
