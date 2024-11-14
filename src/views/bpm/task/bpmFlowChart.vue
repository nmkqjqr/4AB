<template>
  <div class="comprehensive-table-container" style="height:100vh;background:#fff;" v-loading="info.loading">
    <bpm-image-block v-if="info.imageInfoLoaded" :image-info="info.imageInfo"/>
    <el-empty description="加载失败" v-if="!info.isParams"/>
  </div>
</template>
<script lang="ts" setup>
  import { abTools,bpmApi,BpmImageBlock } from '~/agilebpm'
  const { proxy } = abTools.useCurrentInstance()

  const info = reactive({
    imageInfo: {},
    imageInfoLoaded: false,
    isParams:true,
    loading:true
  })

  const imageParam = () => {
    let param = {} as any
    if(proxy.$route.query.instId){
      param.instanceId = proxy.$route.query.instId
    }
    if(proxy.$route.query.taskId){
      param.taskId = proxy.$route.query.taskId
    }
    const type = proxy.$route.query.type
    if (!type) {
      return param
    }
    if (type == 'opId') {
      param.opId = proxy.$route.query.taskId
    } else if (type == 'taskId') {
      param.taskId = proxy.$route.query.taskId
    }
    return param
  }

  const initialImageInfo = () => {
    bpmApi.instance.getFlowImagInfo(imageParam()).then((res) => {
      if(res.isOk){
        info.imageInfo = res.data
        info.imageInfoLoaded = true
      }else{
        info.isParams = false
      }
      info.loading = false
    }).catch(() => {
      info.loading = false
      info.isParams = false
    })
  }

  onMounted(() => initialImageInfo())
</script>
<style lang="scss" scoped>
</style>