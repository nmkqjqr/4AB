<template>
  <el-form-item
    label="行数"
    prop="rows"
    :rules="[
      {
        pattern: '^([1-9]|[1-9]\\d|100)$',
        message: '行数范围最小为1，最大为100',
      },
    ]"
  >
    <el-input v-model="data.rows" placeholder="请输入多行文本的行数" />
  </el-form-item>
  <el-form-item label="默认值">
    <el-input
      type="textarea"
      :rows="data.rows"
      v-model="data.defaultValue"
      :placeholder="defaultValuePlaceholder"
    />
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'ab-multitext-config',
  }
</script>

<script lang="ts" setup>
  //继承的属性data
  const props = defineProps({ data: { type: Object, required: true } })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)
  let abColumn:any = null
  if(window.ab_bo){
    abColumn = window.ab_bo.getCol(props.data.tableCode,props.data.code)
  }

  const defaultValuePlaceholder = computed(() => {
    if (abColumn && abColumn.defaultValue) {
      return '业务实体默认值：' + abColumn.defaultValue
    }
    return '请输入默认值'
  })
</script>
