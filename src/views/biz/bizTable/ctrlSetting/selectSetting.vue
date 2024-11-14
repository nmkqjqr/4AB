<template>
  <el-button type="primary" @click="open">配置</el-button>
  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    title="选项配置"
    width="600px"
  >
    <el-form ref="formRef" :inline="true" :model="info" :status-icon="false">
      <el-table
        border
        :data="info.options"
        empty-text="请添加选项"
        style="width: 100%"
      >
        <el-table-column label="描述" width="200">
          <template #default="scope">
            <el-form-item
              :prop="`options.${scope.$index}.desc`"
              :rules="[
                { max: 50, message: '最多可输入50个字符' },
                { required: true, message: '必填' },
              ]"
            >
              <ab-pinyin
                v-model="scope.row.desc"
                v-model:to="scope.row.code"
                placeholder="请输入描述"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="值" width="200">
          <template #default="scope">
            <el-form-item
              :prop="`options.${scope.$index}.code`"
              :rules="[
                { max: 50, message: '最多可输入50个字符' },
                { required: true, message: '必填' },
              ]"
            >
              <el-input v-model="scope.row.code" placeholder="请输入值" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template #header>
            <el-button
              :icon="Plus"
              type="success"
              @click="info.options.push({})"
            />
          </template>
          <template #default="scope">
            <el-button
              v-if="scope.$index != 0"
              circle
              :icon="ArrowUpBold"
              type="primary"
              @click="abUtil.Arrays.up(scope.$index, info.options)"
            />
            <el-button
              v-if="scope.$index != info.options.length - 1"
              circle
              :icon="ArrowDownBold"
              type="primary"
              @click="abUtil.Arrays.down(scope.$index, info.options)"
            />
            <el-button
              circle
              :icon="Delete"
              type="danger"
              @click="abUtil.Arrays.del(scope.$index, info.options)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="ok">确定</el-button>
        <el-button text type="primary" @click="info.dialogVisible = false">
          取消
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { bizApi, abUtil } from '~/agilebpm'
  import { ElMessage } from 'element-plus'
  import {
    ArrowUpBold,
    Plus,
    ArrowDownBold,
    Delete,
  } from '@element-plus/icons-vue'

  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
  })

  //页面用到的双向绑定的信息
  const formRef = ref<FormInstance>()
  const info: any = reactive({
    dialogVisible: false,
    options: [],
    BizValidatorMap: null,
  })

  const initBizValidatorMap = async () => {
    info.BizValidatorMap = await bizApi.bizPattern.getAllBizValidator()
    console.info(info.BizValidatorMap)
  }
  initBizValidatorMap()

  const emit = defineEmits(['update:modelValue'])

  const ok = () => {
    if (info.options.length == 0) {
      ElMessage({
        showClose: true,
        message: '请至少配置一项',
        type: 'warning',
      })
      return
    }

    if (!formRef.value) return
    formRef.value.validate((valid) => {
      if (valid) {
        info.dialogVisible = false
        const ctrl = abUtil.clone(props.modelValue)
        ctrl.configJson.options = info.options
        emit('update:modelValue', ctrl)
      }
    })
  }

  const open = () => {
    info.dialogVisible = true
    info.options = abUtil.clone(props.modelValue.configJson.options || [])
  }
</script>
