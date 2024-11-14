<template>
  <el-button v-bind="$attrs" @click="openDialog">
    <slot></slot>
  </el-button>

  <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    destroy-on-close
    :title="info.dialogTitle"
    width="60%"
  >
    <cust-form
      v-if="info.formData.html"
      ref="formRef"
      :form-data="info.formData"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-space wrap>
          <el-button text type="primary" @click="info.dialogVisible = false">
            取消
          </el-button>
          <el-button v-if="!isReadOnly" type="primary" @click="dialogOk">
            保存
          </el-button>
        </el-space>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref, onMounted, inject } from 'vue'
  import {
    abForm as custForm,
    bizApi,
    abTools,
    postData,
    abUtil,
  } from '~/agilebpm'
  const props = defineProps({
    /**
     * 表单编码
     */
    formCode: {
      type: String,
      required: true,
    },
    /**
     * 是否只读
     */
    isReadOnly: {
      type: Boolean,
      default: false,
    },
    /**
     * 拓展的数据
     */
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    pk: {
      type: String,
      default: '',
    },
  })
  const info = reactive({
    dialogVisible: false,
    dialogTitle: '',
    formData: {} as CustFormData,
  })

  onMounted(() => {})

  const openDialog = () => {
    info.dialogVisible = true

    //每次打开
    bizApi.bizForm
      .getFormData(`${props.formCode}_pc`, props.pk, props.isReadOnly)
      .then(({ data }) => {
        const form = data.bizForm
        info.dialogTitle = form.name
        abUtil.easyClone(props.data, data.data[data.bizForm.boCode])
        const formData = {
          html: form.html,
          js: form.js,
          data: data.data,
          tablePermission: data.tablePermission,
          permission: data.permission,
          initData: data.initData,
          boLoadMap: data.boLoadMap,
        }
        info.formData = formData
      })
  }

  const formRef = ref()
  const dialogOk = () => {
    formRef.value.getData(true).then((formJson: any) => {
      if (formJson !== false) {
        bizApi.bizForm
          .saveFormData(`${props.formCode}_pc`, info.formData.data)
          .then(({ data }) => {
            ElMessage({
              type: 'success',
              message: '保存成功',
            })
            info.dialogVisible = false
          })
      }
    })
  }
</script>
