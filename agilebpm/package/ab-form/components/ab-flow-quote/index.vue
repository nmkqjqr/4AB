<template>
  <div
    v-if="permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <el-tag
      v-for="(item, index) in info.flowList"
      :key="index"
      closable
      size="large"
      style="margin-right: 10px"
      @close="closeFlow(index)"
    >
      <instance-detail :instance-id="item.id" text>
        {{ item.title }}
      </instance-detail>
    </el-tag>

    <ab-cust-dialog
      v-if="permission !== 'r' && !props.disabled && !props.readonly"
      v-model="info.flowList"
      dialog-key="followerQuote"
      :value-mapping="{ title: 'title', id: 'id' }"
      width="80%"
      @ok="choceFlow"
    >
      <el-icon>
        <Search />
      </el-icon>
      {{ $abT('abform.followerQuote.followerQuote', '流程引用') }}
    </ab-cust-dialog>
  </div>
</template>

<script setup lang="ts">
  import { RuleItem } from 'async-validator'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { PropType } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import instanceDetail from '../../../ab-bpm/bpm-action-dialog/componets/instance-detail-dialog.vue'

  const props = defineProps({
    permission: {
      type: String,
      default: 'w',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      required: true,
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
    readonly: {
      type: Boolean,
      default: false,
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
  const info: any = reactive({
    bpmData: {},
    formData: {},
    instanceId: '',
    flowList: [] as any[],
    dialogVisable: false,
    showApproveHistory: false,
    showImageDialog: false,
  })
  const vueContext = getCurrentInstance()
  // emit 事件数据更新
  const emit = defineEmits(['update:modelValue'])

  // 是否只读展示纯文本
  const abFormMananger = inject('abForm') as AbFormProvide
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText

  /**
   * inputField相关的引用，用于表单abForm
   */
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: info.flowList,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })
  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
  })

  onMounted(() => {
    if (props.modelValue) {
      props.modelValue.split(',').forEach((item: any) => {
        info.flowList.push({
          title: item.split('/')[0],
          id: item.split('/')[1],
        })
      })
    }
    //加入表单校验
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
  })

  const choceFlow = (list: any) => {
    const result = [] as any[]
    list.forEach((item: any) => {
      result.push(`${item.title}/${item.id}`)
    })
    abInputField.modelValue = result.join(',')
    AbformValidate.blurValidate(abInputField)
    emit('update:modelValue', result.join(','))
  }

  const closeFlow = (index: number) => {
    info.flowList.splice(index, 1)
    const result = [] as any[]
    info.flowList.forEach((item: any) => {
      result.push(`${item.title}/${item.id}`)
    })
    abInputField.modelValue = result.join(',')
    emit('update:modelValue', result.join(','))
  }
  // 动态权限必填切换后，切换校验
  watch(
    () => props.permission,
    (newValue) => {
      // 如果校验 由非必填修改为了必填，此时修改校验功能
      if (newValue && newValue === 'b') {
        AbformValidate.changeRequired(abInputField, true)
      } else {
        AbformValidate.changeRequired(abInputField, false)
      }
    }
  )
</script>

<style></style>
