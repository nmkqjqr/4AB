<template>
  <span>
    <span v-if="config && config?.type">
      <ab-select
        v-if="config.type == 'select'"
        v-model="viewValue"
        :code="code"
        :dic-code="config.dicCode"
        :dic-type="config.dicType"
        :is-number="config.fieldType == 'number'"
        :options="config.dicData"
      />
      <ab-select
        v-else-if="config.type == 'multiSelect'"
        v-model="viewValue"
        :code="code"
        :dic-code="config.dicCode"
        :dic-type="config.dicType"
        multiple
        :options="config.dicData"
      />
      <ab-tree-select
        v-else-if="config.type == 'treeSelect'"
        v-model="viewValue"
        :code="code"
        :dic-code="config.dicCode"
        :multiple="config.multiple"
      />
      <ab-checkbox
        v-else-if="config.type == 'checkbox'"
        v-model="viewValue"
        :code="code"
        :dic-code="config.dicCode"
        :dic-type="config.dicType"
        :options="config.dicData"
      />
      <ab-radio
        v-else-if="config.type == 'radio'"
        v-model="viewValue"
        :code="code"
        :dic-code="config.dicCode"
        :dic-type="config.dicType"
        :options="config.dicData"
      />
      <ab-switch
        v-else-if="config.type == 'switch'"
        v-model="viewValue"
        :active-text="config.activeText"
        :active-value="config.activeValue"
        :code="code"
        :inactive-text="config.inactiveText"
        :inactive-value="config.inactiveValue"
        :is-number="config.fieldType == 'number'"
      />
      <ab-date
        v-else-if="config.type == 'date' || config.type == 'dateRange'"
        v-model="viewValue"
        :code="code"
        :format="config.dateFormat"
        :type="config.dateType"
      />
      <ab-multiple-date
        v-else-if="config.type == 'dateMulti'"
        v-model="viewValue"
        :code="code"
      />
      <ab-selector
        v-else-if="config.type == 'userSelect'"
        v-model="viewValue"
        :code="code"
        :dialog-key="config.dataSelectorConfig.dialogKey"
        :icon="config.dataSelectorConfig.icon"
        :label-field="config.dataSelectorConfig.labelField"
        :multiple="config.dataSelectorConfig.multiple"
        :param="config.dataSelectorConfig.param"
        select-type="user"
        :value-field="config.dataSelectorConfig.valueField"
      />
      <ab-selector
        v-else-if="config.type == 'roleSelect'"
        v-model="viewValue"
        :code="code"
        :dialog-key="config.dataSelectorConfig.dialogKey"
        :icon="config.dataSelectorConfig.icon"
        :label-field="config.dataSelectorConfig.labelField"
        :multiple="config.dataSelectorConfig.multiple"
        :param="config.dataSelectorConfig.param"
        select-type="role"
        :value-field="config.dataSelectorConfig.valueField"
      />
      <ab-selector
        v-else-if="config.type == 'orgSelect'"
        v-model="viewValue"
        :code="code"
        :dialog-key="config.dataSelectorConfig.dialogKey"
        :icon="config.dataSelectorConfig.icon"
        :label-field="config.dataSelectorConfig.labelField"
        :multiple="config.dataSelectorConfig.multiple"
        :param="config.dataSelectorConfig.param"
        select-type="org"
        :value-field="config.dataSelectorConfig.valueField"
      />
      <ab-selector
        v-else-if="config.type == 'postSelect'"
        v-model="viewValue"
        :code="code"
        :dialog-key="config.dataSelectorConfig.dialogKey"
        :icon="config.dataSelectorConfig.icon"
        :label-field="config.dataSelectorConfig.labelField"
        :multiple="config.dataSelectorConfig.multiple"
        :param="config.dataSelectorConfig.param"
        select-type="post"
        :value-field="config.dataSelectorConfig.valueField"
      />
      <ab-selector
        v-else-if="config.type == 'dataSelector'"
        v-model="viewValue"
        :code="code"
        :dialog-key="config.dataSelectorConfig.dialogKey"
        :icon="config.dataSelectorConfig.icon"
        :label-field="config.dataSelectorConfig.labelField"
        :multiple="config.dataSelectorConfig.multiple"
        :param="config.dataSelectorConfig.param"
        select-type="custom"
        :value-field="config.dataSelectorConfig.valueField"
      />
      <ab-dynamic-select
        v-else-if="config.type == 'dynamicSelect'"
        v-model="viewValue"
        :code="code"
        :dialog-key="config.dialogKey"
        :label-field="config.labelField"
        :value-field="config.valueField"
      />
      <ab-cascader
        v-else-if="config.type == 'region'"
        v-model="viewValue"
        :check-strictly="config.abCascaderConfig?.checkStrictly"
        :code="code"
        dialog-key="areaQuery"
        :label-field="config.labelField"
        :multiple="config.abCascaderConfig?.multiple"
        :value-field="config.valueField"
      />
      <ab-cascader
        v-else-if="config.type == 'cascadeSelect'"
        v-model="viewValue"
        :check-strictly="config.abCascaderConfig?.checkStrictly"
        :code="code"
        :dialog-key="config.dialogKey"
        :label-field="config.labelField"
        :multiple="config.abCascaderConfig?.multiple"
        :value-field="config.valueField"
      />
      <el-input v-else v-model="viewValue" placeholder="请输入固定值" />
      <!-- {{ config }} -->
    </span>
    <el-input v-else v-model="viewValue" placeholder="请输入固定值" />
  </span>
</template>

<script lang="ts">
  export default { name: 'AbWidely' }
</script>

<script lang="ts" setup>
  import abCascader from './component/cascader.vue'
  import abCheckbox from './component/checkbox.vue'
  import abDate from './component/date.vue'
  import abDynamicSelect from './component/dynamicSelect.vue'
  import abMultipleDate from './component/multipleDate.vue'
  import abRadio from './component/radio.vue'
  import abSelect from './component/select.vue'
  import abSelector from './component/selector.vue'
  import abSwitch from './component/switch.vue'
  import abTreeSelect from './component/treeSelect.vue'
  const props = defineProps({
    //选中项绑定值:
    modelValue: {
      type: Number,
      required: true,
    },

    //配置对象
    config: {
      type: Object as any,
      required: true,
    },

    //唯一编码,判断外部是否切换了组件,内部数据刷新的标识时机
    code: {
      type: String,
      required: true,
    },
  })

  console.log('consolconfige', props.config)
  const emit = defineEmits(['update:modelValue'])

  const viewValue: any = useVModel(props, 'modelValue', emit)
</script>
