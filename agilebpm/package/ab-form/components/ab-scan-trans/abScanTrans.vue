<template>
  <div v-if="permission !== 'n'">
    <el-tooltip v-bind="validateTips">
      <span>
        <span
          v-if="!hideScanValue && viewValue != undefined && viewValue != null"
        >
          <span v-if="allowModification" class="input-group">
            <el-input
              v-model="viewValue"
              class="input-width"
              :disabled="permission === 'r'"
            />
            <el-button
              v-bind="$attrs"
              class="button-width"
              :disabled="permission === 'r'"
              :icon="FullScreen"
              :style="viewValue ? 'margin-left:12px' : ''"
              type="primary"
              @click="scanTrans"
            >
              {{ $abT('abform.scanTrans.scanTrans', '扫码') }}
            </el-button>
          </span>
          <span v-else>
            <el-tag>{{ viewValue }}</el-tag>
            <el-button
              v-bind="$attrs"
              :disabled="permission === 'r'"
              :icon="FullScreen"
              :style="viewValue ? 'margin-left:12px' : ''"
              type="primary"
              @click="scanTrans"
            >
              {{ $abT('abform.scanTrans.scanTrans', '扫码') }}
            </el-button>
          </span>
        </span>
        <el-button
          v-else
          v-bind="$attrs"
          :disabled="permission === 'r'"
          :icon="FullScreen"
          type="primary"
          @click="scanTrans"
        >
          {{ $abT('abform.scanTrans.scanTrans', '扫码') }}
        </el-button>
      </span>
    </el-tooltip>
  </div>
</template>
<script lang="ts" setup>
  // import { CustFormBaseImportsUse } from '../custFormBaseImports'
  import { FullScreen } from '@element-plus/icons-vue'
  import { RuleItem } from 'async-validator'
  import { PropType, toRefs } from 'vue'
  import abScanTransMethods from '..//scanTransFunctions'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  const props = defineProps({
    //选中项绑定值:
    modelValue: {
      type: String,
      required: true,
    },
    //权限:w/r/n/b(编辑/只读/无权限/必填)   默认值 W （与element内置是否只读属性readonly绑定， 无需自己实现）
    permission: {
      type: String,
      default: 'w',
    },
    //是否隐藏返回的扫码值
    hideScanValue: {
      type: Boolean,
      required: false,
    },
    //是否允许修改返回的扫码值
    allowModification: {
      type: Boolean,
      required: false,
    },
    //映射对象（用来扫描发送信息字段绑定的值使用）
    objectMapping: {
      type: Object as any,
      default: null,
    },
    //扫描信息的字段code 跟objectMapping配合使用才能获取绑定值
    scanColumn: {
      type: String,
      default: '',
    },
    afterEvent: {
      type: Function,
      default: () => {},
    },
    tempEnable: {
      type: Boolean,
      default: false,
    },
    tempCode: {
      type: String,
      default: '',
    },
    tempParam: {
      type: Object as any,
      default: null,
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
  })

  // emit 事件定义
  const emit = defineEmits(['update:modelValue'])

  //将data内的属性转为响应式数据
  const { permission } = toRefs(props)

  const viewValue = useVModel(props, 'modelValue', emit)

  // inputField相关的引用，用于表单abForm
  const formField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: viewValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(formField)
  })

  //表单校验管理对象
  const abFormMananger = inject('abForm') as AbFormProvide

  let timeStr = 0

  let startFlag = false

  // 定义发送的事件code
  const SCAN_TRANS_FN = 'scanTransFn'
  // 定义接收的事件code
  const SCAN_RESULT_FN = 'scanResultFn'
  // 定义启动扫码的事件code
  const SCAN_START_FN = 'scanStartFn'

  // 拿到结果后赋值的方法
  const handleResultEvent = (event: any) => {
    if (timeStr <= event.detail.time) {
      if (props.tempEnable && props.tempCode) {
        let args = []
        if (props.tempParam && props.tempParam.length > 0) {
          args = props.tempParam.map((s: string) =>
            props.objectMapping[s] ? props.objectMapping[s] : s
          )
        }
        //第一个结果必然是扫码返回值，其他参数才可以跟随赋值
        viewValue.value = abScanTransMethods[props.tempCode].execute(
          event.detail.value,
          ...args
        )
      } else {
        viewValue.value = event.detail.value
      }

      props.afterEvent()
    }
  }
  // 在window对象上添加事件监听器
  window.addEventListener(SCAN_RESULT_FN, handleResultEvent)

  const handleStartEvent = (event: any) => {
    startFlag = true
  }

  // 在window对象上添加事件监听器
  window.addEventListener(SCAN_START_FN, handleStartEvent)

  //

  //防止网页回退时重复监听的问题，需要手动卸载
  onBeforeUnmount(() => {
    abFormMananger.removeField(formField)
    window.removeEventListener(SCAN_RESULT_FN, handleResultEvent)
  })

  const scanTrans = () => {
    if (!startFlag) {
      ElMessage.error('扫码枪尚未开机或者未接入电脑扫码设备，请使用移动端！')
      return
    }
    timeStr = new Date().getTime()
    let detail
    if (props.objectMapping && props.objectMapping[props.scanColumn]) {
      detail = {
        value: props.objectMapping[props.scanColumn],
        time: timeStr, // 获取当前时间戳
      }
    } else {
      detail = {
        time: timeStr, // 获取当前时间戳
      }
    }
    const event = new CustomEvent(SCAN_TRANS_FN, { detail: detail })
    window.dispatchEvent(event)
  }

  // 加入表单校验
  onMounted(() => {
    AbformValidate.addField2Form(formField, props.permission, abFormMananger)
  })

  // 动态权限必填切换后，切换校验
  watch(
    () => props.permission,
    (newValue) => {
      // 如果校验 由非必填修改为了必填，此时修改校验功能
      if (newValue && newValue === 'b') {
        AbformValidate.changeRequired(formField, true)
      } else {
        AbformValidate.changeRequired(formField, false)
      }
    }
  )

  // //测试外部传入数据用
  // window.dispatchEvent(new CustomEvent('scanResultFn',{detail:{value:'1008611',time:new Date().getTime()}}))

  // //测试外部监听数据用
  // window.addEventListener('scanTransFn', (a) => console.log(123,a.detail))
</script>

<style>
  .input-group {
    display: flex;
    align-items: center;
  }

  .input-width {
    flex: 1; /* 让input宽度自适应 */
    min-width: 40px; /* 设置最小宽度，防止过于窄小 */
  }
  .button-width {
    min-width: 82px; /* 设置按钮的固定宽度 */
    max-width: 82px; /* 设置按钮的固定宽度 */
  }
</style>
