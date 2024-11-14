<template>
  <div style="padding: 30px; margin: 10, auto">
    <el-collapse v-model="pageData.activeNames" @change="handleChange">
      <el-collapse-item name="1" class="setting">
        <template #title><span class="title">流程中心权限</span></template>
        <div class="content">
          <el-button
            type="primary"
            @click="
              () => {
                pageData.showAuthoDialog = true
              }
            "
          >
            授权
          </el-button>
          <ab-authorization
            v-model="pageData.showAuthoDialog"
            authorization-type="FLOW"
            :rights-code="props.defKey"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" class="setting">
        <template #title><span class="title">版本管理</span></template>
        11111111111{{ props.defKey }}
        <div class="content" v-if="props.defKey">
          <flow-version :def-key="props.defKey" />
        </div>
      </el-collapse-item>
      <el-collapse-item name="3" class="setting">
        <template #title><span class="title">流程测试</span></template>
        <div class="content">
          Simplify the process: keep operating process simple and intuitive;
        </div>
      </el-collapse-item>
      <el-collapse-item name="4" class="setting">
        <template #title><span class="title">流程公开分享</span></template>
        <div class="content">
          Decision making: giving advices about operations is acceptable, but do
          not make decisions for the users;
        </div>
      </el-collapse-item>
      <el-collapse-item name="5" class="setting">
        <template #title><span class="title">流程代理</span></template>
        <div class="content">
          Decision making: giving advices about operations is acceptable, but do
          not make decisions for the users;
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
  import { bpmDefinitionListUrl } from '/@/agilebpm/api/modules/ab-bpm/bpm-definition'
  import { bpmApi, abTools } from '~/agilebpm'
  import flowVersion from './flowVersion.vue'
  const props = defineProps({
    defKey: { type: String, required: true },
    defId: { type: String, required: true },
  })

  const pageData = reactive({
    activeNames: '1',
    showAuthoDialog: false,
  })
  const handleChange = (val: string[]) => {
    console.log(val)
  }
</script>

<style lang="scss" scoped>
  .setting {
    .title {
      padding: 30px;
    }
    .content {
      padding: 30px;
    }
  }
</style>
