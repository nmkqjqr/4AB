<template>
  <el-button
    size="small"
    type="primary"
    @click="expData"
  >
    <slot></slot>
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    :before-close="handleClose"
    title="导出子表信息"
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
        <el-button text @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogOk">导出</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { bizApi } from '~/agilebpm/api'
  import * as abTools from '~/agilebpm/utils/ab-tools'
import { fi } from 'element-plus/es/locale'
  const { proxy } = abTools.useCurrentInstance()
  const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    modelValue: {
      type: Array,
    },
    //初始化数据
    // eslint-disable-next-line vue/require-default-prop
    permission: {
      type: Object,
    },
    tablePath: {
      type: String,
      required: true,
    },
    boCode: {
      type: String,
      required: true,
    },
    formDesignCode:{
      type: String,
      required: true,
    },
     tablePermission: {
      type: String,
      default: 'w',
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
    fileName:'',
  })
  onMounted(() => {
     if (props.tablePermission === 'n' ) {
      return
    }
    let tableCode = props.tablePath
    if (tableCode.endsWith('List')) {
      tableCode = tableCode.substring(0, tableCode.length - 4)
    }
    const perObj = props.permission
    let filteredKeys :any;
    if(perObj){
      filteredKeys = Object.keys(perObj).filter(key => perObj[key] === "b" || perObj[key] === "w"|| perObj[key] === "r")
    }
    //从后端获取可导出子表字段
    bizApi.bizTable.bizSimTableGetFun(tableCode).then((result: any) => {
      if (result.isOk) {
        if (result.data?.columns.length > 0) {
          state.fileName = result.data.comment
          result.data.columns.forEach((item: any) => {
            if ((item && item.setting != 'optimLock'  && filteredKeys.includes(item.code))|| item.primary == 1) {
              state.columns.push(item)
              state.selectColumns.push(item.code)
            }
          })
        }
      }
    })
  })

  const expData = () => {
    if (
      props.modelValue == undefined ||
      (props.modelValue && props.modelValue.length == 0)
    ) {
      ElMessage({
        message: '表中没有数据，无需导出！',
        type: 'warning',
      })
      return
    }
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
    //导出excl

    //请求后端格式化接口
    let data = {
      columnTableCode: props.tablePath,
      selectColumns: state.selectColumns,
      boCode: props.boCode,
    }
    data[props.tablePath] = props.modelValue

    bizApi.bizForm.exportExcel(props.formDesignCode, data).then((result: any) => {
      if(result){
      abTools.downImgFile(state.fileName+'.xls', result)
    }else{
      ElMessage({
        message: result?.msg?result.msg:'导出错误！',
        type: 'error',
      })
    }
    })
    dialogVisible.value = false
  }
</script>
