<template>
  <div id="abFormDiv" style="background-color: white">
    <el-container>
      <el-header
        class="noprint"
        :style="{
          height: pageData.buttonCustom.length > 0 ? '35px' : '0',
          marginTop: pageData.buttonCustom.length > 0 ? '10px' : '0',
        }"
      >
        <template
          v-if="pageData.buttonCustom.length > 0"
        >
          <template v-for="(item, index) in pageData.buttonCustom" :key="index">
            <template v-if="item.type == '1'">
              <el-button
                v-if="!pageData.isReadOnly"
                :icon="Check"
                :loading="pageData.loading"
                :type="item.css"
                @click="save()"
              >
                {{ item.name }}
              </el-button>
            </template>
            <template v-if="item.type == '4'">
              <el-button :icon="Back" :type="item.css" @click="back">
                {{ item.name }}
              </el-button>
            </template>
            <template v-if="item.type == '2'">
              <el-button
                :loading="item.loading"
                :type="item.css"
                @click="changeDataFn(item)"
              >
                {{ item.name }}
              </el-button>
            </template>
            <!-- 弹框表单 -->
            <template v-if="item.type == '3'">
              <el-button :type="item.css" @click="openFormDialog(item)">
                {{ item.name }}
              </el-button>
            </template>
            <!-- 对话框赋值并保存 -->
            <template
              v-if="
                item.type == '5' && item.codeValue && item.codeValue.length > 0
              "
            >
              <ab-cust-dialog
                :dialog-key="item.codeValue"
                :dialog-setting="{ multiple: false }"
                style="margin: 0 6px"
                :type="item.css"
                @ok="chooseDialog($event, item)"
              >
                {{ item.name }}
              </ab-cust-dialog>
            </template>
            <template v-if="item.type == '6'">
              <el-button @click="printContent" :type="item.css">
                {{ item.name }}
              </el-button>
            </template>
          </template>
        </template>
        <slot></slot>
        <el-button
          v-if="pageData.dataId && pageData.del"
          :icon="Delete"
          @click="del"
        >
          删除
        </el-button>
      </el-header>
      <el-divider
        v-if="pageData.buttonCustom.length > 0"
        class="dividermar noprint"
      />
      <el-main :style="{ height: pageData.height, overflow: 'auto' }">
        <cust-form
          v-if="pageData.formData.html"
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

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Check, Back, Delete } from '@element-plus/icons-vue'
  import useAbStoreAdapter from '../../api/ab-store'
  import {
    abForm as custForm,
    bizApi,
    abTools,
    postData,
    abUtil,
  } from '~/agilebpm'

  const abUser = useAbStoreAdapter().getAbUser
  const abDiaFormRef = ref()
  const emit = defineEmits(['closeDrawer'])
  const props = defineProps({
    paramsData: { type: Object, default: null },
    getFlatComponentList: { type: Array, default: null },
    componentConfig: { type: Object, default: null },
  })

  const { proxy } = abTools.useCurrentInstance()
  let formCode =
    (props.paramsData && props.paramsData.formCode
      ? props.paramsData.formCode
      : false) ||
    proxy.$route.query.code ||
    proxy.$route.params.code

  if (!formCode.endsWith('_pc')) {
    formCode = `${formCode}_pc`
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const pageData = reactive({
    buttonCustom: [] as any,
    boCode: '',
    formData: {} as CustFormData,
    loading: false,
    data: {} as any,
    dataId:
      proxy.$route.query.id ||
      (props.paramsData && props.paramsData.id ? props.paramsData.id : false) ||
      '',
    backName:
      proxy.$route.query.backName ||
      (props.paramsData && props.paramsData.backName
        ? props.paramsData.backName
        : false) ||
      '',
    del: !!proxy.$route.query.del,
    saveBack:
      !!proxy.$route.query.saveBack ||
      (props.paramsData && props.paramsData.saveBack
        ? !!props.paramsData.saveBack
        : false), //保存后返回
    saveClose:
      props.paramsData && props.paramsData.saveClose == '1' ? true : false, //保存后返回
    isReadOnly:
      !!(proxy.$route.query.isReadOnly == '1') ||
      (props.paramsData && !!(props.paramsData.isReadOnly == '1')
        ? true
        : false) ||
      proxy.$route.name == 'FormViewDetail', //只读模式
    height: `${window.innerHeight * 0.9}px`,
    isDrawer: props.paramsData && props.paramsData.isDrawer ? true : false, //是否是抽屉打开
  })

  const info = reactive({
    formDialog: false,
    btnItemFormName: '',
    btnItemFormKey: '',
    formData: {} as CustFormData,
  })

  // 如果是抽屉打开并且是新增而且链接上面带有id
  if (props.paramsData && props.paramsData.isDrawer && !props.paramsData.id) {
    pageData.dataId = ''
  }

  const abFormRef = ref()
  const save = () => {
    pageData.loading = true
    abFormRef.value.getData(true).then((formJson: any) => {
      if (formJson !== false) {
        bizApi.bizForm.saveFormData(formCode, pageData.formData.data).then(
          ({ data }) => {
            pageData.loading = false
            if (pageData.saveBack) {
              ElMessage({
                type: 'success',
                message: '保存成功',
              })
              back()
            } else if (pageData.isDrawer || pageData.saveClose) {
              ElMessage({
                type: 'success',
                message: '保存成功',
              })
              emit('closeDrawer')
            } else {
              ElMessage({
                type: 'success',
                message: '保存成功',
                duration: 1000,
                onClose: () => {
                  window.location.reload()
                },
              })
            }
            // 后置联动刷新
            if (
              props.componentConfig &&
              props.componentConfig.control.reloadCom &&
              props.componentConfig.control.reloadCom.length > 0
            ) {
              reloadByBtn(props.componentConfig.control.reloadCom)
            }
          },
          () => {
            pageData.loading = false
          }
        )
      } else {
        pageData.loading = false
      }
    })
  }

  // 根据按钮配置重新联动加载其他组件
  const reloadByBtn = (linkageRefresh: any) => {
    const list = props.getFlatComponentList
    if (linkageRefresh && linkageRefresh.length > 0) {
      const result = list.filter((obj: any) => linkageRefresh.includes(obj.key))
      result.forEach((element) => {
        console.info(`to reload - ${element.label}`)
        element.relaod && element.relaod()
      })
    }
  }

  const back = () => {
    if (pageData.isDrawer || pageData.saveClose) {
      emit('closeDrawer')
    } else {
      abTools.closeTab(proxy.$route.fullPath)
      if (pageData.backName) {
        proxy.$router.push({
          name: pageData.backName,
        })
      } else {
        proxy.$router.back()
      }
      if (localStorage.getItem('loginType') != 'dd') {
        window.close()
      }
    }
  }
  const del = () => {
    bizApi.bizForm
      .removeFormData(formCode, pageData.dataId)
      .then(({ data }) => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      })
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
      item.dialogList.forEach((assiItem: any) => {
        if (
          assiItem.key &&
          ((assiItem.value && assiItem.value.length > 0) ||
            Number(assiItem.value))
        ) {
          // 如果字段与对话框字段对应
          if (list[0][assiItem.value]) {
            pageData.formData.data[pageData.boCode][assiItem.key] =
              list[0][assiItem.value]
          } else {
            // 选择默认值类型 并且赋值固定默认值
            if (assiItem.value == '${curTime}') {
              pageData.formData.data[pageData.boCode][assiItem.key] =
                getNowTime()
            } else if (assiItem.value == '${currentUserId}') {
              pageData.formData.data[pageData.boCode][assiItem.key] =
                abUser.userId
            } else if (item.dfDataType == 'Null') {
              pageData.formData.data[pageData.boCode][assiItem.key] = 'Null'
            } else {
              pageData.formData.data[pageData.boCode][assiItem.key] =
                assiItem.value
            }
          }
        }
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
    btnItem.loading = true
    postData(btnItem.url).then(
      ({ msg, data }) => {
        if (data) {
          ElMessage({
            showClose: true,
            message: msg || '操作成功',
            type: 'success',
          })
        } else {
          ElMessage({
            showClose: true,
            message: msg || '操作失败',
            type: 'error',
          })
        }
        btnItem.loading = false
      },
      () => {
        btnItem.loading = false
      }
    )
  }
  // 弹框表单
  const openFormDialog = (btnItem: any) => {
    if (btnItem.type == '3') {
      info.formDialog = true
      info.btnItemFormName = btnItem.formName
      info.btnItemFormKey = btnItem.formKey
    }
    info.formData.html = ''
    // 获取在线表单后，再渲染在线表单
    bizApi.bizForm
      .getFormData(btnItem.formKey, '', btnItem.isReadonly)
      .then(({ data }) => {
        const form = data.bizForm
        // 如果是弹框表单
        if (
          btnItem.type == '3' &&
          btnItem.assignment &&
          btnItem.assignment.length > 0
        ) {
          btnItem.assignment.forEach((assiItem: any) => {
            for (const key in pageData.data) {
              if (
                assiItem.nameParam == key &&
                ((pageData.data[key] && pageData.data[key].length > 0) ||
                  Number(pageData.data[key]))
              ) {
                assiItem.value = pageData.data[key]
                data.data[data.bizForm.boCode][assiItem.code] = assiItem.value
              }
            }
          })
        }
        const formData = {
          html: form.html,
          js: form.js,
          data: data.data,
          tablePermission: data.tablePermission,
          permission: data.permission,
          initData: data.initData,
          boLoadMap: data.boLoadMap,
        }
        info.formData = formData
      })
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
            info.formDialog = false
          })
      }
    })
  }

  const printContent = () => {
    window.print()
  }

  //这里是打印的配置项
  // const printContent = ref({
  //   id: 'abFormDiv', //这里的id就是上面我们的打印区域id，实现指哪打哪
  //   popTitle: '打印', // 打印配置页上方的标题
  //   extraHead:
  //     '<meta http-equiv="Content-Language"content="zh-cn"/>,<style>  #printId {  100%;  } <style>', // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
  //   preview: false, // 是否启动预览模式，默认是false
  //   previewTitle: '预览的标题', // 打印预览的标题
  //   previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
  //   zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
  // })

  onMounted(async () => {
    pageData.buttonCustom = []
    // 获取在线表单后，再渲染在线表单
    bizApi.bizForm
      .getFormData(formCode, pageData.dataId, pageData.isReadOnly)
      .then(({ data }) => {
        if (data.buttons && data.buttons.length > 0) {
          pageData.buttonCustom = data.buttons
        }

        pageData.data = data.data[data.bizForm.boCode]
        pageData.boCode = data.bizForm.boCode
        const form = data.bizForm
        useAbStoreAdapter().changeTabsMeta({
          fullPath: proxy.$route.fullPath,
          meta: { title: `${form.name}` },
        })

        // 赋值
        for (const key in data.data[pageData.boCode]) {
          if (data.data[pageData.boCode].hasOwnProperty(key)) {
            if (
              props.paramsData &&
              props.paramsData.hasOwnProperty(key) &&
              (data.data[pageData.boCode][key] === undefined ||
                data.data[pageData.boCode][key] === '')
            ) {
              data.data[pageData.boCode][key] = props.paramsData[key]
            }
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
          permissionType: data.permissionType,
          permissionValue: data.permissionValue,
        }
        pageData.formData = formData
      })
  })
</script>

<style lang="scss" scoped>
  .a {
    color: 'red';
  }
</style>
