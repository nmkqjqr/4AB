<template>
  <div class="viewItemFile">
    <!-- 预览文件 -->
    <el-dialog
      v-model="dialogVisible"
      append-to-body
      :before-close="handleClose"
      class="viewItemFileDialog"
      :close-on-click-modal="false"
      :show-close="false"
      style="min-width: 1180px"
      width="60%"
    >
      <template #header="">
        <span style="float: right">
          <el-button
            :icon="Download"
            :loading="loadingRef"
            type="primary"
            @click="downloadFile"
          >
            {{ $abT('page.common.download','下载') }}
          </el-button>
          <el-button :icon="CircleClose" type="danger" @click="handleClose">
            {{ $abT('page.common.close','关闭') }}
          </el-button>
        </span>
      </template>

      <textarea
        v-if="props.fileType == 'txt'"
        v-model="txtStr"
        disabled
        style="width: 100%; height: 400px"
      />

      <div v-if="props.fileType == 'docx'" class="docWrap">
        <!-- 预览文件的地方（用于渲染） -->
        <div ref="file"></div>
      </div>
      <div v-if="['xlsx', 'xls'].includes(props.fileType)">
        <div class="tab">
          <el-radio-group
            v-model="excel.sheetNameActive"
            size="small"
            @change="getSheetNameTable"
          >
            <el-radio-button
              v-for="(item, index) in excel.sheetNames"
              :key="index"
              :label="item"
            />
          </el-radio-group>
        </div>
        <div style="margin-top: 5px; overflow: auto; border: 1px solid #a0a0a0">
          <div style="padding: 10px 15px" v-html="excel.SheetActiveTable"></div>
        </div>
      </div>
      <div v-if="props.fileType == 'pdf'">
        <iframe height="1000px" :src="pdfurl" width="100%" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { request, sysApi } from '@agilebpm/api'
  import * as docx from 'docx-preview'
  import { getCurrentInstance, reactive, ref, toRefs } from 'vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  import { CircleClose, Download } from '@element-plus/icons-vue'
  import * as XLSX from 'xlsx/xlsx.mjs'
  const emit = defineEmits(['update:modelValue'])
  const { proxy } = getCurrentInstance()
  const loading = ref(false)
  const pdfurl = ref('')
  const txtStr = ref('')
  const loadingRef = ref(false)
  const dialogVisible = ref()
  const emptyTips = ref('暂无内容')
  const data = reactive({
    excel: {
      // 数据
      workbook: {},
      // 表名称集合
      sheetNames: [],
      // 激活项
      sheetNameActive: '',
      // 当前激活表格
      SheetActiveTable: '',
    },
  })
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    file: {
      default: () => {},
    },
    fileType: {
      type: String,
      required: true,
    },
    clientHeight: {
      type: Number,
      default: 600,
    },
  })

  const { excel } = toRefs(data)

  watch(
    () => props.modelValue,
    (newVel) => {
      dialogVisible.value = newVel
      if (newVel) {
        if (props.fileType == 'txt') {
          sysApi.sysFile.getDownload(props.file.id).then((rel) => {
            const reader = new FileReader()
            reader.readAsText(rel.data)
            reader.onload = function () {
              if (reader.result) {
                txtStr.value = reader.result
              }
            }
          })
        } else if (props.fileType == 'pdf') {
          pdfurl.value = sysApi.sysFile.getViewFileUrl(props.file.id)
        } else if (['xlsx', 'xls'].includes(props.fileType)) {
          request({
            url: sysApi.sysFile.downloadUrl,
            method: 'post',
            data: sysApi.sysFile.getEncryptKey(props.file.id),
            responseType: 'arraybuffer', //告诉服务器想到的响应格式
          })
            .then((res) => {
              if (res) {
                const workbook = XLSX.read(new Uint8Array(res.data), {
                  type: 'array',
                })
                const sheetNames = workbook.SheetNames // 工作表名称集合
                excel.value.workbook = workbook
                excel.value.sheetNames = sheetNames
                excel.value.sheetNameActive = sheetNames[0]
                getSheetNameTable(sheetNames[0])
              } else {
                // Message.error({ title: "失败", message: "接口请求失败" });
                loading.value = false
              }
            })
            .catch(function (error) {
              // Message.error({ title: "失败", message: "接口请求失败" });
              console.log(error)
              loading.value = false
            })
        } else if (props.fileType == 'docx') {
          sysApi.sysFile
            .getDownload(props.file.id)
            .then((res) => {
              if (res) {
                // let docx = require("docx-preview");
                docx.renderAsync(res.data, proxy.$refs.file)
              } else {
                // Message.error({ title: "失败", message: "接口请求失败" });
                loading.value = false
              }
            })
            .catch(function (error) {
              // Message.error({ title: "失败", message: "接口请求失败" });
              console.log(error)
              loading.value = false
            })
        }
      }
    }
  )

  //预览中的下载
  const downloadFile = () => {
    loadingRef.value = true
    abTools
      .downFileBySteam(props.file)
      .then(
        () => (loadingRef.value = false),
        () => (loadingRef.value = false)
      )
      .catch(() => (loadingRef.value = false))
      .finally(() => (loadingRef.value = false))
  }

  const getSheetNameTable = (sheetName) => {
    try {
      // 获取当前工作表的数据
      const worksheet = excel.value.workbook.Sheets[sheetName]
      // 转换为数据  1.json数据有些问题，2.如果是html那么样式需修改
      let htmlData = XLSX.utils.sheet_to_html(worksheet, {
        header: '',
        footer: '',
      })
      htmlData =
        htmlData === ''
          ? htmlData
          : htmlData.replace(
              /<table/,
              '<table class="default-table" border="1px solid #ccc" cellpadding="0" cellspacing="0"'
            )
      // 第一行进行改颜色
      htmlData =
        htmlData === ''
          ? htmlData
          : htmlData.replace(/<tr/, '<tr style="background:#b4c9e8"')
      excel.value.SheetActiveTable = htmlData
    } catch (e) {
      // 如果工作表没有数据则到这里来处理
      excel.value.SheetActiveTable = `<h4 style="text-align: center">${emptyTips.value}</h4>`
    }
  }

  const handleClose = () => {
    emit('update:modelValue', false)
  }
</script>
