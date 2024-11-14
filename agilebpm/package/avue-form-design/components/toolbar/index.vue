<template>
  <el-header class="toolbar">
    <div
      style="display: flex; align-items: center"
      v-if="!isWf && !isAppsquareForm"
    >
      <el-button type="text" :loading="loading" @click="$emit('createForm')">
        保存并生成表单
      </el-button>
      <el-button type="text" :loading="loading" @click="$emit('save')">
        保存
      </el-button>
      <el-button type="text" v-if="data.pcFormCode" @click="previewPc">
        预览PC端
      </el-button>
      <el-button type="text" v-if="data.pcFormCode" @click="codePc">
        PC端源码
      </el-button>
      <!-- <el-button type="text" v-if="data.mbFormCode" @click="previewMb">
        预览移动端
      </el-button> -->
      <el-button
        type="text"
        v-if="data.mbFormCode && data.formMode != 'pc'"
        @click="codeMb"
      >
        移动端源码
      </el-button>
      <el-button type="text" @click="close">关闭</el-button>
    </div>
    <div></div>
    <div style="display: flex; align-items: center">
      <!-- <el-button type="text"  @click="$emit('generate')">
        查看JSON
      </el-button> -->
      <el-button class="danger" type="text" @click="$emit('clear')">
        清空表单
      </el-button>
    </div>
  </el-header>
</template>

<script setup>
  // Icon
  import {
    Document,
    Upload,
    Download,
    Delete,
    Back,
  } from '@element-plus/icons-vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { sysApi } from '@agilebpm/api'
  import { tokenTableName } from '@/config'
  import { getToken } from '@/utils/token'
  // Props
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
    isWf: {
      type: Boolean,
      default: false,
    },
    isAppsquareForm: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })

  const info = reactive({
    mobileUrl: '',
    proxy: null,
  })

  onMounted(() => {
    getMobileUrl()
    const { proxy } = abTools.useCurrentInstance()
    info.proxy = proxy
  })

  defineEmits(['generate', 'clear', 'createForm', 'save', 'previewPc'])

  const close = () => {
    try {
      if (window.opener && window.opener.abTableSearch) {
        window.opener.abTableSearch()
      }
    } finally {
      window.close()
    }
  }

  const previewPc = () => {
    window.open(
      abTools.getResolveUrl(
        '/bizForm/preview/' + props.data.pcFormCode,
        info.proxy
      )
    )
  }

  const codePc = () => {
    window.open(
      abTools.getResolveUrl(
        '/bizFormCode?code=' + props.data.pcFormCode,
        info.proxy
      )
    )
  }

  const previewMb = () => {
    const token = getToken()
    window.open(
      abTools.getResolveUrl(
        `${info.mobileUrl}/biz/form/preview?code=${props.data.mbFormCode}&${tokenTableName}=${token}`,
        info.proxy
      )
    )
  }

  const codeMb = () => {
    window.open(
      abTools.getResolveUrl(
        '/bizFormCode?type=mb&code=' + props.data.mbFormCode,
        info.proxy
      )
    )
  }

  const getMobileUrl = async () => {
    info.mobileUrl = await sysApi.property.getMobileUrl()
  }
</script>

<style lang="scss" scoped>
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 45px !important;
    border-right: 1px solid #e0e0e0;
    border-bottom: solid 2px #e4e7ed;
    border-left: 1px solid #e0e0e0;
  }
</style>
