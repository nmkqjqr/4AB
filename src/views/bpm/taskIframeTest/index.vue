<template>
  <div class="comprehensive-table-container" style="height:100%;background:#fff;">
    <div style="width: 70%;margin:15px auto;">
       <el-button type="primary" :icon="ArrowLeft" @click="leftFn"/>
       <el-button type="primary" :icon="ArrowRight" @click="rightFn"/>
       <el-button type="primary" :icon="ArrowUp" @click="upFn"/>
       <el-button type="primary" :icon="ArrowDown" @click="downFn"/>
       <el-button type="primary" @click="enlarge">放大</el-button>
       <el-button type="primary" @click="ensmall">缩小</el-button>
    </div>
    <div style="width: 70%; height: 90%;margin:30px auto;">
      <iframe
        v-if="info.iframeSrc && info.iframeSrc.length > 0"
        frameborder="no"
        :src="info.iframeSrc"
        class="iframe"
        ref="appIframe"
      ></iframe>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ArrowLeft, ArrowRight ,ArrowUp,ArrowDown} from '@element-plus/icons-vue'
  import { request, sysApi, abTools, getData } from '~/agilebpm'
  const { proxy } = abTools.useCurrentInstance()
  const info: any = reactive({
    iframeSrc: 'http://localhost:8086/bpm/bpm/taskComplate?id=1780131361349689344&backR=BpmTaskList&abIframeType=iframe',
  })

  const appIframe = ref()

  const enlarge = () => {
    appIframe.value.contentWindow.postMessage( { type: 'changeEnlargeScale',scale:0.2 }, info.iframeSrc);
  }
  const ensmall = () => {
    appIframe.value.contentWindow.postMessage( { type: 'changeEnsmallScale',scale:0.2 }, info.iframeSrc);
  }
  const rightFn = () => {
    appIframe.value.contentWindow.postMessage( { type: 'rightFn',diatance:-50 }, info.iframeSrc);
  }
  const leftFn = () => {
    appIframe.value.contentWindow.postMessage( { type: 'leftFn',diatance:50 }, info.iframeSrc);
  }
  const upFn = () => {
    appIframe.value.contentWindow.postMessage( { type: 'upFn',diatance:50 }, info.iframeSrc);
  }
  const downFn = () => {
    appIframe.value.contentWindow.postMessage( { type: 'downFn',diatance:-50 }, info.iframeSrc);
  }

  
</script>
<style lang="scss" scoped>
  .iframe{
    width:100%;
    height:100%;
  }
</style>
