<template>
  <div
    v-if="permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <el-card
      v-if="props.showStyle === 'card'"
      shadow="hover"
      style="margin-bottom: 15px"
    >
      <template #header>
        <span style="font-size: 16px; color: #2282e2">
          {{ props.cardTitle }}
        </span>
        <el-tooltip v-bind="validateTips">
          <ab-cust-dialog
            v-if="permission !== 'r' && !props.disabled && props.dialogKey"
            v-model="pageData.data"
            :dialog-key="props.dialogKey"
            :dialog-setting="{ multiple: 0 }"
            :param="props.dialogParam"
            style="margin-left: 20px"
            :value-mapping="valueMapping"
            @ok="handeleForm"
          >
            <el-icon style="margin-left: 0px; vertical-align: middle">
              <Search />
            </el-icon>
            <span v-if="props.searchDesc" style="vertical-align: middle">
              {{ props.searchDesc }}
            </span>
            <span v-else-if="props.formCode" style="vertical-align: middle">
              {{ $abT('page.common.choose', '请选择') }}
            </span>
          </ab-cust-dialog>
        </el-tooltip>
      </template>
      <cust-form
        v-if="pageData.formData.html && pageData.show"
        ref="abFormRef"
        :form-data="pageData.formData"
      />
      <el-empty
        v-else
        :description="$abT('page.common.notflowData', '暂无数据')"
        :image-size="50"
      />
    </el-card>

    <div v-else>
      <el-tooltip v-bind="validateTips">
        <ab-cust-dialog
          v-if="permission !== 'r' && !props.disabled && props.dialogKey"
          v-model="pageData.data"
          :dialog-key="props.dialogKey"
          :dialog-setting="{ multiple: 0 }"
          :param="props.dialogParam"
          style="margin-left: 20px"
          :value-mapping="valueMapping"
          @ok="handeleForm"
        >
          <el-icon style="margin-left: 0px; vertical-align: middle">
            <Search />
          </el-icon>
          <span v-if="props.searchDesc" style="vertical-align: middle">
            {{ props.searchDesc }}
          </span>
          <span v-else style="vertical-align: middle">
            {{ $abT('page.common.choose', '请选择') }}
          </span>
        </ab-cust-dialog>
      </el-tooltip>

      <cust-form
        v-if="pageData.formData.html && pageData.show"
        ref="abFormRef"
        :form-data="pageData.formData"
      />
      <el-empty
        v-else-if="props.formCode"
        :description="$abT('page.common.notflowData', '暂无数据')"
        :image-size="50"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { formReferenceProps } from './formReference'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { Search } from '@element-plus/icons-vue'
  import custForm from '../index.vue'
  import { bizApi } from '~/agilebpm/api'
  import { abT } from '@/i18n'

  const props = defineProps(formReferenceProps)

  //双向绑定
  const emit = defineEmits(['update:modelValue', 'input'])
  const value = useVModel(props, 'modelValue', emit)

  // 是否只读展示纯文本
  const abFormMananger = inject('abForm') as AbFormProvide
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText

  const pageData = reactive({
    data: {},
    param: {},
    show: false,
    formData: {} as CustFormData,
  })

  const valueMapping = computed(() => {
    const result = {}
    result[props.valueField] = 'value'
    result[props.labelField] = 'label'
    return result
  })

  /**
   * inputField相关的引用，用于表单abForm
   */
  const abInputField: AbInputField = reactive({
    rules: props.rules,
    name: props.desc,
    modelValue: value,
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
  // 加入表单校验
  onMounted(() => {
    if (props.modelValue) {
      getFormData(props.formCode, props.modelValue)
    }
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

  watch(
    () => pageData.data,
    (newValue: any) => {
      if (!newValue) {
        value.value = ''
      } else {
        value.value = newValue.value
      }
      inputBlur()
    },
    { deep: true }
  )

  //父组件的 modelValue 改变，查询表单信息
  watch(
    () => props.modelValue,
    (newValue: any) => {
      if (newValue) {
        getFormData(props.formCode, newValue)
      }
    }
  )

  //通过点击的index 来获取dataId
  const handeleForm = (dataList: any) => {
    if (!dataList || dataList.length === 0) {
      return
    }
    pageData.show = false
    if (!props.valueField) {
      ElMessage.error(
        abT(
          'abform.formReference.dataDetailMsg',
          '详情关联表单的关键字段的值为空，请检查！'
        )
      )
      return
    }
    const dataId = dataList[0][props.valueField]

    //getFormData(props.formCode, dataId)
  }

  const getFormData = async (formCode: any, dataId: any) => {
    pageData.show = false
    // 获取在线表单后，再渲染在线表单
    await bizApi.bizForm
      .getFormDataEncrypt(formCode, dataId)
      .then((res: any) => {
        if (res.isOk && res.data) {
          const data = res.data
          const form = data.bizForm
          const formData = {
            html: form.html,
            js: form.js,
            data: data.data,
            tablePermission: data.tablePermission,
            permission: data.permission,
            initData: data.initData,
            boLoadMap: data.boLoadMap,
            permissionType: data.permissionType,
            permissionValue: data.permissionValue,
          }
          pageData.formData = formData
          pageData.show = true
        }
      })
      .catch((res: any) => {})
  }
</script>
