<template>
  <ab-upload-dialog
    v-if="['b', 'w'].includes(tablePermission)"
    accept=".xls,.xlsx"
    :after-save="impSub"
    :data="state.uploadData"
    size="small"
    type="primary"
  />

  <el-button
    v-if="['b', 'w'].includes(tablePermission)"
    size="small"
    style="margin-right: 10px"
    type="primary"
    @click="expData"
  >
    {{ props.tempText }}
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    :before-close="handleClose"
    :title="$abT('custform.common.columnSelect', '字段选择')"
    width="788px"
  >
    <div>
      <el-checkbox-group v-model="state.selectColumns">
        <el-checkbox
          v-for="item in state.columns"
          :key="item.code"
          :label="item.code"
          :value="item.code"
        >
          {{ item.comment }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button text @click="dialogVisible = false">
          {{ $abT('page.common.cancel', '取消') }}
        </el-button>
        <el-button type="primary" @click="dialogOk">
          {{ $abT('page.common.download', '下载') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import abUploadDialog from '~/agilebpm/package/ab-core/components/ab-upload-dialog/index.vue'
  import { bizApi } from '~/agilebpm/api'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { abT } from '@/i18n'

  const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    modelValue: {
      type: Array,
    },
    //初始化数据
    // eslint-disable-next-line vue/require-default-prop
    initData: {
      type: Object,
      required: true,
    },
    permission: {
      type: Object,
    },
    tablePermission: {
      type: String,
      default: 'w',
    },
    tablePath: {
      type: String,
      required: true,
    },
    boCode: {
      type: String,
      required: true,
    },
    formDesignCode: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: '导入',
    },
    tempText: {
      type: String,
      default: '导入模板',
    },
  })
  const emit = defineEmits(['update:modelValue'])

  const dialogVisible = ref(false)

  const handleClose = (done: () => void) => {
    done()
  }

  const state = reactive({
    columns: [] as any,
    selectColumns: [] as any,

    selectMap: [] as any,
    fileName: '',
    uploadData: {
      btnText: props.text,
      tip: '请选择.xls,.xlsx文件',
      url: `${bizApi.bizForm.BizFormColumnsImport}?formCode=${props.formDesignCode}&tableCode=${props.tablePath}&boCode=${props.boCode}`,
    },
  })
  const perObj = props.permission
  let primaryCode = ''
  onMounted(() => {
    if (props.tablePermission === 'n' ) {
      return
    }
    let tableCode = props.tablePath

    if (tableCode.endsWith('List')) {
      tableCode = tableCode.substring(0, tableCode.length - 4)
    }

    let filteredKeys :any;
    if(perObj){
      filteredKeys = Object.keys(perObj).filter(key => perObj[key] === "b" || perObj[key] === "w"|| perObj[key] === "r")
    }
    //从后端获取可导出子表字段
    bizApi.bizTable.bizSimTableGetFun(tableCode).then((result: any) => {
      if (result.isOk) {
        if (result.data?.columns.length > 0) {
          state.fileName = result.data.comment
          const selMap = new Object()
          result.data.columns.forEach((item: any) => {
            if ((item && item.setting != 'optimLock'  && filteredKeys.includes(item.code))|| item.primary == 1) {
              if(item.primary == 1){
                primaryCode = item.code
              }
              state.columns.push(item)
              state.selectColumns.push(item.code)
              selMap[item.code] = null
            }
          })

          state.selectMap.push(selMap)
        }
      }
    })
  })
  //导入后返回格式化后的数据
  const impSub = (result: any) => {
    if (
      result.data &&
      result.data[props.tablePath] &&
      result.data[props.tablePath].length > 0
    ) {
      result.data[props.tablePath].forEach((item: any) => {
        const list = props.modelValue as any
        let isUpdata = false
        let list_new: any
        list.forEach((l: any) => {
          if(item[primaryCode] && l[primaryCode] ==item[primaryCode]){
            isUpdata = true
            for (const propertyName in item) {
              if (propertyName.indexOf('$') == -1 && (perObj[propertyName]=='b' || perObj[propertyName]=='w')) {
                l[propertyName] = item[propertyName]
              }
            }
          }
        })
        if(!isUpdata) {
          list_new = JSON.parse(JSON.stringify(props.initData)) //abUtil.Arrays.newAbSubList()
          for (const propertyName in item) {
            if ((propertyName.indexOf('$') == -1 && (perObj[propertyName]=='b' || perObj[propertyName]=='w'))|| (propertyName == primaryCode)) {
              list_new[propertyName] = item[propertyName]
            }
          }
          list.push(list_new)
        }

        emit('update:modelValue', list)
      })
    }
  }

  const expData = () => {
    dialogVisible.value = true
  }

  const dialogOk = async () => {
    if (state.selectColumns.length == 0) {
      ElMessage({
        message: '请选择导出字段！',
        type: 'warning',
      })
      return
    }

    const data = {
      columnTableCode: props.tablePath,
      selectColumns: state.selectColumns,
      boCode: props.boCode,
    }
    data[props.tablePath] = state.selectMap

    bizApi.bizForm
      .exportExcel(props.formDesignCode, data)
      .then((result: any) => {
        if (result) {
          abTools.downImgFile(`${state.fileName}导入模板.xls`, result)
        } else {
          ElMessage({
            message: result?.msg ? result.msg : '导出错误！',
            type: 'error',
          })
        }
      })
    dialogVisible.value = false
  }
</script>
