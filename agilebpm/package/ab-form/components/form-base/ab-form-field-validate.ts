import type { RuleItem } from 'async-validator'
import Schema from 'async-validator'

// 把当前控件的引用赋值给abForm 组件，用来处理表单校验
export const addField2Form = (
  field: AbInputField,
  permission: string,
  abForm: AbFormProvide
) => {
  if (!field.rules || (Array.isArray(field.rules) && field.rules.length == 0)) {
    field.rules = { required: false, message: '必填' }
  }
  // 如果权限为b，则修改为必填
  if (permission === 'b') {
    changeRequired(field, true)
  }
  if (permission === 'n') {
    changeRequired(field, false)
  }

  abForm.addField(field)
}

export const blurValidate = async (field: AbInputField) => {
  try {
    await validate(field)
  } catch (result: any) {
    result
  }
}

// 执行校验
export const validate = async (field: AbInputField) => {
  return new Schema({
    [field.name]: field.rules,
  })
    .validate({
      [field.name]:
        field.modelValue || field.modelValue == 0 ? `${field.modelValue}` : '',
    })
    .then((result) => {
      field.validateError = ''
      return true as const
    })
    .catch(({ errors, fields }) => {
      field.validateError = errors
        .map((item: any) => {
          return item.message
        })
        .filter(Boolean)
        .join('，')
      return Promise.reject({ errors, fields })
    })
}

// 修改权限的时候，调用
export const changeRequired = (field: AbInputField, required: boolean) => {
  if (Array.isArray(field.rules)) {
    for (let index = 0; index < field.rules.length; index++) {
      const element: RuleItem = field.rules[index]
      if (element['required'] != undefined) {
        element['required'] = required
        return
      }
    }
  } else {
    if (field.rules['required'] != undefined) {
      field.rules['required'] = required
      return
    } else {
      field.rules = [field.rules]
    }
  }

  field.rules.push({ required: required, message: '必填' })
}

export const getValidateTips = (field: AbInputField) => {
  return {
    effect: 'ab-error',
    content: field.validateError,
    disabled: field.validateError === '',
    placement: 'right',
    enterable: false,
    popperClass: 'ab-error',
    hideAfter: 100,
  }
}
