<template>
  <div>
    <el-container>
      <el-header
        v-if="
          props.componentConfig.control.formButton &&
          props.componentConfig.control.formButton.length > 0
        "
        style="line-height: 60px"
      >
        <template
          v-for="(item, index) in props.componentConfig.control.formButton"
          :key="index"
        >
          <!-- 保存 -->
          <!-- <el-button
            v-if="item.type == '1'"
            :disabled="props.componentConfig.control.isReadonly"
            :loading="item.loading"
            :type="item.css"
            @click="save(item)"
          >
            {{ item.name }}
          </el-button> -->
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
        </template>
      </el-header>
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
    name: 'AbToolbarLayout',
  }
</script>
<script setup lang="ts">
  import { reactive, ref, PropType, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Check } from '@element-plus/icons-vue'
  import { bizApi, postData } from '@agilebpm/api'
  import { abTools, abUtil, abForm as custForm } from '~/agilebpm'

  const globalParams = inject('globalParams') as any
  const props = defineProps({
    componentConfig: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
  })
  const pageData = reactive({
    formData: {} as CustFormData,
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
  })

  const hasload = ref(false)
  const loadData = () => {
    hasload.value = true
    const isOldForm = pageData.formData.html
    // 获取在线表单后，再渲染在线表单
    bizApi.bizForm
      .getFormData(
        props.componentConfig.control.formKey,
        globalParams[props.componentConfig.control.idKey],
        props.componentConfig.control.isReadonly
      )
      .then(({ data }) => {
        if (isOldForm) {
          abUtil.easyClone(data.data, pageData.formData.data)
          return
        }

        const form = data.bizForm
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
  // // code 预览时需要显示表单  formKey编辑设计时需要回显已选中表单
  // &&

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
  // const abFormRef = ref()
  // const save = (btnItem: any) => {
  //   abFormRef.value.getData(true).then((formJson: any) => {
  //     if (formJson !== false) {
  //       bizApi.bizForm
  //         .saveFormData(
  //           props.componentConfig.control.formKey,
  //           pageData.formData.data
  //         )
  //         .then(({ data }) => {
  //           if (props.componentConfig.control.idKey) {
  //             globalParams[props.componentConfig.control.idKey] = data
  //           }
  //           ElMessage({
  //             type: 'success',
  //             message: '保存成功',
  //           })
  //           reloadByBtn(btnItem)
  //         })
  //     }
  //   })
  // }

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
    let str = ''
    if (btnItem.params && btnItem.params.length > 0) {
      btnItem.params.forEach((item: any) => {
        for (const key in globalParams) {
          if (item == key) {
            str += `${item}=${globalParams[key]}&&`
          }
        }
      })
      str = str.substring(0, str.length - 2)
    }
    postData(`${btnItem.url}?${str}`).then(
      (result: any) => {
        if (result.isOk) {
          ElMessage({
            showClose: true,
            message: result.msg || '操作成功',
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
            message: result.msg || '操作失败',
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
          if (btnItem.assignment[0].comment) {
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
            btnItem.assignment.forEach((assiItem: any) => {
              for (const key in globalParams) {
                if (
                  assiItem.nameParam == key &&
                  ((globalParams[key] && globalParams[key].length > 0) ||
                    Number(globalParams[key]))
                ) {
                  assiItem.value = globalParams[key]
                }
              }
            })
            for (const key in data.data[data.bizForm.boCode]) {
              btnItem.assignment.forEach((assiItem: any) => {
                if (
                  key == assiItem.key &&
                  (assiItem.value.length > 0 || Number(assiItem.value))
                ) {
                  data.data[data.bizForm.boCode][key] = assiItem.value
                }
              })
            }
          }
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
    if (proxy.$route.name && proxy.$route.name == 'FormCustSqlPreView') {
      window.parent.postMessage({ type: 'abCloseDrawer' }, '*')
      return
    }
    abTools.closeTab(proxy.$route.fullPath)
    proxy.$router ? proxy.$router.back() : window.history.back()
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
</style>
