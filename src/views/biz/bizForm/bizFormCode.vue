<template>
  <el-container>
    <el-header>
      <div style="margin-top: 20px">
        <el-button
          :icon="Check"
          :loading="info.saveLoading"
          type="primary"
          @click="save()"
        >
          保存源码
        </el-button>
        <el-button :icon="Back" type="danger" @click="close()">关闭</el-button>
        <el-select
          v-model="info.hotCompile"
          style="width: 100px; margin-left: 5px"
        >
          <el-option label="即时编译" :value="true" />
          <el-option label="手动编译" :value="false" />
        </el-select>
        <el-button
          v-if="!info.hotCompile"
          :icon="Check"
          plain
          style="margin-left: 5px"
          type="success"
          @click="compile()"
        >
          编译
        </el-button>
        <ab-cust-dialog
          v-model="info.historyForm"
          dialog-key="czls"
          :dialog-setting="{ multiple: 0 }"
          icon="RefreshLeft"
          :param="{ biz_id_: info.formCode }"
          style="margin-left: 3px"
          type="warning"
          :value-mapping="{
            data: 'data',
          }"
          @ok="setHistoryForm"
        >
          历史还原
        </ab-cust-dialog>
        <span
          v-if="!info.isMb && info.isTest"
          style="position: absolute; left: 51%"
        >
          <el-button :icon="Finished" plain type="success" @click="check()">
            校验表单
          </el-button>
          <el-button
            :icon="Check"
            :loading="info.saveFormLoading"
            plain
            type="success"
            @click="saveForm()"
          >
            保存表单
          </el-button>
          <ab-cust-dialog
            dialog-key="wordTemplateSelector"
            :icon="Check"
            :param="{ design_code_$VEQ: info.bizForm.designCode }"
            plain
            style="margin-left: 10px"
            type="success"
            @ok="print"
          >
            word打印
          </ab-cust-dialog>
          <el-button
            :icon="Finished"
            plain
            style="margin-left: 10px"
            type="success"
            @click="fomatData()"
          >
            格式数据
          </el-button>
          <el-button
            :icon="Finished"
            plain
            style="margin-left: 10px"
            type="success"
            @click="queryFomatData()"
          >
            query数据
          </el-button>
          <el-button
            v-if="info.dataId"
            :icon="Delete"
            plain
            type="success"
            @click="remove"
          >
            删除数据
          </el-button>
        </span>
      </div>

      <!--pdf预览对话框-->
      <pdf-dialog ref="pdfDialog" />
    </el-header>
    <el-divider class="dividermar" />
    <el-main class="mainBox">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-tabs type="border-card">
            <el-tab-pane label="html代码">
              <codemirror
                v-if="info.init"
                v-model="info.formData.html"
                :autofocus="true"
                :extensions="info.htmlExtensions"
                :indent-with-tab="true"
                placeholder="请输入html代码"
                :style="{ height: info.height }"
                @change="codeChange"
              />
            </el-tab-pane>
            <el-tab-pane label="js代码">
              <codemirror
                v-if="info.init"
                v-model="info.formData.js"
                :autofocus="true"
                :extensions="info.jsExtensions"
                :indent-with-tab="true"
                placeholder="请输入js代码"
                :style="{ height: info.height }"
                @change="codeChange"
              />
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="12">
          <!--移动端端-->
          <div v-if="info.isMb && info.mobileUrl" class="mbIframeBox">
            <iframe
              id="mbIframe"
              ref="mbIframe"
              class="mbIframe"
              frameborder="no"
              :src="`${info.mobileUrl}/biz/form/preview?code=${info.formCode}&id=${info.dataId}&${info.tokenTableName}=${info.token}`"
              :style="info.mbStyle"
            ></iframe>
          </div>
          <el-tabs v-else type="border-card">
            <el-tab-pane
              label="表单预览"
              :style="{ height: info.height, overflow: 'auto' }"
            >
              <!--PC端-->
              <cust-form
                v-if="!info.isMb && info.formData.html && info.pass"
                :key="info.key"
                ref="abFormRef"
                :form-data="info.formData"
              />
              <iframe
                v-if="info.src"
                :src="info.src"
                style="width: 90%; height: 400px"
              ></iframe>
              <div v-if="info.errorDrawer && info.errorMsg" class="codeMsg err">
                <pre>{{ info.errorMsg }}} </pre>
                <button class="dismiss" @click="info.errorDrawer = false">
                  ✕
                </button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import {
    Check,
    Back,
    Finished,
    RefreshLeft,
    Delete,
  } from '@element-plus/icons-vue'
  import { Codemirror } from 'vue-codemirror'
  import { javascript } from '@codemirror/lang-javascript'
  import { html } from '@codemirror/lang-html'
  import { oneDark } from '@codemirror/theme-one-dark'
  import {
    abForm as custForm,
    bizApi,
    abTools,
    sysApi,
    abUtil,
    postData,
  } from '~/agilebpm'
  import { Plus } from '@element-plus/icons-vue'
  import PdfDialog from '@/views/biz/bizForm/pdfDialog.vue'
  import { tokenTableName } from '@/config'
  import { getToken } from '@/utils/token'

  const { proxy } = abTools.useCurrentInstance()
  const info: any = reactive({
    formCode: proxy.$route.query.code,
    isMb: proxy.$route.query.type == 'mb',
    formData: {
      html: '',
      js: '',
    },
    height: `${window.innerHeight * 0.8}px`,
    htmlExtensions: [html()],
    jsExtensions: [javascript(), oneDark],
    key: 0,
    timer: null,
    errorDrawer: false,
    errorMsg: '',
    pass: true,
    dataId: proxy.$route.query.id || '',
    init: false,
    mbStyle: {
      width: '100%',
      height: `100%`,
    },
    mobileUrl: '',
    hotCompile: true,
    rev: 0,
    isReadOnly:
      !!(proxy.$route.query.isReadOnly == '1') ||
      proxy.$route.name == 'FormViewDetail', //只读模式
    saveLoading: false,
    saveFormLoading: false,
    bizForm: {},
    src: '',
    historyForm: {},
    isTest: proxy.$route.query.test == '1',
    tokenTableName: tokenTableName,
    token: getToken(),
  })

  onMounted(() => {
    if (info.isMb) {
      getMobileUrl()
    }

    bizApi.bizForm
      .getFormData(info.formCode, info.dataId, info.isReadOnly)
      .then(({ data }) => {
        const form = data.bizForm
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
        info.formData = formData
        info.init = true
        info.rev = data.bizForm.rev
        info.bizForm = data.bizForm
      })
  })

  /**
   * 捕获当前页面的所有异常
   */
  onErrorCaptured((err: any, vm, inf) => {
    info.pass = false
    info.errorMsg = err.stack
    info.errorDrawer = true
  })

  const close = () => {
    window.close()
  }

  const mbIframe = ref()
  const codeChange = (code: any, changeObj: any) => {
    if (info.hotCompile) {
      compile()
    }
  }

  const compile = () => {
    info.pass = false
    if (info.timer) {
      clearTimeout(info.timer) //关闭定时器
    }
    info.timer = setTimeout(() => {
      if (info.isMb) {
        mbIframe.value.contentWindow.postMessage(
          {
            html: info.formData.html,
            js: info.formData.js,
            type: 'mbChange',
          },
          '*'
        )
      }

      info.pass = true
      info.errorMsg = ''
      info.key++
    }, 300)
  }

  const abFormRef = ref()
  const check = () => {
    console.info(info.formData.data)
    abFormRef.value.getData(true).then((formJson: any) => {
      if (formJson !== false) {
        ElMessage({
          type: 'success',
          message: '校验通过',
        })
      }
    })
  }

  const save = () => {
    if (!info.pass) {
      info.errorDrawer = true
      return
    }
    info.saveLoading = true
    bizApi.bizForm
      .saveCode(info.formCode, info.formData.html, info.formData.js, info.rev)
      .then(
        ({ data }) => {
          info.rev = data
          info.saveLoading = false
          ElMessage({
            type: 'success',
            message: '保存成功',
          })
        },
        () => {
          info.saveLoading = false
        }
      )
  }

  const saveForm = () => {
    abFormRef.value.getData(true).then((formJson: any) => {
      if (formJson !== false) {
        info.saveFormLoading = true
        bizApi.bizForm.saveFormData(info.formCode, info.formData.data).then(
          ({ data }) => {
            info.saveFormLoading = false
            ElMessage({
              type: 'success',
              message: '表单保存成功',
              duration: 500,
              onClose: () => {
                //window.location.reload()
              },
            })
          },
          () => {
            info.saveFormLoading = false
          }
        )
      }
    })
  }

  const getMobileUrl = async () => {
    info.mobileUrl = await sysApi.property.getMobileUrl()
  }

  const pdfDialog = ref()
  const print = (data: any) => {
    pdfDialog.value.open(data[0], info.formData.data)
  }

  const setHistoryForm = (data: any) => {
    info.formData.html = JSON.parse(data[0].data).html.replace(/^\s*\n/gm, '')
    info.formData.js = JSON.parse(data[0].data).js.replace(/^\s*\n/gm, '')
    compile()
  }

  const fomatData = () => {
    bizApi.bizForm
      .fomatData({
        formCode: info.formCode,
        data: info.formData.data,
      })
      .then((resp) => {
        console.info('fomatData=========》')
        console.info(resp.data)
        console.info('fomatData=========》')
      })
  }

  const queryFomatData = () => {
    bizApi.bizForm.queryFomatData(info.formCode).then((resp) => {
      console.info('queryFomatData=========》')
      console.info(resp.data)
      console.info('queryFomatData=========》')
    })
  }

  const remove = () => {
    bizApi.bizForm
      .removeFormData(info.formCode, info.dataId)
      .then(({ data }) => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      })
  }
</script>
<style scoped>
  .codeMsg.err {
    color: red;
    background-color: #ffd7d7;
    border-color: red;
  }

  .codeMsg {
    position: absolute;
    right: 8px;
    bottom: 0;
    left: 8px;
    z-index: 10;
    display: flex;
    align-items: stretch;
    min-height: 40px;
    max-height: calc(100% - 500px);
    margin-bottom: 8px;
    font-family: var(--font-code);
    white-space: pre-wrap;
    border: 2px solid transparent;
    border-radius: 6px;
  }

  .dismiss {
    position: absolute;
    top: 2px;
    right: 2px;
    display: block;
    width: 18px;
    height: 18px;
    padding: 0;
    font-size: 9px;
    line-height: 18px;
    color: #fff;
    text-align: center;
    background-color: red;
    border-radius: 9px;
  }

  .dismiss[button] {
    margin: 0;
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
  }

  .mainBox {
    height: calc(100vh - 70px);
  }

  .mbIframeBox {
    width: 390px;
    height: 780px;
    padding: 28px 22px 22px 24px;
    margin: 0 auto;
    background: url('@/assets/bizform_images/sjbk.png') no-repeat;
    background-size: 100% 100%;
  }
  .mbIframeBox .mbIframe {
    border-radius: 40px;
  }

  .codeMsg pre {
    padding: 12px 20px;
    margin: 0;
    overflow: auto;
  }
</style>
