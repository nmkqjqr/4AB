<template>
  <el-dialog
    v-model="data.dialogVisible"
    :append-to-body="true"
    :destroy-on-close="true"
    :title="$abT('page.wfDesign.copeWF','复制{a}',{a:'【'+flowName+'】'})"
    @before-close="dialogClose('')"
  >
    <el-form
      ref="formRef"
      label-suffix="："
      label-width="150px"
      :model="data.duplicateDTO"
      :status-icon="false"
    >
      <el-form-item
        :label="$abT('page.common.classification','分类')"
        prop="newTypeCode"
        :rules="[{ required: true, message: $abT('page.validate.required','必填') }]"
      >
        <ab-select-tree
          v-model="data.duplicateDTO.newTypeCode"
          type-code="flowType"
          width="100%"
        />
      </el-form-item>
      <el-form-item
        :label="$abT('page.wfDesign.wfName','流程名称')"
        prop="newName"
        :rules="[
          { required: true, message: $abT('page.validate.required','必填') },
          { max: 50, message:  $abT('rules.max','最多可输入{a}个字符',{a:50})  },
        ]"
      >
        <ab-pinyin
          v-model="data.duplicateDTO.newName"
          v-model:to="data.duplicateDTO.newKey"
        />
      </el-form-item>
      <el-form-item
        :label="$abT('page.wfDesign.wfCode','流程编码')"
        prop="newKey"
        :rules="[
          { required: true, message: $abT('page.validate.required','必填') },
          { max: 50, message:  $abT('rules.max','最多可输入{a}个字符',{a:50})  },
          {
            pattern: /^[a-zA-Z]\w*$/,
            message: $abT('rules.varirule','只能以字母开头,允许字母、数字和下划线'),
          },
        ]"
      >
        <el-input v-model="data.duplicateDTO.newKey" />
      </el-form-item>
      <el-form-item
        :label="$abT('page.common.desc','描述')"
        prop="newName"
        :rules="[
          { required: true, message: $abT('page.validate.required','必填')  },
          { max: 500, message: $abT('rules.max','最多可输入{a}个字符',{a:500}) },
        ]"
      >
        <el-input v-model="data.duplicateDTO.newDesc" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button text @click="dialogClose('')">{{ $abT('page.common.cancel','取消') }}</el-button>
        <el-button type="primary" @click="dialogOk()">{{ $abT('page.common.ok','确定') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import type { FormInstance } from 'element-plus'
  import { bpmApi } from '~/agilebpm'
  import { ElLoading } from 'element-plus'

  const props = defineProps({
    visible: { required: true, type: Boolean },
    flowName: { required: true, type: String },
    flowKey: { required: true, type: String },
    typeCode: { required: true, type: String },
  })

  const { flowName } = toRefs(props)

  const emit = defineEmits(['close'])

  const formRef = ref<FormInstance>()
  const data = reactive({
    dialogVisible: false,
    duplicateDTO: {
      newKey: '',
      newName: '',
      newTypeCode: '',
      newDesc: '',
    },
    newDefId: '',
  })

  watch(
    () => props.visible,
    (newValue) => {
      // 清理数据
      data.newDefId = ''
      Object.keys(data.duplicateDTO).forEach((k) => (data.duplicateDTO[k] = ''))
      if (newValue) {
        data.dialogVisible = true
        data.duplicateDTO.newTypeCode = props.typeCode
      }
    }
  )

  watch(
    () => data.dialogVisible,
    (newValue) => {
      if (!newValue) {
        emit('close', data.newDefId)
      }
    }
  )

  const dialogClose = (newDefId: string) => {
    data.dialogVisible = false
  }

  const dialogOk = async () => {
    const valid = await formRef.value?.validate()
    if (!valid) return

    const loadingInstance = ElLoading.service({ target: '.el-dialog' })

    bpmApi.bpmDefinition
      .bpmDuplicate({
        originKey: props.flowKey,
        ...data.duplicateDTO,
      })
      .then((resp) => {
        if (resp.isOk) {
          // 复制成功将流程定义ID传给ok事件
          data.newDefId = resp.data
          data.dialogVisible = false
        }
      })
      .finally(() => loadingInstance.close())
  }
</script>
