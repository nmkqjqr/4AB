import { abT } from '@/i18n'
export const initBpmDataAndFormData = (
  data: any,
  vueContext: any,
  bpmData: BpmData,
  formData: CustFormData
) => {
  bpmData.defName = data.defName
  bpmData.buttonList = data.buttonList
  bpmData.actionData = {
    defId: data.defId,
    actionName: '',
    presetDestination: '',
    opinion: '',
    extendConf: {
      param: {},
    },
  }
  if (
    vueContext &&
    vueContext.proxy &&
    vueContext.proxy.$route &&
    vueContext.proxy.$route.query
  ) {
    Object.assign(
      bpmData.actionData.extendConf.param,
      vueContext.proxy.$route.query
    )
  }
  bpmData.getFormDataFn = (button: BpmButton) => {
    // 客户表单自定义 fn:custValid 校验
    const validateForm =
      'start,agree,oppose,signOppose,signAgree,externalEventSubmit,externalEventStart,signWaive'.indexOf(
        button.actionName
      ) != -1
    const formRef: any = vueContext?.refs[data.bpmForm.type || 'url']
    if (formRef == null)
      console.error(
        abT('bpm.office.formNotExist', '在线表单，或者URL表单不存在！')
      )
    return formRef.getData(validateForm)
  }

  bpmData.bpmForm = data.bpmForm
  bpmData.ensureCandidate = data.ensureCandidate

  bpmData.bpmInstance = data.bpmInstance
  bpmData.bpmTask = data.bpmTask
  bpmData.bpmNodeConfig = data.bpmNodeConfig

  if (data.bpmForm.type == 'url') {
    bpmData.actionData.data = {}
    return
  }

  //开始处理内部表单
  bpmData.actionData.data = data.innerFormData.data
  bpmData.actionData.boLoadMap = data.innerFormData.boLoadMap

  const form = data.innerFormData.bizForm
  formData.html = form.html
  formData.js = form.js
  formData.data = data.innerFormData.data
  formData.tablePermission = data.innerFormData.tablePermission
  formData.permission = data.innerFormData.permission
  formData.initData = data.innerFormData.initData
  formData.permissionType = data.innerFormData.permissionType
  formData.permissionValue = data.innerFormData.permissionValue
  formData.bpmInstance = data.bpmInstance
  formData.bpmTask = data.bpmTask
  formData.actionData = bpmData.actionData
}
