<template>
  <div id="abCustFormLayoutDiv">
    <el-container>
      <el-header
        class="noprint"
        v-if="
          props.componentConfig.control.formButton &&
          props.componentConfig.control.formButton.length > 0
        "
        style="z-index: 99; line-height: 60px"
      >
        <template
          v-for="(item, index) in props.componentConfig.control.formButton"
          :key="index"
        >
          <!-- 保存 -->
          <el-button
            v-if="item.type == '1'"
            :disabled="props.componentConfig.control.isReadonly"
            :loading="item.loading"
            :type="item.css"
            @click="save(item, false)"
          >
            {{ item.name }}
          </el-button>
          <!-- 改变状态 -->
          <el-button
            v-if="item.type == '2'"
            :loading="item.loading"
            :type="item.css"
            @click="changeDataFn(item)"
          >
            {{ item.name }}
          </el-button>
          <!-- 弹框按钮 -->
          <el-button
            v-if="item.type == '3'"
            :loading="item.loading"
            :type="item.css"
            @click="openFormDialog(item)"
          >
            {{ item.name }}
          </el-button>
          <!-- 返回按钮 -->
          <el-button
            v-if="item.type == '4'"
            :loading="item.loading"
            :type="item.css"
            @click="backPage(item)"
          >
            {{ item.name }}
          </el-button>
          <!-- 对话框赋值并保存 -->
          <ab-cust-dialog
            v-if="
              item.type == '5' && item.codeValue && item.codeValue.length > 0
            "
            :dialog-key="item.codeValue"
            :dialog-setting="{ multiple: false }"
            style="margin: 0 6px"
            :type="item.css"
            @ok="chooseDialog($event, item)"
          >
            {{ item.name }}
          </ab-cust-dialog>
          <!-- 打印按钮 -->
          <el-button
            v-if="item.type == '6'"
            :type="item.css"
            v-print="printContent"
          >
            {{ item.name }}
          </el-button>
        </template>
      </el-header>
      <el-divider
        v-if="
          props.componentConfig.control.formButton &&
          props.componentConfig.control.formButton.length > 0
        "
        class="dividermar noprint"
        style="margin-top: 0"
      />
      <!-- :style="{
          height: props.componentConfig.h
            ? props.componentConfig.h * 10 - 50 + 'px'
            : '',
        }" -->
      <el-main class="styleTop18">
        <cust-form
          :key="new Date().getTime()"
          ref="abFormRef"
          :form-data="pageData.formData"
        />
      </el-main>
    </el-container>
    <el-dialog
      v-model="info.formDialog"
      append-to-body
      :title="info.btnItemFormName"
      width="60%"
    >
      <cust-form
        v-if="info.formData.html"
        ref="abDiaFormRef"
        :form-data="info.formData"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-space wrap>
            <el-button text type="primary" @click="info.formDialog = false">
              取消
            </el-button>
            <el-button type="primary" @click="dialogOk">确定</el-button>
          </el-space>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  export default {
    name: 'AbCustFormLayout',
  }
</script>
<script setup lang="ts">
  import { reactive, ref, PropType, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Check } from '@element-plus/icons-vue'
  import { bizApi, postData } from '@agilebpm/api'
  import { abTools, abUtil, abForm as custForm } from '~/agilebpm'
  import { abT } from '@/i18n'
  import useAbStoreAdapter from '../../../../api/ab-store'

  const abUser = useAbStoreAdapter().getAbUser
  const globalParams = inject('globalParams') as any
  const props = defineProps({
    componentConfig: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
  })
  const pageData = reactive({
    formData: {} as CustFormData,
    form: {} as any,
    loading: false,
    height: `${window.innerHeight * 0.68}px`,
  })
  const abDiaFormRef = ref()
  const info = reactive({
    formDialog: false,
    btnItemFormName: '',
    btnItemFormKey: '',
    formData: {} as CustFormData,
    btnItemTypeDialog: {},
    column: [],
  })

  const hasload = ref(false)

  onMounted(async () => {
    if (props.componentConfig.control.formKey) {
      const resultDesign = await bizApi.bizForm.getDesignCode(
        props.componentConfig.control.formKey
      )
      info.column = resultDesign.data.pcJson.column
    }
  })

  const loadData = () => {
    if (!props.componentConfig.control.formKey) {
      return
    }
    hasload.value = true
    // const isOldForm = pageData.formData.html
    // 获取在线表单后，再渲染在线表单
    bizApi.bizForm
      .getFormData(
        props.componentConfig.control.formKey,
        globalParams[props.componentConfig.control.idKey],
        props.componentConfig.control.isReadonly
      )
      .then(({ data }) => {
        // if (isOldForm) {
        //   abUtil.easyClone(data.data, pageData.formData.data)
        //   return
        // }
        // 如果是有赋值设置
        if (
          props.componentConfig.control.formAssignment &&
          props.componentConfig.control.formAssignment.length > 0
        ) {
          props.componentConfig.control.formAssignment.forEach(
            (assiItem: any) => {
              for (const key in globalParams) {
                if (assiItem.nameParam == key) {
                  if (
                    (globalParams[key] && globalParams[key].length > 0) ||
                    Number(globalParams[key])
                  ) {
                    assiItem.value = globalParams[key]
                  } else {
                    assiItem.value = ''
                  }
                }
              }
            }
          )
          if (info.column) {
            info.column.forEach((columnIt: any) => {
              props.componentConfig.control.formAssignment.forEach(
                (assiItem: any) => {
                  if (
                    columnIt.code == assiItem.code &&
                    ((assiItem.value && assiItem.value.length > 0) ||
                      Number(assiItem.value))
                  ) {
                    data.data[data.bizForm.boCode][columnIt.code] =
                      assiItem.value
                  }
                  // 如果存在分组情况下 遍历下面children节点去赋值
                  if (
                    columnIt.children &&
                    columnIt.children.column &&
                    columnIt.children.column.length > 0
                  ) {
                    columnIt.children.column.forEach((columnChildren: any) => {
                      if (
                        columnChildren.code == assiItem.code &&
                        ((assiItem.value && assiItem.value.length > 0) ||
                          Number(assiItem.value))
                      ) {
                        data.data[data.bizForm.boCode][columnChildren.code] =
                          assiItem.value
                      }
                    })
                  }
                }
              )
            })
          }
        }

        const form = data.bizForm
        pageData.form = data.bizForm
        const formData = {
          html: form.html,
          js: form.js,
          data: data.data,
          tablePermission: data.tablePermission,
          permission: data.permission,
          initData: data.initData,
          boLoadMap: data.boLoadMap,
          combinationParams: globalParams,
        }
        pageData.formData = formData
      })
  }

  loadData()

  watch(
    () => globalParams,
    (newVal) => {
      if (newVal) {
        if (
          props.componentConfig.control.formKey &&
          props.componentConfig.control.formKey.length > 0
        ) {
          // loadData()
          // 如果是有赋值设置
          if (
            props.componentConfig.control.formAssignment &&
            props.componentConfig.control.formAssignment.length > 0
          ) {
            props.componentConfig.control.formAssignment.forEach(
              (assiItem: any) => {
                for (const key in newVal) {
                  if (assiItem.nameParam == key) {
                    if (
                      (newVal[key] && newVal[key].length > 0) ||
                      Number(newVal[key])
                    ) {
                      assiItem.value = newVal[key]
                    } else {
                      assiItem.value = ''
                    }
                  }
                }
              }
            )
            if (info.column) {
              info.column.forEach((columnIt: any) => {
                props.componentConfig.control.formAssignment.forEach(
                  (assiItem: any) => {
                    if (
                      columnIt.code == assiItem.code &&
                      ((assiItem.value && assiItem.value.length > 0) ||
                        Number(assiItem.value))
                    ) {
                      pageData.formData.data[pageData.form.boCode][
                        columnIt.code
                      ] = assiItem.value
                    }
                    // 如果存在分组情况下 遍历下面children节点去赋值
                    if (
                      columnIt.children &&
                      columnIt.children.column &&
                      columnIt.children.column.length > 0
                    ) {
                      columnIt.children.column.forEach(
                        (columnChildren: any) => {
                          if (
                            columnChildren.code == assiItem.code &&
                            ((assiItem.value && assiItem.value.length > 0) ||
                              Number(assiItem.value))
                          ) {
                            pageData.formData.data[pageData.form.boCode][
                              columnChildren.code
                            ] = assiItem.value
                          }
                        }
                      )
                    }
                  }
                )
              })
            }
          }
        }
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => pageData.formData.data[pageData.form.boCode],
    (newVal) => {
      if (newVal) {
        if (
          props.componentConfig.control.reverseFormAssignment &&
          props.componentConfig.control.reverseFormAssignment.length > 0
        ) {
          for (const key in globalParams) {
            globalParams[key] = ''
            props.componentConfig.control.reverseFormAssignment.forEach(
              (reverseItem: any) => {
                if (reverseItem.nameParam == key) {
                  if (
                    (newVal[reverseItem.code] &&
                      newVal[reverseItem.code].length > 0) ||
                    Number(newVal[reverseItem.code])
                  ) {
                    globalParams[key] = newVal[reverseItem.code]
                  } else {
                    globalParams[key] = ''
                  }
                }
              }
            )
          }
        }
      }
    },
    { deep: true, immediate: true }
  )

  // 设置更新属性
  const { componentConfig } = toRefs(props)
  componentConfig.value.relaod = loadData

  const { proxy } = abTools.useCurrentInstance()
  // 当id发生变化了，这里重新加载在线表单
  watch(
    () => {
      return globalParams[props.componentConfig.control.idKey]
    },
    (newValue, oldVal) => {
      const code = proxy.$route.params.code
      if (
        code ||
        (newValue.length > 0 &&
          newValue !== '${urlParam}' &&
          newValue !== '${currentUserId}' &&
          newValue !== '${currentUserAccount}' &&
          newValue !== '${currentOrgId}' &&
          newValue !== '${currentOrgCode}')
      ) {
        loadData()
      }
    }
  )

  // 当formKey发生变化了，这里重新加载在线表单
  watch(
    () => {
      return props.componentConfig.control.formKey
    },
    (newValue, oldVal) => {
      // 原先的写法
      if (
        newValue.length > 0 &&
        proxy.$route.name == 'BizFormCombinationList'
      ) {
        // globalParams[props.componentConfig.control.idKey] = ''
        pageData.formData.html = ''
        loadData()
      }
    }
  )

  const code = proxy.$route.params.code
  // code 预览时需要显示表单  formKey编辑设计时需要回显已选中表单

  onMounted(() => {
    window.setTimeout(() => {
      if (
        !hasload.value &&
        props.componentConfig.control.formKey &&
        props.componentConfig.control.formKey.length > 0
      ) {
        loadData()
      }
    }, 200)
  })

  //   proxy.$route.name == 'BizFormCombinationList'
  // 保存方法
  const abFormRef = ref()
  const save = (btnItem: any, isReload: any) => {
    abFormRef.value.getData(true).then((formJson: any) => {
      if (formJson !== false) {
        bizApi.bizForm
          .saveFormData(
            props.componentConfig.control.formKey,
            pageData.formData.data
          )
          .then(({ data }) => {
            if (props.componentConfig.control.idKey) {
              globalParams[props.componentConfig.control.idKey] = data
            }
            ElMessage({
              type: 'success',
              message: '保存成功',
              duration: 1000,
              onClose: () => {
                if (
                  proxy.$route.name &&
                  (proxy.$route.name == 'FormCustSqlPreView' ||
                    proxy.$route.name == 'FormCustSqlView')
                ) {
                  window.parent.postMessage({ type: 'abCloseDrawer' }, '*')
                  return
                }
                if (!isReload) {
                  window.location.reload()
                }
              },
            })
            reloadByBtn(btnItem)
          })
      }
    })
  }

  const getFlatComponentList = inject(
    'getFlatComponentList'
  ) as () => FormCombinationComponent[]

  // 根据按钮配置重新联动加载其他组件
  const reloadByBtn = (btnItem: any) => {
    const list = getFlatComponentList()
    if (btnItem.linkageRefresh && btnItem.linkageRefresh.length > 0) {
      const result = list.filter((obj: any) =>
        btnItem.linkageRefresh.includes(obj.key)
      )
      result.forEach((element) => {
        element.relaod && element.relaod()
      })
    }
  }

  //改变状态
  const changeDataFn = (btnItem: any) => {
    if (!btnItem.url || btnItem.url.length <= 0) {
      ElMessage({
        showClose: true,
        message: '未没有接口地址',
        type: 'error',
      })
      return
    }
    let url = ''
    let params = ''
    let str = ''
    let urlParams = ''
    if (btnItem.url.indexOf('?') > -1) {
      url = btnItem.url.split('?')[0]
      params = btnItem.url.split('?')[1]
    } else {
      url = btnItem.url
    }

    if (btnItem.params && btnItem.params.length > 0) {
      btnItem.params.forEach((item: any) => {
        for (const key in globalParams) {
          if (item == key) {
            str += `${item}=${globalParams[key]}&`
          }
        }
      })
      str = str.substring(0, str.length - 1)
    }

    if (str.length > 0) {
      urlParams = `${url}?code=${props.componentConfig.control.formKey}&${params}&${str}`
    } else {
      urlParams = `${url}?code=${props.componentConfig.control.formKey}&${params}`
    }

    postData(urlParams).then(
      ({ msg, data, isOk }) => {
        if (data || isOk) {
          ElMessage({
            showClose: true,
            message: msg || '操作成功',
            type: 'success',
          })
          reloadByBtn(btnItem)

          if (btnItem.js) {
            try {
              const func = new Function(btnItem.js)
              return func()
            } catch (error) {
              console.log(`js格式化输入有误`)
            }
          }
        } else {
          ElMessage({
            showClose: true,
            message: msg || abT('page.common.operateFailed', '操作失败'),
            type: 'error',
          })
        }
      },
      () => {}
    )
  }

  const openFormDialog = (btnItem: any) => {
    if (btnItem.type == '3') {
      info.formDialog = true
      info.btnItemTypeDialog = btnItem
      info.btnItemFormName = btnItem.formName
      info.btnItemFormKey = btnItem.formKey
    }
    info.formData.html = ''

    // 获取在线表单后，再渲染在线表单
    bizApi.bizForm
      .getFormData(
        btnItem.formKey,
        globalParams[btnItem.idKey],
        btnItem.isReadonly
      )
      .then(({ data }) => {
        const form = data.bizForm
        // 如果是弹框表单
        if (
          btnItem.type == '3' &&
          btnItem.assignment &&
          btnItem.assignment.length > 0
        ) {
          btnItem.assignment.forEach((assiItem: any) => {
            for (const key in globalParams) {
              if (
                assiItem.nameParam == key &&
                ((globalParams[key] && globalParams[key].length > 0) ||
                  Number(globalParams[key]))
              ) {
                assiItem.value = globalParams[key]
                data.data[data.bizForm.boCode][assiItem.code] = assiItem.value
              }
            }
          })
        } else {
          if (
            props.componentConfig.control.formAssignmentList &&
            props.componentConfig.control.formAssignmentList.length > 0
          ) {
            props.componentConfig.control.formAssignmentList.forEach(
              (item: any) => {
                if (btnItem.assignment && btnItem.assignment.length > 0) {
                  btnItem.assignment.forEach((assiItem: any) => {
                    if (
                      item.code == assiItem.code &&
                      ((assiItem.value && assiItem.value.length > 0) ||
                        Number(assiItem.value))
                    ) {
                      data.data[data.bizForm.boCode][item.code] = assiItem.value
                    }
                  })
                }
              }
            )
          }
        }

        const formData = {
          html: form.html,
          js: form.js,
          data: data.data,
          tablePermission: data.tablePermission,
          permission: data.permission,
          initData: data.initData,
          boLoadMap: data.boLoadMap,
          combinationParams: globalParams,
        }
        info.formData = formData
      })
  }

  const backPage = (btnItem: any) => {
    // 如果被内嵌时，抛出个事件让外部人员帮忙关闭
    if (
      proxy.$route.name &&
      (proxy.$route.name == 'FormCustSqlPreView' ||
        proxy.$route.name == 'FormCustSqlView')
    ) {
      window.parent.postMessage({ type: 'abCloseDrawer' }, '*')
      return
    }
    abTools.closeTab(proxy.$route.fullPath)
    proxy.$router ? proxy.$router.back() : window.history.back()
  }

  const getNowTime = () => {
    const myDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
    // const time = myDate.toJSON().split('T').join(' ').substr(0, 19) 年月日时分秒
    const time = myDate.toJSON().split('T')[0]
    return time
  }

  // 点击操作对话框
  const chooseDialog = (list: any, item: any) => {
    if (item.dialogList && item.dialogList.length > 0) {
      props.componentConfig.control.formAssignmentList.forEach((it: any) => {
        item.dialogList.forEach((assiItem: any) => {
          if (
            it.code == assiItem.key &&
            ((assiItem.value && assiItem.value.length > 0) ||
              Number(assiItem.value))
          ) {
            // 如果字段与对话框字段对应
            if (list[0][assiItem.value]) {
              pageData.formData.data[pageData.form.boCode][it.code] =
                list[0][assiItem.value]
            } else {
              // 选择默认值类型 并且赋值固定默认值
              if (assiItem.value == '${curTime}') {
                pageData.formData.data[pageData.form.boCode][it.code] =
                  getNowTime()
              } else if (assiItem.value == '${currentUserId}') {
                pageData.formData.data[pageData.form.boCode][it.code] =
                  abUser.userId
              } else if (item.dfDataType == 'Null') {
                pageData.formData.data[pageData.form.boCode][it.code] = 'Null'
              } else {
                pageData.formData.data[pageData.form.boCode][it.code] =
                  assiItem.value
              }
            }
          }
        })
      })
      save(item, true)
    }
  }

  const dialogOk = () => {
    abDiaFormRef.value.getData(true).then((formJson: any) => {
      if (formJson !== false) {
        bizApi.bizForm
          .saveFormData(info.btnItemFormKey, info.formData.data)
          .then(({ data }) => {
            // globalParams[props.componentConfig.control.idKey] = data
            ElMessage({
              type: 'success',
              message: '保存成功',
            })
            reloadByBtn(info.btnItemTypeDialog)
            info.formDialog = false
          })
      }
    })
  }

  //这里是打印的配置项
  const printContent = ref({
    id: 'abCustFormLayoutDiv', //这里的id就是上面我们的打印区域id，实现指哪打哪
    popTitle: '打印', // 打印配置页上方的标题
    extraHead:
      '<meta http-equiv="Content-Language"content="zh-cn"/>,<style>  #printId {  100%;  } <style>', // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
    preview: false, // 是否启动预览模式，默认是false
    previewTitle: '预览的标题', // 打印预览的标题
    previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
    zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
  })

  let intervalID: any

  // 在组件销毁前停止定时器
  onBeforeUnmount(() => {
    clearInterval(intervalID)
  })

  watch(
    () => [
      componentConfig.value?.control?.timedRefresh,
      componentConfig.value?.control?.refreshCycle,
    ],
    () => {
      const ct = componentConfig.value?.control
      clearInterval(intervalID)
      if (ct.timedRefresh) {
        intervalID = setInterval(
          function () {
            if (ct.formKey && ct.idKey) {
              loadData()
            }
          },
          ct.refreshCycle > 1 ? ct.refreshCycle * 1000 : 1000
        )
      }
    },
    {
      immediate: true,
    }
  )
</script>

<style lang="scss" scoped>
  .item-card {
    display: inline-block;
    margin: 16px;
    text-align: center;
    cursor: pointer;
  }
  .height100 {
    height: 100% !important;
    overflow: auto;
  }
  .styleTop18 {
    padding: 18px 0 0 0;
  }
</style>
