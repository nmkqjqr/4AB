<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/no-lone-template -->
<template>
  <el-button closable type="default" @click="open">选择</el-button>
  <span v-if="info.data.matrixName" style="margin-left: 10px">
    <el-tag type="success">
      {{ info.data.matrixName + '【' + info.data.reportName + '】' }}
    </el-tag>
  </span>
  <el-tag v-else style="margin-left: 10px" type="warning">未选择</el-tag>
  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    draggable
    :title="`业务矩阵人员`"
    top="5vh"
    width="50%"
  >
    <el-form
      ref="formRef"
      label-position="right"
      label-suffix="："
      label-width="150px"
      :model="info.data"
    >
      <el-form-item
        label="矩阵"
        prop="matrixName"
        :rules="[{ required: true, message: '矩阵必填' }]"
      >
        <el-input
          v-model="info.data.matrixName"
          readonly
          style="width: 210px"
        />
        <ab-cust-dialog
          v-model="info.data"
          dialog-key="ywqzjz"
          :dialog-setting="{ multiple: 0 }"
          style="margin-left: 10px"
          type="primary"
          :value-mapping="{ id: 'matrixId', name: 'matrixName' }"
          @ok="choseMatrix"
        >
          请选择
        </ab-cust-dialog>
      </el-form-item>
      <el-form-item
        label="业务匹配规则"
        prop="busKeySource"
        :rules="[{ required: true, message: '业务匹配规则必填' }]"
      >
        <el-select
          v-model="info.data.busKeySource"
          placeholder="请选择业务匹配规则"
        >
          <el-option label="发起人所在的组织" value="startUserOrg" />
          <el-option label="上一任务处理者所在的组织" value="preTaskUserOrg" />
          <el-option label="表单字段" value="formField" />
          <el-option
            v-if="info.variableOption.length > 0"
            label="流程变量"
            value="flowVariable"
          />
        </el-select>
        <bo-tree-select
          v-if="info.data.busKeySource === 'formField'"
          v-model="info.data.formFieldPath"
          data-type="boList"
          :field-desc="info.data.formFieldPathDesc"
          placeholder="请选择表单字段"
          style="margin-top: 10px"
          @bo-call-back="boCallBackFn"
        />
        <el-select
          v-if="info.data.busKeySource === 'flowVariable'"
          v-model="info.data.flowVariableKey"
          placeholder="请选择流程变量"
          style="margin-left: 10px"
        >
          <el-option
            v-for="(variable, index) in info.variableOption"
            :key="index"
            :label="variable.label"
            :value="variable.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="对象"
        prop="reportName"
        :rules="[{ required: true, message: '角色必填' }]"
      >
        <el-select v-model="info.data.reportName" placeholder="请选择角色">
          <el-option
            v-for="(name, index) in info.reportNameOption"
            :key="index"
            :label="name"
            :value="name"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button text type="default" @click="info.dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="ok(formRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { bpmApi } from '~/agilebpm/api'
  import { ElMessage, FormInstance, ElTree } from 'element-plus'
  import BoTreeSelect from './boTreeSelect.vue'

  const props = defineProps({
    modelValue: { required: true, type: Object },
  })

  const formRef = ref<FormInstance>()
  const treeRef = ref<InstanceType<typeof ElTree>>()
  const scriptVariables = inject('scriptVariables') as any

  const emit = defineEmits(['update:modelValue'])

  const info: any = reactive({
    dialogVisible: false,
    data: {
      matrixId: '',
      matrixName: '',
      busKeySource: '',
      reportName: '',
      formFieldPath: '',
      formFieldPathDesc: '',
      flowVariableKey: '',
      description: '',
    },
    variableOption: [],
    reportNameOption: [],
  })

  const boCallBackFn = (item: any) => {
    if (item?.formFieldPath) {
      info.data.formFieldPath = item.formFieldPath
    }
    if (item?.formFieldPathDesc) {
      info.data.formFieldPathDesc = item.formFieldPathDesc
    }
  }

  const open = () => {
    if (props.modelValue) {
      info.data = props.modelValue
    }
    info.dialogVisible = true
  }

  const choseMatrix = async (list: any) => {
    if (!list || list.length === 0) {
      return
    }
    const choseMatrix = list[0]
    info.data.reportName = ''
    //请求matrixInfo 获取汇报线设置
    await bpmApi.bpmPluginMatrix
      .getMatrixInfo(choseMatrix.id)
      .then((result: any) => {
        if (result.isOk && result.data) {
          info.reportNameOption = result.data.reportLine
        }
      })
  }

  const inintVariableScope = () => {
    //只取variableScope 中的变量
    const variableScope = scriptVariables.find((item: any) => {
      return item.value === 'variableScope'
    })
    if (
      variableScope &&
      variableScope.children &&
      variableScope.children.length > 0
    ) {
      variableScope.children.forEach((variable: any) => {
        info.variableOption.push(variable)
      })
    }
  }

  onMounted(() => {
    if (props.modelValue) {
      info.data = props.modelValue
      if (info.data.matrixId) {
        bpmApi.bpmPluginMatrix
          .getMatrixInfo(info.data.matrixId)
          .then((result: any) => {
            if (result.isOk && result.data) {
              info.reportNameOption = result.data.reportLine
            }
          })
      }
    }

    inintVariableScope()
  })

  const ok = async (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return
    }
    await formEl.validate((valid, fields) => {
      if (valid) {
        if (
          info.data.busKeySource === 'formField' &&
          !info.data.formFieldPathDesc
        ) {
          ElMessage({
            showClose: true,
            message: '请选择一个表单字段',
            type: 'warning',
          })
          return
        }
        info.data.description = `${info.data.matrixName}【${info.data.reportName}】`

        info.dialogVisible = false
        emit('update:modelValue', info.data)
      } else {
        ElMessage({
          message: '请完善表单！',
          type: 'warning',
        })
      }
    })
  }
</script>

<style scoped lang="scss">
  .font-style {
    font-size: small;
    color: #2db7f5;
  }
</style>
