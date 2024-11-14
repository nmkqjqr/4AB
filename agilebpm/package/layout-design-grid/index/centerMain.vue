<template>
  <div class="center_side">
    <div class="top_action" :class="{isAppSquare:props.isAppSquare}">
      <el-button type="primary" @click="emits('save')" v-if="!props.isAppSquare">保存</el-button>
      <el-button @click="emits('back')" v-if="!props.isAppSquare">返回</el-button>
      <el-button :icon="View" text @click="viewPreview">预览</el-button>
      <el-button :icon="Delete" text @click="resetAll">清空</el-button>
    </div>
    <div ref="designerRef" style="width: 100%; height: calc(100% - 50px)">
      <el-scrollbar
        id="designerID"
        class="center_designer"
        style="height: 100%"
        @click="globalClick"
      >
        <el-row class="center_designer_row">
          <groupContainer
            :active-col="props.activeCol"
            :active-id="props.activeId"
            :design-json="designJson"
            :form-conf="formConf"
            :list="designJson.list"
            :page-height="pageHeight"
          />
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { View, Delete } from '@element-plus/icons-vue'
  import { reactive, defineEmits, defineProps, PropType, ref } from 'vue'
  import groupContainer from './groupContainer.vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { bizApi } from '@agilebpm/api'
  const { proxy } = getCurrentInstance()

  const props = defineProps({
    designJson: {
      required: true,
      type: Object as PropType<DesignJson>,
    },
    activeId: String,
    activeCol: String,
    formConf: Object,
    previewDialog: Boolean,
    isAppSquare: Boolean,
  })
  const { formConf, designJson } = toRefs(props)
  const emits = defineEmits([
    'clearAll',
    'activeItem',
    'viewPreview',
    'save',
    'back',
  ])
  const designerRef = ref(null)
  const pageHeight = ref(0)

  const draggableAdd = (evt: any) => {
    // 获取当前索引
    const newIndex = evt.newIndex
    const key = new Date().getTime().toString()
    const obj: any = designJson.value.list[newIndex] || undefined
    if (!obj) {
      return
    }
    designJson.value.list[newIndex].formId = obj.type + key
    groupClick(obj)
  }

  const globalClick = () => {
    emits('activeItem', { key: '' })
  }

  const groupClick = (element: object) => {
    emits('activeItem', element)
  }
  // 清空
  const resetAll = () => {
    emits('clearAll')
  }
  // 预览
  const viewPreview = () => {
    emits('viewPreview')
  }

  watch(
    () => props.previewDialog,
    (value) => {
      globalParams['isPreview'] = value
    }
  )

  // const globalParams = reactive({ isDesign: true })
  const globalParams = reactive({})

  provide('globalParams', globalParams)
  provide('designJson', designJson)

  onMounted(() => {
    //doFrashGlobalParam()
    nextTick(() => {
      pageHeight.value = designerRef.value.offsetHeight
    })
  })

  let isLoding = false
  const doFrashGlobalParam = () => {
    // 加载中则等待并重试
    if (isLoding) {
      window.setTimeout(() => {
        doFrashGlobalParam()
      }, 30000)
      return
    }
    if (designJson.value.params.length == 0) return

    isLoding = true
    // 执行更新动作
    bizApi.formCombination
      .doFrashGlobalParam(designJson.designCode, designJson.value.params)
      .then((result) => {
        // 先清除
        for (const prop in globalParams) {
          if (prop != 'isDesign') delete globalParams[prop]
        }
        // 赋值返回值
        abUtil.easyClone(result.data, globalParams)
        // 其次取url地址上的值
        for (const key in proxy.$route.query) {
          globalParams[key] = proxy.$route.query[key]
        }
        for (const key in proxy.$route.params) {
          globalParams[key] = proxy.$route.params[key]
        }

        isLoding = false
      })
  }

  watch(
    () => designJson.value.params,
    (newVal) => {
      if (newVal && newVal.length > 0) {
        doFrashGlobalParam()
      }
    },
    { deep: true, immediate: true }
  )
</script>
<style lang="scss">
  @import '../styles/index.scss';
</style>
<style lang="scss" scoped>
  .isAppSquare{
    display: flex;
    justify-content:flex-end;
  }
</style>

