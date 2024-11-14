<template>
  <el-form-item label="表单类型" prop="formType">
    <el-select
      v-model="formData.data.formType"
      placeholder="请选择全局表单类型"
    >
      <el-option label="在线表单" value="inner" />
      <el-option label="Url表单" value="url" />
    </el-select>

    <el-button
      v-if="formData.data.formType === 'inner'"
      style="margin-left: 20px"
      type="primary"
    >
      授权
    </el-button>
  </el-form-item>

  <el-form-item
    v-if="formData.data.formType == 'url'"
    label="PC端url地址"
    prop="pcFormKey"
  >
    <el-input v-model="formData.data.pcFormKey" type="input" />
  </el-form-item>
  <el-form-item
    v-if="formData.data.formType == 'inner'"
    label="PC端表单"
    prop="formData.data.pcFormName"
  >
    <el-input
      v-model="formData.data.pcFormName"
      :disabled="true"
      style="width: 200px"
      type="input"
    />
    <el-button style="margin-left: 20px" type="primary">请选择</el-button>
  </el-form-item>

  <el-form-item
    v-if="formData.data.formType == 'url'"
    label="手机端url地址"
    prop="mobileFormKey"
  >
    <el-input v-model="formData.data.mobileFormKey" type="input" />
  </el-form-item>

  <el-form-item
    v-if="formData.data.formType == 'inner'"
    label="手机端表单"
    prop="mobileFormName"
  >
    <el-input
      v-model="formData.data.mobileFormName"
      :disabled="true"
      style="width: 200px"
    />
    <el-button style="margin-left: 20px" type="primary">请选择</el-button>
  </el-form-item>
</template>

<script lang="ts">
  declare interface FormData {
    formType: string
    pcFormKey: string
    mobileFormName: string
    pcFormName: string
    mobileFormKey: string
  }
</script>

<script lang="ts" setup>
  import { abUtil } from '~/agilebpm'
  const props = defineProps({
    modelValue: { type: FormData, required: true },
  })
  const formData: any = reactive({
    data: {
      formType: '',
      pcFormKey: '',
      mobileFormName: '',
      pcFormName: '',
      mobileFormKey: '',
    },
  })
  const emit = defineEmits(['update:modelValue'])

  formData.data = abUtil.clone(props.modelValue)

  //监视modelValue 的变化，赋值给formData
  watch(
    () => props.modelValue,
    (newValue) => {
      formData.data = abUtil.clone(newValue)
    },
    { deep: true }
  )
  //监视formData 的变化，赋值给modelValue
  watch(
    () => formData.data,
    (newValue) => {
      emit('update:modelValue', newValue)
    },
    { deep: true }
  )
</script>

<style></style>
