<template>
  <div>
    <br />
    <el-divider content-position="center">组件展示条件配置</el-divider>
    <el-input
      v-model="config.showCondition"
      :indent-with-tab="true"
      placeholder="条件表达式"
      type="textarea"
    >
      >
    </el-input>
    <el-select
      placeholder="条件参数选择"
      style="width: 100%; margin-top: 12px; margin-bottom: 10px"
    >
      <el-option
        v-for="item in formCombination.designJson.params"
        :key="item.name"
        :label="item.name"
        :value="item.name"
        @click="
          config.showCondition =
            (config.showCondition || '') + 'globalParams.' + item.name
        "
      />
    </el-select>
    <el-alert
      :closable="false"
      title="if 形式，不满足条件时不会渲染,您可以使用全局参数决策"
      type="info"
    />
  </div>
</template>
<script lang="ts" setup>
  import { PropType } from 'vue'

  const props = defineProps({
    config: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
    formCombination: {
      required: true,
      type: Object as PropType<FormCombination>,
    },
  })

  const { config, formCombination } = toRefs(props)
</script>

<style lang="scss" scoped></style>
