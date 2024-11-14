<template>
  <div>
    <el-space wrap>
      <el-button
        v-for="btn in props.bpmData.buttonList"
        :key="btn.actionName"
        :icon="actionDialogConfig[btn.actionName]?.icon"
        :loading="btnInfo.buttonLoading[btn.actionName]"
        style="margin-bottom: 12px"
        :type="actionDialogConfig[btn.actionName]?.css || 'primary'"
        @click="buttonClick(btn)"
      >
        {{ btn.name }}
      </el-button>

      <component
        :is="btnInfo.dynamicComponent.component"
        v-if="btnInfo.dynamicComponent.isShow"
        :bpm-data="props.bpmData"
        :is-show="btnInfo.dynamicComponent.isShow"
        :title="btnInfo.dynamicComponent.actionTitle"
        @callback="btnInfo.dynamicComponent.callBack"
        @dialog-cancel="dialogCancel"
      />
    </el-space>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { bpmApi } from '@agilebpm/api'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { actionDialogConfig } from './actionDialogConfig'
  import BpmOpinionDialog from './agreeDialog.vue'
  import { abT } from '@/i18n'

  const { proxy } = abTools.useCurrentInstance()
  // 表单的数据对象
  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    // 引用按钮，关闭时，返回的页面
    backRouterName: { required: false, type: String, default: null },
  })

  const btnInfo = reactive({
    buttonLoading: {},
    currentBtnDropdownAlias: 'none',
    dynamicComponent: {
      actionTitle: '',
      component: markRaw(BpmOpinionDialog),
      isShow: false,
      callBack: (actionData: ActionData) => {},
    },
  })

  // 按钮点击入口
  const buttonClick = (button: BpmButton) => {
    btnInfo.buttonLoading[button.actionName] = true
    // 获取在线表单数据，并校验内置校验
    const busDataFn = props.bpmData.getFormDataFn(button)
    busDataFn.then((formData: any) => {
      // 校验不通过获取数据失败
      if (formData === false || formData.valid === false) {
        btnInfo.buttonLoading[button.actionName] = false
        return
      }
      const actionData = props.bpmData.actionData
      //表单数据赋值
      if (props.bpmData.bpmForm?.type == 'url') {
        actionData.data = formData
      }

      if (!execuFn(button.javaScript)) {
        btnInfo.buttonLoading[button.actionName] = false
        return
      }

      actionData.actionName = button.actionName

      const isSkipDiaolog =
        !props.bpmData.bpmNodeConfig?.requiredOpinion ||
        props.bpmData.bpmNodeConfig.requiredOpinion == 'false'

      if (
        actionDialogConfig[button.actionName] &&
        actionDialogConfig[button.actionName].component &&
        !isSkipDiaolog
      ) {
        const component = actionDialogConfig[button.actionName].component

        btnInfo.dynamicComponent.component = component
        btnInfo.dynamicComponent.isShow = true
        btnInfo.dynamicComponent.actionTitle = button.name

        btnInfo.dynamicComponent.callBack = (actionData: ActionData) => {
          postAction(actionData, button)
        }
      } else {
        if (!actionData.opinion) {
          actionData.opinion = button.name
        }
        postAction(actionData, button)
      }
    })
  }

  const postAction = (
    actionData: ActionData,
    button: BpmButton,
    showConfirm = true
  ) => {
    // 执行动作
    bpmApi.bpmData.externalEventDoAction(actionData).then(
      (result: any) => {
        btnInfo.buttonLoading[button.actionName] = false
        if (result.isOk) {
          btnInfo.dynamicComponent.isShow = false
          if (showConfirm) {
            // 【成功提示】
            ElMessageBox.alert(
              `${button.name} ${abT(
                'page.common.operateSuccess',
                '操作成功'
              )}！`,
              abT('page.common.promptInformation', '提示信息'),
              {
                confirmButtonText: abT('page.common.ok', '确定'),
                callback: () => {
                  if (button.actionName !== 'externalEventSave') {
                    jumpPage('1')
                  }
                },
              }
            )
          }
        } else {
          // 【继续操作】
          if (result.code == 'bpmConfirm') {
            actionData.extendConf.confirm = true
            postAction(actionData, button, false)
            jumpPage('1')
          } else {
            jumpPage('-1')
          }
        }
      },
      () => {
        btnInfo.buttonLoading[button.actionName] = false
      }
    )
  }

  const jumpPage = (status: string) => {
    proxy.$router.push({
      path: '/tempLinkResultPage',
      query: {
        status: status,
        action: 'submit',
      },
    })
  }

  const dialogCancel = (isShow: boolean, keepLoading: boolean) => {
    btnInfo.dynamicComponent.isShow = false
    if (!keepLoading) {
      btnInfo.buttonLoading[props.bpmData.actionData.actionName] = false
    }
  }

  const execuFn = (fnStr: string | undefined) => {
    if (!fnStr) return true
    // TODO 获取 组件let parentScope = getCustFormComponent(this.$parent)

    const script = `let tempFunction = function(scope){ ${fnStr}};`
    const result = eval(`${script}tempFunction(parentScope);`)
    if (result === false) return false
    return true
  }
</script>
