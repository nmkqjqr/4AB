<template>
  <el-dialog
    v-model="state.dialogFormVisible"
    :before-close="closeDialog"
    title="流水号预览"
    width="400px"
  >
    <el-form
      v-if="state.paramList.length > 0"
      ref="formRef"
      :model="state.formData"
    >
      <el-form-item
        v-for="(param, index) in state.paramList"
        :key="index"
        :label="param"
      >
        <el-input v-model="state.formData.paramMap[param]" />
      </el-form-item>
    </el-form>
    <el-table
      v-if="state.list.length > 0"
      v-loading="state.listLoading"
      border
      :data="state.list"
    >
      <el-table-column
        align="center"
        label="流水号预览结果"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ scope.row }}
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="closeDialog">关闭</el-button>
      <el-button
        v-ab-btn-rights:serialNo_preview
        v-if="state.paramList.length > 0"
        type="primary"
        @click="onSubmit(formRef)"
      >
        预览
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, toRefs } from 'vue'
  import type { FormInstance } from 'element-plus'

  import { sysApi } from '~/agilebpm'

  const state = reactive({
    list: [],
    dialogFormVisible: false,
    listLoading: false,
    paramList: [],
    formData: {
      code: '',
      param: '',
      paramMap: {},
    },
  })
  const formRef = ref<FormInstance>()

  const loadingopenFn = async (config: any) => {
    state.list = []
    state.dialogFormVisible = true
    state.listLoading = true
    state.formData.code = config.code
    getParamList(config)
    if (state.paramList.length == 0) {
      await sysApi.serialNo.previewserialNo(state.formData).then((result) => {
        state.list = result.data
      })
    }
  }
  //获取参数列表
  const getParamList = (config: any) => {
    const patternStr = /\{(.+?)\}/g
    let rule = null
    const defaultRule = ['yyyy', 'mm', 'dd', 'MM', 'DD', 'NO', 'no']
    do {
      rule = patternStr.exec(config.rule)
      if (rule && !defaultRule.includes(rule[1])) {
        state.paramList.push(rule[1])
      }
    } while (rule)
  }

  const onSubmit = async (formEl: FormInstance | undefined) => {
    await sysApi.serialNo.previewserialNo(state.formData).then((result) => {
      state.list = result.data
      state.paramList = []
    })
  }

  const loadingcloseFn = () => {
    state.listLoading = false
  }

  const closeDialog = () => {
    state.dialogFormVisible = false
    state.paramList.splice(0, state.paramList.length)
    state.formData.paramMap = {}
  }

  defineExpose({
    ...toRefs(state),
    loadingopenFn,
    loadingcloseFn,
  })
</script>
