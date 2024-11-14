<template>
  <div>
    <el-space wrap>
      <el-button
        v-for="btn in qian5geButton"
        :key="btn.actionName"
        :icon="actionDialogConfig[btn.actionName]?.icon"
        :loading="btnInfo.buttonLoading[btn.actionName]"
        style="margin-bottom: 12px"
        :type="actionDialogConfig[btn.actionName]?.css || 'primary'"
        @click="buttonClick(btn)"
      >
        {{ $abT(btn.name) }}
      </el-button>
      <el-dropdown
        v-if="bpmData.buttonList && bpmData.buttonList.length > 6"
        @command="dropdownMenuClick"
      >
        <el-button
          :loading="btnInfo.buttonLoading[btnInfo.currentBtnDropdownAlias]"
          style="margin-bottom: 12px"
          type="primary"
        >
          {{ $abT('page.common.more', '更多') }}...
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="btn in moreButtons"
              :key="btn.actionName"
              :command="btn.actionName"
              :disabled="btnInfo.buttonLoading[btn.actionName]"
              :divided="true"
            >
              <el-popover
                v-if="
                  actionDialogConfig[btn.actionName] &&
                  actionDialogConfig[btn.actionName].tips
                "
                :content="actionDialogConfig[btn.actionName].tips"
                placement="right"
                trigger="hover"
                width="300"
              >
                <el-icon>
                  <component :is="actionDialogConfig[btn.actionName]?.icon" />
                </el-icon>
                <span>
                  {{ $abT(btn.name) }}
                </span>
              </el-popover>
              <div v-else>
                <el-icon>
                  <component :is="actionDialogConfig[btn.actionName]?.icon" />
                </el-icon>
                <span>
                  {{ $abT(btn.name) }}
                </span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button
        :icon="actionDialogConfig.cloase.icon"
        style="margin-bottom: 12px"
        type="danger"
        @click="back('close')"
      >
        {{ $abT('page.common.close', '关闭') }}
      </el-button>
      <component
        :is="btnInfo.dynamicComponent.component"
        v-if="btnInfo.dynamicComponent.isShow"
        :bpm-data="props.bpmData"
        :is-show="btnInfo.dynamicComponent.isShow"
        :title="btnInfo.dynamicComponent.actionTitle"
        :ui-data="btnInfo.dynamicComponent.uiData"
        @callback="btnInfo.dynamicComponent.callBack"
        @dialog-cancel="dialogCancel"
      />
    </el-space>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { bpmApi } from '~/agilebpm'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { request } from '~/agilebpm/api'
  import { ElMessageBox } from 'element-plus'
  import { actionDialogConfig } from './bpm-action-dialog/actionDialogConfig'
  import { ArrowDown } from '@element-plus/icons-vue'
  import * as dd from 'dingtalk-jsapi'
  import { abT } from '@/i18n'
  /**
   *  此处引入 流程动作涉及的按钮
   */
  // 通用 意见按钮
  import BpmOpinionDialog from './bpm-action-dialog/bpm-just-opinion-dialog.vue'
  const { proxy } = abTools.useCurrentInstance()

  // 表单的数据对象
  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    // 引用按钮，关闭时，返回的页面
    backRouterName: { required: false, type: String, default: null },
  })

  //请求流程指引数据
  const param = {
    defId: props.bpmData?.actionData?.defId,
    nodeId: props.bpmData?.bpmTask?.nodeKey,
    taskId: props.bpmData?.bpmTask?.id,
    instanceId: props.bpmData?.bpmTask?.id,
  }

  //修改按钮名称，支持没有修改过的按钮名称翻译
  props.bpmData.buttonList?.forEach((btn) => {
    if (!btn.isModifiedName) {
      btn.name = btn.translate
    }
  })

  //如果有流程指引窗口弹出
  bpmApi.bpmPlugins.getNodeExplain(param).then((result: any) => {
    props.bpmData.buttonList?.forEach((btn) => {
      if (
        btn.actionName == 'nodeExplain' &&
        result.data?.isAutoPopup == 'true'
      ) {
        buttonClick(btn)
      }
    })
  })

  const qian5geButton = computed(() => {
    return props.bpmData.buttonList?.filter((item, index) => {
      return index < 6
    })
  })
  const moreButtons = computed(() => {
    return props.bpmData.buttonList?.filter((item, index) => {
      return index > 5
    })
  })

  const btnInfo = reactive({
    buttonLoading: {},
    currentBtnDropdownAlias: 'none',
    dynamicComponent: {
      actionTitle: '',
      component: markRaw(BpmOpinionDialog),
      isShow: false,
      callBack: (actionData: ActionData) => {},
      uiData: {},
    },
  })

  // 下拉时候的点击
  const dropdownMenuClick = (alias: any) => {
    btnInfo.currentBtnDropdownAlias = alias
    props.bpmData.buttonList?.forEach((btn) => {
      if (btn.actionName === alias) {
        buttonClick(btn)
        return
      }
    })
  }

  // 配置了不弹出框，但是配置了明确候选人，自由候选人都要弹出
  const agreeShowDialog = (bpmData: BpmData, actionName: string) => {
    if (
      bpmData.bpmNodeConfig?.requiredOpinion &&
      bpmData.bpmNodeConfig?.requiredOpinion.indexOf('true') != -1
    ) {
      return true
    }
    //配置了明确候选人要弹,启动节点
    if (bpmData.ensureCandidate && actionName === 'start') {
      return true
    }
    //配置了自由分支选择要弹
    if (bpmData.bpmNodeConfig?.custGatewayRouter) {
      return true
    }
    //配置了自由候选人要弹
    if (
      bpmData.bpmNodeConfig?.custNodeUser &&
      bpmData.bpmNodeConfig?.custNodeUser != 'no'
    ) {
      return true
    }
    return false
  }

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
      } else {
        //actionData.data = formData 内部表本身就绑定好了对象，不需要赋值了
      }
      if (button.actionName === 'printed') {
        // TODO 打印 特殊处理
        btnInfo.buttonLoading[button.actionName] = false
        //this.printForm(flowData, busData)
        console.log('proxy.$route.query', proxy.$route.query)

        proxy.$router.push({
          name: 'BpmInstancePrintHome',
          query: proxy.$route.query,
        })
        return
      }

      if (!execuFn(button.javaScript)) {
        btnInfo.buttonLoading[button.actionName] = false
        return
      }

      actionData.actionName = button.actionName
      // 只有 同意，反对、跳过，启动 的时候 且 配置了【不需要意见】 才需要跳过意见弹出，其他均弹出意见框
      let isSkipDiaolog
      if (
        ['agree', 'start', 'skip', 'oppose'].indexOf(button.actionName) != -1
      ) {
        isSkipDiaolog = !agreeShowDialog(props.bpmData, button.actionName)
      } else if (
        [
          'recall',
          'manualEnd',
          'revoke',
          'instanceEnd',
          'carbonCopyReview',
          'signOppose',
          'signAgree',
          'signWaive',
        ].indexOf(button.actionName) != -1
      ) {
        isSkipDiaolog =
          !props.bpmData.bpmNodeConfig?.requiredOpinion ||
          props.bpmData.bpmNodeConfig.requiredOpinion == 'false'
      } else if ('reject' == button.actionName) {
        isSkipDiaolog =
          !props.bpmData.bpmNodeConfig?.requiredOpinion ||
          props.bpmData.bpmNodeConfig.requiredOpinion == 'false'
        if (
          props.bpmData.bpmNodeConfig?.allowFreeBack ||
          (props.bpmData.bpmNodeConfig?.backNodeArr &&
            props.bpmData.bpmNodeConfig?.backNodeArr.length > 0)
        ) {
          isSkipDiaolog = false
        }
      }
      if (
        actionDialogConfig[button.actionName] &&
        actionDialogConfig[button.actionName].component &&
        !isSkipDiaolog
      ) {
        const component = actionDialogConfig[button.actionName].component
        btnInfo.dynamicComponent.component = component
        btnInfo.dynamicComponent.isShow = true
        btnInfo.dynamicComponent.actionTitle = abT(button.name)
        btnInfo.dynamicComponent.uiData = button.uiData

        btnInfo.dynamicComponent.callBack = (actionData: ActionData) => {
          postAction(actionData, button)
        }
      } else {
        if (!actionData.opinion) {
          actionData.opinion = abT(button.name)
        }
        postAction(actionData, button)
      }
    })
  }

  const postAction = (actionData: ActionData, button: BpmButton) => {
    const doAction = (button as any).doAction
    if (doAction) {
      doAction(actionData, button).finally(() => {
        // 关闭按钮加载
        btnInfo.buttonLoading[button.actionName] = false
        btnInfo.dynamicComponent.isShow = false
      })
      return
    }
    // 执行动作
    bpmApi.bpmData.doAction(actionData).then(
      (result) => {
        btnInfo.buttonLoading[button.actionName] = false
        if (result.isOk) {
          btnInfo.dynamicComponent.isShow = false
          // 下一步也是自己的任务，则可以进入下一步
          if (result.data && result.data.name) {
            // TODO
          }
          // 【成功提示】
          ElMessageBox.alert(
            `${abT(button.name)} ${abT(
              'page.common.operateSuccess',
              '操作成功'
            )}!`,
            abT('page.common.promptInformation', '提示信息'),
            {
              confirmButtonText: abT('page.common.ok', '确定'),
              callback: () => {
                if (
                  actionDialogConfig.doActionNotBack2ListActions.indexOf(
                    button.actionName
                  ) == -1
                ) {
                  back(button.actionName)
                }
              },
            }
          )
        } else {
          // 【继续操作】
          if (result.code == 'bpmConfirm') {
            ElMessageBox.confirm(
              result.msg,
              abT('page.common.confirm', '请确认'),
              {
                confirmButtonText: abT('page.common.ok', '确定'),
                cancelButtonText: abT('page.common.cancel', '取消'),
                type: 'warning',
                dangerouslyUseHTMLString: true,
              }
            ).then(
              () => {
                actionData.extendConf.confirm = true
                setTimeout(() => {
                  postAction(actionData, button)
                }, 500)
              },
              () => {
                if (actionData['dialogCallBack']) {
                  actionData['dialogCallBack']()
                }
              }
            )
          }
        }
      },
      () => {
        btnInfo.buttonLoading[button.actionName] = false
      }
    )
  }

  // 返回上一页
  const back = (actionName?: string) => {
    // 如果被内嵌时，抛出个事件让外部人员帮忙关闭
    if (proxy.$route.query.abIframeType == 'iframe') {
      console.info(`abCloseIframe:${actionName}`)
      window.parent.postMessage(
        { type: 'abCloseIframe', actionName: actionName },
        '*'
      )
      if (proxy.$route.query.outerClose) {
        console.info(
          `outerClose,${abT(
            'bpm.office.notExecutingRoutingReturn',
            '不在执行路由返回'
          )}`
        )
        return
      }
    }

    abTools.closeTab(proxy.$route.fullPath)
    if (props.backRouterName) {
      proxy.$router.push({
        name: props.backRouterName,
      })
    } else {
      if (proxy.$route.fullPath.indexOf('reqSource=dd') != -1) {
        dd.quitPage({
          success: () => {},
          fail: () => {},
          complete: () => {},
        })
      } else {
        proxy.$router ? proxy.$router.back() : window.history.back()
      }
    }
  }

  const dialogCancel = (isShow: boolean, keepLoading: boolean) => {
    btnInfo.dynamicComponent.isShow = false
    if (!keepLoading) {
      btnInfo.buttonLoading[props.bpmData.actionData.actionName] = false
    }
  }

  const execuFn = (fnStr: string | undefined) => {
    if (!fnStr) return true
    // 定义自定义脚本中所用到的变量
    const actionData = props.bpmData.actionData

    const result = eval(`(() => {
  ${fnStr}
  })();`)
    if (result === false) return false
    return true
  }

  onMounted(() => {
    ;(window as any).abFirstBtnAction = () => {
      if (props.bpmData.buttonList && props.bpmData.buttonList.length > 0)
        buttonClick(props.bpmData.buttonList[0])
      else {
        console.error(
          abT('bpm.office.noUsedButtonMsg', '没有可用按钮可以调用！')
        )
      }
    }
    ;(window as any).abBtnClose = () => {
      back('close')
    }
  })

  defineExpose({
    back,
  })
</script>
