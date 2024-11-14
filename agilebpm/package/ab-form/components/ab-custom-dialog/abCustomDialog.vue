<template>
  <div
    v-if="permission !== 'n'"
    :class="abInputField.validateError ? 'ab-is-error' : ''"
  >
    <!-- 只读，且只读仅展示翻译后的文本,如数据字典，则需要翻译为text文本 -->
    <span v-if="permission === 'r' && readonlyShowText">{{ modelValue }}</span>
    <el-tooltip v-else v-bind="validateTips">
      <div v-if="props.showDetail">
        <el-tag v-if="!value" type="warning">
          {{ $abT('page.common.notSelect', '未选择') }}
        </el-tag>
        <el-tag
          v-for="(val, index) in value.split(',')"
          v-else
          :key="index"
          style="cursor: pointer"
          type="success"
          @click="showDetailFn(index)"
        >
          {{ val }}
        </el-tag>
        <ab-cust-dialog
          v-model="objectMappingtemp"
          :dialog-key="props.dialogKey"
          :dialog-setting="props.dialogSetting"
          :param="props.param"
          style="margin-left: 10px"
          :value-mapping="props.valueMapping"
        >
          <el-icon style="vertical-align: middle">
            <Search />
          </el-icon>
          <span v-if="props.searchDesc" style="vertical-align: middle">
            {{ props.searchDesc }}
          </span>
        </ab-cust-dialog>
      </div>

      <el-input
        v-else
        v-bind="$attrs"
        v-model="value"
        class="ab-input"
        :disabled="permission === 'r'"
        :readonly="props.disabled"
        @blur="inputBlur()"
      >
        <template #append v-if="permission !== 'r'">
          <ab-cust-dialog
            v-model="objectMappingtemp"
            :dialog-key="props.dialogKey"
            :dialog-setting="props.dialogSetting"
            :param="props.param"
            :value-mapping="props.valueMapping"
          >
            <el-icon style="vertical-align: middle">
              <Search />
            </el-icon>
            <span v-if="props.searchDesc" style="vertical-align: middle">
              {{ props.searchDesc }}
            </span>
          </ab-cust-dialog>
        </template>
      </el-input>
    </el-tooltip>
    <!--详情展示区域-->
    <el-dialog
      :append-to-body="true"
      :before-close="
        () => {
          detailInfo.show = false
        }
      "
      :destroy-on-close="true"
      :model-value="detailInfo.show"
      :title="$abT('abform.customDialog.dataDetail', '数据详情')"
      width="65%"
    >
      <cust-form
        v-if="detailInfo.formData.html"
        ref="abFormRef"
        :form-data="detailInfo.formData"
      />
      <template #footer>
        <el-button type="primary" @click="detailInfo.show = false">
          {{ $abT('page.common.ok', '确定') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { abCustomDialogProps } from './abCustomDialog'
  import * as AbformValidate from '../form-base/ab-form-field-validate'
  import { Search } from '@element-plus/icons-vue'
  import custForm from '../index.vue'
  import { bizApi } from '~/agilebpm/api'
  import { abT } from '@/i18n'

  const props = defineProps(abCustomDialogProps)

  //双向绑定
  const emit = defineEmits(['update:modelValue', 'input', 'change'])
  const value = useVModel(props, 'modelValue', emit)
  const { objectMapping } = toRefs(props)

  const objectMappingtemp = ref([] as any)

  // 是否只读展示纯文本
  const abFormMananger = inject('abForm') as AbFormProvide
  const readonlyShowText =
    props.readShowText != null
      ? props.readShowText
      : abFormMananger?.readonlyShowText

  const detailInfo = reactive({
    show: false,
    formData: {} as CustFormData,
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

  watch(
    () => value.value,
    (newValue) => {
      emit('change', newValue)
    }
  )
  // 加入表单校验
  onMounted(() => {
    if (props.objectMapping) {
      objectMappingtemp.value = props.objectMapping
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

  const handleDefaultValueList = (dataList: Array[any]) => {
    if (!props.mappingInitData || !dataList || dataList.length === 0) {
      return dataList
    }
    const result = abUtil.Arrays.newAbSubList()
    dataList.forEach((data: any) => {
      result.push(handleDefaultValue(data))
    })
    return result
  }
  //处理字段默认值
  const handleDefaultValue = (data: any) => {
    if (!props.mappingInitData || !data) {
      return data
    }

    const json = JSON.parse(JSON.stringify(props.mappingInitData))
    Object.keys(data).forEach((key: string) => {
      if (data[key]) {
        json[key] = data[key]
      }
    })
    return json
  }

  watch(
    objectMappingtemp,
    (newValue: any) => {
      if (Array.isArray(newValue)) {
        if (!objectMapping.value || objectMapping.value.length == 0) {
          if (!objectMapping.value) {
            objectMapping.value = newValue
          } else {
            objectMapping.value.push(...handleDefaultValueList(newValue))
          }
          return
        }
        newValue.forEach((newItem: any) => {
          const sameItem = objectMapping.value.find((oldItem: any) => {
            let same = true
            for (const key in props.valueMapping) {
              const val = props.valueMapping[key]
              if (oldItem[val] != newItem[val]) {
                same = false
                return
              }
            }
            if (same) {
              return oldItem
            }
          })
          if (!sameItem) {
            objectMapping.value.push(handleDefaultValue(newItem))
          }
        })
      } else {
        Object.keys(newValue).forEach((key: any) => {
          objectMapping.value[key] = newValue[key]
        })
      }
    },
    { deep: true }
  )

  //通过点击的index 来获取dataId
  const showDetailFn = (index: number) => {
    if (!props.detailKey) {
      ElMessage.error(
        abT(
          'abform.customDialog.detailKeyValueEmpty',
          '详情关联表单的关键字段的值为空，请检查！'
        )
      )
      return
    }
    const keys = props.detailKey.split(',')
    if (!keys[index]) {
      ElMessage.error(
        $abT(
          'abform.customDialog.notFindDetailKeyValue',
          '{a}找不到对应的关键字段的值',
          { a: props.detailKey }
        )
      )
      return
    }
    getFormData(props.detailFormCode, keys[index])
  }

  const getFormData = async (formCode: any, dataId: any) => {
    // 获取在线表单后，再渲染在线表单
    await bizApi.bizForm
      .getFormData(formCode, dataId, true)
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
          detailInfo.formData = formData
          detailInfo.show = true
        } else {
          ElMessage.error(
            abT(
              'abform.customDialog.getFormDataFail',
              '获取表单数据失败，请联系管理员'
            )
          )
        }
      })
  }
</script>
