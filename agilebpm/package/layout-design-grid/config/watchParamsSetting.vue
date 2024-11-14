<template>
  <div>
    <el-form-item :label="props.label">
      <el-select
        v-model="config.watchParam"
        clearable
        placeholder="请选择联动参数"
        style="width: 240px"
      >
        <el-option
          v-for="item in formCombination.designJson.params"
          :key="item.name"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </el-form-item>
  </div>
</template>
<script lang="ts" setup>
  import { PropType } from 'vue'

  const props = defineProps({
    config: {
      required: true,
      type: Object as any,
    },
    label: {
      type: String,
      default: '联动参数',
    },
    formCombination: {
      required: true,
      type: Object as PropType<FormCombination>,
    },
  })

  const { config, formCombination } = toRefs(props)
</script>

<style lang="scss" scoped></style>
