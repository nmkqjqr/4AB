<template>
  <el-form-item label="字典分类" style="margin-top: 10px" class="is-required">
    <el-tag key="item" v-if="data.dicCodeName && data.dicCodeName.length > 0">
      {{ data.dicCodeName }}
    </el-tag>
    <ab-cust-dialog
      dialog-key="sjzdsjq"
      :icon="Search"
      round
      size="small"
      :style="data.dicCodeName ? { 'margin-left': '8px' } : ''"
      type="primary"
      @ok="getDicCode"
    >
      选择
    </ab-cust-dialog>
  </el-form-item>
  <el-form-item label="是否多选">
    <el-switch v-model="data.multiple" />
  </el-form-item>
  <el-form-item label="默认值">
    <tree-select
      clearable
      v-if="data.multiple"
      v-model="data.defaultValue"
      :multiple="true"
      :dic-code="data.dicCode"
    />
    <tree-select
      v-else
      clearable
      v-model="data.defaultValue"
      :multiple="false"
      :dic-code="data.dicCode"
    />
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'ab-tree-select-config',
  }
</script>

<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  import { sysApi } from '@agilebpm/api'
  import treeSelect from './component/treeSelect.vue'

  const treeRef = ref()
  //继承的属性data
  const props = defineProps({ data: { type: Object, required: true } })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)
  if (data.value.multiple == null || data.value.multiple == undefined) {
    data.value.multiple = false
  }

  //选择字典后的操作
  const getDicCode = (rel: any) => {
    data.value.dicCode = rel[0].code
    data.value.dicCodeName = rel[0].name
    data.value.defaultValue = ''
    sysApi.dict.getDictListByCode(data.value.dicCode).then((result: any) => {
      data.value.dicNodeSelect = result
    })
  }
  // const getDefaultValueName = (name: string) => {
  //   data.value.defaultValueName = name
  // }

  //当默认值静态数据变化时, 赋值默认值和名称
  watch(
    () => data.value.defaultValue,
    () => {
      if (data.value.defaultValue) {
        data.value.defaultValueName = data.value.defaultValue
          .split(',')
          .map((s: any) => {
            if (data.value.dicType == 'statusData') {
              data.value.dicData.find((item: { value: any }) => s == item.value)
                .label
            } else {
              let obj = data.value.dicNodeSelect.find(
                (item: { code: any }) => s == item.code
              )
              return obj.name
            }
          })
          .join(',')
      } else data.value.defaultValueName = ''
    }
  )
</script>
