<template>
  <el-button type="primary" @click="open">
    {{ $abT('bpm.office.configurePersion', ' 配置') }}
  </el-button>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    draggable
    :title="$abT('bpm.office.ButtonConfiguration', '按钮配置')"
    top="5vh"
    width="600px"
  >
    <el-form
      ref="formRef"
      :inline="true"
      label-suffix="："
      label-width="120px"
      :model="info.data"
    >
      <el-table border :data="info.data" style="width: 100%">
        <el-table-column
          :label="$abT('page.common.status', '状态')"
          width="100"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.open"
              :active-text="$abT('page.common.display', '显示')"
              :active-value="true"
              :inactive-text="$abT('page.common.hide', '隐藏')"
              :inactive-value="false"
              inline-prompt
            />
          </template>
        </el-table-column>
        <el-table-column label="别名" prop="key" width="120" />
        <el-table-column label="名称">
          <template #default="scope">
            <el-form-item
              :prop="`${scope.$index}.name`"
              :rules="[
                { max: 50, message: '最多可输入10个字符' },
                { required: true, message: '必填' },
              ]"
            >
              <el-input v-model="scope.row.name" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            脚本
            <el-tooltip placement="top">
              <template #content>
                可使用HandleButtonDTO参数，返回-1默认不追加、0追加到后面、1追加到第一位，Ps：还支持返回1、2、3这样进行更细致的排序
              </template>
              <el-icon :size="20"><Warning /></el-icon>
            </el-tooltip>
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.script" />
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="info.dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { Plus, Delete, Warning } from '@element-plus/icons-vue'
  import { abStoreAdaptor } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { abT } from '@/i18n'

  const props = defineProps({
    modelValue: {
      required: true,
      type: Array,
      default: () => {
        return [
          {
            key: 'signAgree',
            name: '会签同意',
            script: '',
            open: true,
          },
          {
            key: 'signOppose',
            name: '会签反对',
            script: '',
            open: true,
          },
          {
            key: 'signWaive',
            name: '会签弃权',
            script: '',
            open: true,
          },
        ]
      },
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const info: any = reactive({
    data: [],
    dialogVisible: false,
  })

  onMounted(() => {
    info.data = abUtil.clone(props.modelValue)
  })

  const open = () => {
    info.dialogVisible = true
    info.data = abUtil.clone(props.modelValue)
  }

  const formRef = ref()
  const ok = () => {
    if (!formRef) return

    formRef.value.validate((valid: any) => {
      if (valid) {
        info.dialogVisible = false
        emit('update:modelValue', info.data)
      } else {
        ElMessage({
          message: abT('page.common.completeForm', '请完善表单！'),
          type: 'warning',
        })
      }
    })
  }
</script>
