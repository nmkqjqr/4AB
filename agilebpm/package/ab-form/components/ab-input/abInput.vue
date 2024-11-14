<template>
  <!-- 把校验相关的 都挪到组件中处理 -->
  <ab-input-wrap
    ref="inputWrap"
    :column-code="props.columnCode"
    :desc="props.desc"
    :disabled="props.disabled"
    :model-value="modelValue"
    :permission="props.permission"
    :read-show-text="props.readShowText"
    :rules="props.rules"
    :table-code="props.tableCode"
  >
    <!--如果只读 且展示纯文本，则在这里展示 -->
    <template #readonlyShowText>
      <span style="white-space: pre-line">{{ modelValue }}</span>
    </template>
    <!--默认input 展示模式，disable 为只读模式， -->
    <template #default="{ disabled, doValidate }">
      <el-input
        v-model="value"
        class="ab-input"
        :disabled="disabled"
        @blur="doValidate()"
        :rows="rows"
        :type="type"
      />
    </template>
  </ab-input-wrap>
</template>

<script lang="ts" setup>
  import { RuleItem } from 'async-validator'
  import { PropType } from 'vue'
  import abInputWrap from '../form-base/ab-input-wrap.vue'
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: '',
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    //操作权限
    permission: {
      type: String,
      default: 'w',
    },
    rules: {
      type: Object as PropType<Array<RuleItem> | RuleItem>,
      default: [] as Array<RuleItem>,
    },
    // 描述字段，用于校验提示拼接所在的字段名字
    desc: {
      type: String,
      required: true,
    },
    rows: {
      type: String,
      default: '2',
    },

    type: {
      type: String,
      default: 'text',
    },

    /**
     * 字段编码
     */
    columnCode: {
      type: String,
      default: '',
    },
    /**
     * 业务表编码
     */
    tableCode: {
      type: String,
      default: '',
    },
    readShowText: {
      type: Boolean,
      default: null,
    },
  })
  //双向绑定
  const emit = defineEmits(['update:modelValue', 'input'])
  const value = useVModel(props, 'modelValue', emit)
</script>
