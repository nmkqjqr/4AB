<template>
  <slot></slot>
</template>
<script lang="ts" setup>
  import { defineAsyncComponent, PropType, provide } from 'vue'
  import { ValidateFieldsError } from 'async-validator'
  import { validate } from './ab-form-field-validate'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const abFormData = reactive({
    // 当前表单下的所有字段控件（需要校验的都要注册进来）
    fields: [] as Array<AbInputField>,
    // 表单只读下，是否展示为纯文本模式，即不需要input框
    readonlyShowText: true,
    labelWidth: 120,
    noElmFilelds: [] as any,
  })

  /**
   * 【表单校验相关逻辑】
   */
  const doValidate = async (isTips: boolean, filter: string) => {
    if (abFormData.fields.length === 0) return true

    let validationErrors: any = {}
    //先执行无页面elm元素的子表校验，让后续页面校验的进行相同信息覆盖更新
    for (const item of abFormData.noElmFilelds) {
      for (let index = 0; index < item.subTable.length; index++) {
        const s = item.subTable[index]
        for (const f of item.fields) {
          const field = abUtil.clone(f)
          field.name = `${field.name}【第${index + 1}条】`
          field.modelValue = s[f.columnCode]
          try {
            await validate(field)
          } catch (result: any) {
            validationErrors = {
              ...validationErrors,
              ...(result.fields as ValidateFieldsError),
            }
          }
        }
      }
    }

    for (const field of abFormData.fields) {
      if (filter && !field.name.startsWith(filter)) continue

      try {
        await validate(field)
      } catch (result: any) {
        validationErrors = {
          ...validationErrors,
          ...(result.fields as ValidateFieldsError),
        }
      }
    }

    // 校验通过
    if (Object.keys(validationErrors).length === 0) return true
    // 校验失败，整理提示语句
    let errorStr = ''
    for (const key in validationErrors) {
      const fieldError = validationErrors[key]
        .map((item: any) => {
          return item.message
        })
        .filter(Boolean)
        .join('，')

      if (!fieldError) continue

      if (errorStr) {
        errorStr = `${errorStr}<br/>`
      }
      errorStr = `${errorStr + key} ： ${fieldError}`
    }
    // 是否提示
    if (isTips) {
      ElNotification({
        title: '表单校验不通过！',
        message: errorStr,
        customClass: 'top-notification',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      })
    }

    return validationErrors
  }
  /**
   * 控件注册进入表单的入口
   */
  const addField = (field: AbInputField) => {
    abFormData.fields.push(field)
  }
  /**
   * 控件移除时，移除掉校验
   */
  const removeField = (field: AbInputField) => {
    if (field.name) {
      abFormData.fields.splice(abFormData.fields.indexOf(field), 1)
    }
  }

  const getFields = () => {
    return abFormData.fields
  }

  const addElmField = (field: any) => {
    abFormData.noElmFilelds.push(field)
  }

  const setElmField = (fields: any) => {
    abFormData.noElmFilelds = fields
  }

  const getNoElmField = (field: any) => {
    return abFormData.noElmFilelds
  }

  provide(
    'abForm',
    reactive({
      getFields,
      addField,
      removeField,
      doValidate,
      addElmField,
      setElmField,
      getNoElmField,
      readonlyShowText: abFormData.readonlyShowText,
      labelWidth: abFormData.labelWidth,
      key: 0,
    })
  )

  // 将外部允许调用的方法
  defineExpose({ doValidate })
</script>

<style lang="scss">
  .formItem {
    .el-form-item__content {
      width: 100% !important;
    }
    .el-form-item__content > div {
      width: 100% !important;
      .ab-input {
        width: 100% !important;
        max-width: 500px !important;
      }
    }
  }
</style>
