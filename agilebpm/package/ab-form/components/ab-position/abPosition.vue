<template>
  <div
    v-if="permission !== 'n'"
    :class="formField.validateError ? 'ab-is-error' : ''"
  >
    <el-tooltip v-bind="validateTips">
      <el-card
        ref="selectRef"
        shadow="never"
        :style="[
          !showName ? 'max-width: 500px' : '',
          props.permission == 'r'
            ? ' background: #f5f7fa ; cursor : not-allowed'
            : 'cursor : pointer',
        ]"
        @click="openDialog"
      >
        <div class="container">
          <div class="left">
            <div v-if="!showName" style="color: rgb(168, 171, 178)">请选择</div>
            <div v-else>
              {{ showName }}
            </div>
            <div
              v-if="showCoordinates && showName"
              style="font-size: small; color: rgb(143, 143, 143)"
            >
              经度:{{ jd }} &nbsp 维度:{{ wd }}
            </div>
          </div>
          <div class="right">
            <svg
              class="icon"
              height="35"
              p-id="26279"
              t="1725273718540"
              version="1.1"
              viewBox="0 0 1024 1024"
              width="35"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <path
                d="M81.040491 792.291207a109.729243 109.729243 0 0 1 98.107157-60.623313h668.217587a109.519836 109.519836 0 0 1 98.002454 60.623313l62.822086 125.644171a73.292434 73.292434 0 0 1-32.667485 98.002454 73.815951 73.815951 0 0 1-32.667484 7.748058H83.762781a73.292434 73.292434 0 0 1-73.292433-73.292434 72.140695 72.140695 0 0 1 7.748057-32.667485l62.822086-125.644171z"
                fill="#C2E3FF"
                opacity=".64"
                p-id="26280"
              />
              <path
                d="M771.559918 111.299796c-3.455215-3.559918-6.910429-7.119836-10.470347-10.470348a357.981186 357.981186 0 0 0-506.136606 10.470348 383.738241 383.738241 0 0 0 0 531.788957l206.579959 212.757464 2.09407 1.989366a71.617178 71.617178 0 0 0 101.771779-1.989366l206.161145-212.757464a383.947648 383.947648 0 0 0 0-531.788957zM513.047035 478.390184a136.74274 136.74274 0 0 1-136.11452-136.638037 136.74274 136.74274 0 1 1 136.11452 136.638037z"
                fill="#43ADFF"
                p-id="26281"
              />
            </svg>
          </div>
        </div>
      </el-card>
    </el-tooltip>
    <el-dialog v-model="showDialog" destroy-on-close @confirm="handleConfirm">
      <span>
        <Position
          v-model="viewValue"
          :app-key="state.key"
          :default-current-location="defaultCurrentLocation"
          :disabled="permission === 'r' || disabled"
          :enable-modify="enableModify"
          :security-js-code="state.securityJsCode"
          :show-coordinates="showCoordinates"
          @clone-dialog="cloneDialog"
        />
      </span>
      <template #footer v-if="!disabled && permission !== 'r'">
        <div class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  export default { name: 'AbPosition' }
</script>

<script lang="ts" setup>
  import { RuleItem } from 'async-validator'
  import { PropType } from 'vue'
  import Position from './position.vue'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { sysApi } from '~/agilebpm/api'
  import { abTools } from '~/agilebpm'

  const props = defineProps({
    //选中项绑定值:
    modelValue: {
      type: String,
      required: true,
    },
    showCoordinates: {
      type: Boolean,
      default: false,
    },
    enableModify: {
      type: Boolean,
      default: false,
    },
    defaultCurrentLocation: {
      type: String,
      default: '',
    },
    //是否禁用: true/false  默认false
    disabled: {
      type: Boolean,
    },
    //权限:w/r/n/b(编辑/只读/无权限/必填)   默认值 W （与element内置是否只读属性readonly绑定， 无需自己实现）
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

  const state: any = reactive({
    key: '',
    securityJsCode: '',
  })
  // emit 事件定义
  const emit = defineEmits(['update:modelValue', 'change'])
  const viewValue: any = ref(props.modelValue)

  //表单校验管理对象
  const abFormMananger = inject('abForm') as AbFormProvide

  const validateTips = computed(() => {
    return AbformValidate.getValidateTips(formField)
  })

  // inputField相关的引用，用于表单abForm
  const formField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: viewValue,
    validateError: '',
    columnCode: props.columnCode,
    tableCode: props.tableCode,
  })

  // 移除校验
  onBeforeUnmount(() => {
    abFormMananger.removeField(formField)
  })
  // 加入表单校验
  onMounted(() => {
    AbformValidate.addField2Form(formField, props.permission, abFormMananger)
  })

  const openDialog = async () => {
    if (props.permission == 'r') {
      return
    }
    if (!state.key || !state.securityJsCode) {
      // 假设这个函数是从接口获取securityJsCode
      const config = await sysApi.configuration.getSysConfObj('aMap')

      if (!config || !config.data || !config.data.json) {
        ElMessage.error('高德地图配置缺失，无法获取密匙，请检查后再试')
        return
      }
      const configObj = JSON.parse(config.data.json)

      if (
        !config.data.isEnable ||
        !configObj.key ||
        !configObj.securityJsCode
      ) {
        ElMessage.error('高德地图配置缺失，无法获取密匙，请检查后再试')
      } else {
        state.key = configObj.key
        state.securityJsCode = abTools.decrypt(configObj.securityJsCode)
        showDialog.value = true
      }
    } else {
      showDialog.value = true
    }
  }
  const showName = ref(
    viewValue?.value?.split(',') ? viewValue.value.split(',')[0] : ''
  )

  const jd = ref(
    viewValue?.value?.split(',') ? viewValue.value.split(',')[1] : ''
  )

  const wd = ref(
    viewValue?.value?.split(',') ? viewValue.value.split(',')[2] : ''
  )

  const showDialog = ref(false)
  const selectRef = ref(null) // 引用Select组件

  const cloneDialog = () => {
    showDialog.value = false
  }

  const handleConfirm = () => {
    showDialog.value = false
    // 返回给父组件的值
    AbformValidate.blurValidate(formField)
    emit('update:modelValue', viewValue.value)
    if (!viewValue.value) {
      showName.value = ''
    }

    if (
      (showName.value && !viewValue.value) ||
      (viewValue.value && !showName.value)
    ) {
      emit('change', showName.value)
      if (
        viewValue.value.split(',') &&
        (!showName.value || showName.value != viewValue.value.split(',')[0])
      ) {
        showName.value = viewValue.value.split(',')[0]
        jd.value = viewValue.value.split(',')[1]
        wd.value = viewValue.value.split(',')[2]
      }
    } else {
      if (
        viewValue.value.split(',') &&
        (!showName.value || showName.value != viewValue.value.split(',')[0])
      ) {
        showName.value = viewValue.value.split(',')[0]
        jd.value = viewValue.value.split(',')[1]
        wd.value = viewValue.value.split(',')[2]
        emit('change', showName.value)
      }
    }
  }

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
</script>

<style lang="scss" scoped>
  :deep(.el-card .el-card__body) {
    padding: 0px; /* 你希望的内边距大小 */
  }

  .container {
    display: flex;
    align-items: center; /* 垂直居中 */
  }

  .left {
    margin-left: 8px;
    flex: 1 1 auto; /* 允许缩小，根据内容自动调整宽度 */
  }

  .right {
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    padding: 3px;
    padding-right: 10px;
  }
</style>
