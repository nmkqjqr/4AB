<template>
  <div
    v-if="props.permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <div v-if="props.permission === 'r' && readonlyShowText">
      <span v-if="!props.showCode">
        {{ modelValue }}
      </span>
      <div v-else>
        <ab-qrcode
          v-if="props.codeType === 'qr' && modelValue"
          :code-config="codeOptions"
          :show-text="true"
          :text="modelValue"
        />
        <ab-barcode
          v-if="props.codeType === 'bar' && modelValue"
          :code-config="codeOptions"
          :show-text="true"
          :text="modelValue"
        />
      </div>
    </div>

    <el-tooltip v-else v-bind="validateTips">
      <div>
        <el-space v-if="props.showCode">
          <ab-qrcode
            v-if="props.codeType === 'qr' && modelValue"
            :code-config="codeOptions"
            :show-text="true"
            :text="modelValue"
          />
          <ab-barcode
            v-if="props.codeType === 'bar' && modelValue"
            :code-config="codeOptions"
            :show-text="true"
            :text="modelValue"
          />
          <el-button
            v-if="paramList?.length > 0"
            :disabled="props.disabled"
            type="primary"
            @click="dialogVisable = true"
          >
            {{ $abT('abform.serialno.getSerialno', '获取流水号') }}
          </el-button>
        </el-space>

        <div v-else>
          <el-input
            v-model="modelValue"
            :disabled="props.permission === 'r' || props.disabled"
            :placeholder="props.placeholder"
            :readonly="true"
            @blur="inputBlur()"
          />
          <el-button
            v-if="paramList?.length > 0"
            :disabled="props.disabled"
            style="margin-left: 10px"
            type="primary"
            @click="dialogVisable = true"
          >
            {{ $abT('abform.serialno.getSerialno', '获取流水号') }}
          </el-button>
        </div>
      </div>
    </el-tooltip>
    <el-dialog
      v-model="dialogVisable"
      :before-close="() => (dialogVisable = false)"
      :title="$abT('abform.serialno.getSerialno', '获取流水号')"
      width="400px"
    >
      <el-form v-if="paramList?.length > 0" ref="formRef" :model="formData">
        <el-form-item
          v-for="(param, index) in paramList"
          :key="index"
          :label="param"
          label-width="120px"
        >
          <el-input v-model="formData.paramMap[param]" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisable = false">
            {{ $abT('page.common.cancel', '取消') }}
          </el-button>
          <el-button type="primary" @click="closeDialog">
            {{ $abT('page.common.ok', '确定') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { sysApi } from '@agilebpm/api'
  import { RuleItem } from 'async-validator'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { PropType } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { abQrcode, abBarcode } from '@ab-core'

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
    serialNoCode: {
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
    showCode: {
      type: Boolean,
      default: false,
    },
    codeType: {
      type: String,
      default: 'bar',
    },
    codeConfig: {
      type: Object,
      default: null,
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

  const codeOptions = computed(() => {
    if (props.codeConfig) {
      if (props.codeType === 'bar') {
        return {
          format: 'CODE128',
          displayValue: false,
          ...props.codeConfig,
        }
      } else {
        return {
          color: {
            dark: '#000',
            light: '#fff',
          },
          errorCorrectionLevel: 'M',
          type: 'canvas',
          background: 'white',
          ...props.codeConfig,
        }
      }
    }
    return {}
  })

  const formRef = ref<FormInstance>()
  const formData = reactive({
    code: props.serialNoCode,
    paramMap: {},
  })
  const dialogVisable = ref(false)

  // emit 事件数据更新
  const emit = defineEmits(['update:modelValue'])
  const modelValue = useVModel(props, 'modelValue', emit)
  // 是否只读展示纯文本
  const abFormMananger = inject('abForm') as AbFormProvide
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText

  const haveValue = ref(false)

  /**
   * inputField相关的引用，用于表单abForm
   */
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: modelValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  /**
   * 【校验相关】
   */
  const inputBlur = () => {
    AbformValidate.blurValidate(abInputField)
  }
  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(abInputField)
  })
  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(abInputField)
  })

  //获取参数列表
  const getParamList = (config: any) => {
    const paramList = [] as any
    if (!config) {
      return paramList
    }
    const patternStr = /\{(.+?)\}/g
    let rule = null
    const defaultRule = ['yyyy', 'mm', 'dd', 'MM', 'DD', 'NO', 'no']

    do {
      rule = patternStr.exec(config.rule)
      if (rule && !defaultRule.includes(rule[1])) {
        paramList.push(rule[1])
      }
    } while (rule)
    return paramList
  }
  const serialConfig = ref({})
  watch(
    () => props.serialNoCode,
    (value) => {
      //无权限或者已经有值了，不请求后台
      if (
        props.permission === 'n' ||
        props.permission === 'r' ||
        props.modelValue ||
        !value
      ) {
        return
      }
      sysApi.serialNo.getSerialConfigByCode(value).then((result: any) => {
        serialConfig.value = result.data
        const paramList = getParamList(serialConfig.value)
        //有参数，则不需要处理
        if (paramList.length > 0) {
          return
        }
        getSerialNo()
      })
    },
    { immediate: true }
  )

  const paramList = computed(() => {
    return getParamList(serialConfig.value)
  })

  const getSerialNo = () => {
    sysApi.serialNo.getNextNo(formData).then((resp: any) => {
      if (resp.isOk) {
        modelValue.value = resp.data
      }
    })
  }
  const closeDialog = () => {
    getSerialNo()
    dialogVisable.value = false
  }

  onMounted(() => {
    //加入表单校验
    AbformValidate.addField2Form(abInputField, props.permission, abFormMananger)
  })

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
