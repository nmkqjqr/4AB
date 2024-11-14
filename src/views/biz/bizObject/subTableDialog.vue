<template>
  <el-button v-bind="$attrs" @click="open"><slot></slot></el-button>
  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    destroy-on-close
    title="子表权限"
    width="400"
  >
    <el-form
      ref="formRef"
      label-suffix="："
      label-width="150px"
      :model="info.data"
    >
      <el-form-item label="类型" prop="type">
        <ab-enum-selector
          v-model="info.data.type"
          path="com.dstz.biz.api.constant.SubTableSetType"
        />
      </el-form-item>
      <el-form-item
        v-if="info.data.type != 'all'"
        :label="info.descMap[info.data.type]"
        prop="column"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-select v-model="info.data.column">
          <el-option
            v-for="item in rel.table.columnsWithoutPrimary"
            :key="item.code"
            :label="`${item.comment}（${item.code}）`"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-space wrap>
          <el-button text type="primary" @click="info.dialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="ok">确定</el-button>
        </el-space>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { reactive } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
    rel: { required: true, type: Object },
  })

  const { proxy } = abTools.useCurrentInstance()
  const info: any = reactive({
    dialogVisible: false,
    data: {
      type: 'all',
      column: '',
    },
    types: [
      {
        key: 'user',
        val: '本人可见',
      },
      {
        key: 'org',
        val: '本部门可见',
      },
      {
        key: 'inst',
        val: '多实例下-本实例可见',
      },
    ],
    descMap: {
      user: '本人用户ID字段',
      org: '本部门ID字段',
      inst: '多实例traceId字段',
    },
  })
  const formRef = ref<FormInstance>()
  const emit = defineEmits(['update:modelValue'])

  onMounted(() => {
    console.info(props)
  })

  const open = () => {
    info.dialogVisible = true
    info.data = abUtil.clone(props.modelValue)
  }

  const ok = () => {
    if (!formRef.value) return
    formRef.value.validate((valid) => {
      if (valid) {
        info.dialogVisible = false
        emit('update:modelValue', info.data)
      }
    })
  }
</script>
