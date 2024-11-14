import * as abTools from '~/agilebpm/utils/ab-tools'
import { FormInstance } from 'element-plus'
import { defineEmits, getCurrentInstance } from 'vue'

export default function dialogOperator(
  formEl: FormInstance,
  actionData: ActionData
) {
  // @ts-ignore
  const { proxy } = getCurrentInstance()
  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])
  // 点击取消操作，关闭对话框
  const dialogCancel = () => {
    proxy.$emit('dialogCancel', false)
  }
  //点击确认操作
  const dialogOk = (formEl: FormInstance | undefined) => {
    abTools.formValidate(formEl)?.then(() => {
      dialogCancel()
      proxy.$emit('callback', actionData)
    })
  }
  return {
    dialogCancel,
    dialogOk,
  }
}
