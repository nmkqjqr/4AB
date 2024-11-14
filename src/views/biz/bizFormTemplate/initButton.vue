<template>
  <el-button
    v-ab-btn-rights:bizFormTemplate_init
    class="mybutton"
    :loading="loading"
    type="warning"
    @click="initTemplate()"
  >
    初始化模版
  </el-button>
</template>

<script lang="ts" setup>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { request, bizApi } from '~/agilebpm'
  const loading = ref(false)
  const props = defineProps({ search: { type: Function, default: () => {} } })
  const emit = defineEmits(['initTemplate'])
  const initTemplate = () => {
    loading.value = true
    ElMessageBox.confirm('您确定要初始化么?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        request({
          url: bizApi.formTemplate.bizFormTemplateInitTemplate,
          method: 'get',
        }).then((result: any) => {
          emit('initTemplate', props.search)
          console.log(result)
          ElMessage({
            type: 'success',
            message: '初始化成功',
          })
          loading.value = false
        })
      })
      .catch(() => (loading.value = false))
  }
</script>
