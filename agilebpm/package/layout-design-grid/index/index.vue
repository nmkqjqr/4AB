<template>
  <!-- custom-class="ab-dialog-message-to" -->
  <!-- z-index="2000" -->
  <el-dialog
    v-if="state.formCombination.designJson"
    class="ab-dialog dialog_body_nopadding dialog_no_header"
    :class="{ isAppSquareLayout: state.isAppSquare }"
    fullscreen
    :model-value="modelValue"
  >
    <div v-if="state.isAppSquare" class="header">
      <h5>未命名组联式表单</h5>
      <div>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$emit('close', true)">返回</el-button>
      </div>
    </div>
    <div :key="key" class="designer_main">
      <div class="container">
        <leftDragable
          :design-json="state.formCombination.designJson"
          @add-end="andEndEmit"
        />
        <centerMain
          :active-col="state.activeCol"
          :active-id="state.activeId"
          :design-json="state.formCombination.designJson"
          :form-conf="state.formConf"
          :is-app-square="state.isAppSquare"
          :preview-dialog="state.previewDialog"
          @active-item="activeItem"
          @back="$emit('close', true)"
          @clear-all="clearAll"
          @save="save"
          @view-preview="viewPreview"
        />
        <rightConfig
          :active-col="state.activeCol"
          :active-id="state.activeId"
          :form-combination="state.formCombination"
          :form-conf="state.formConf"
        />
      </div>
      <el-dialog
        v-model="state.previewDialog"
        class="themeViewClass"
        title="预览"
        width="80%"
      >
        <preview
          v-if="state.previewDialog"
          :design-code="state.formCombination.code"
          :design-json="state.formCombination.designJson"
          :params="state.data.varibales"
        />
      </el-dialog>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
  import { onMounted, provide, reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import preview from './preview.vue'
  import leftDragable from './leftDragable.vue'
  import centerMain from './centerMain.vue'
  import rightConfig from './rightConfig.vue'
  import { formCombinationDefaultJson } from '../config/index'
  import { deepClone } from '../utils/index'
  import { bizApi, postData } from '@agilebpm/api'
  import { saveResourceDataUrl } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-resource'
  import { checkIsPublicProject } from '~/agilebpm/utils/ab-util'
  import { abTools } from '~/agilebpm'

  const { proxy } = abTools.useCurrentInstance()

  checkIsPublicProject()

  const state = reactive({
    activeId: '',
    activeCol: '',
    formConf: {} as FormCombinationComponent,
    previewDialog: false,
    formCombination: {} as FormCombination,
    data: {},
    isAppSquare: proxy.$route.name == 'CreateLayout' ? true : false,
  })
  const contentRef = ref()
  const props = defineProps({
    modelValue: { required: true, type: Boolean },
    id: { required: false, type: String, default: '' },
  })
  const emits = defineEmits(['close'])

  const activeItem = (element: any) => {
    state.activeId = element.key || ''
    if (element.key) {
      state.formConf = element
    }
  }
  const activeColClick = (col: any) => {
    state.activeCol = col.key || ''
  }
  const resetControl = () => {
    state.formConf = { type: '', label: '' }
  }
  const removeItem = (element: any) => {
    state.formCombination.designJson.list =
      state.formCombination.designJson.list.filter(
        (item: any) => item.key !== element.formId
      )
    state.formConf = { type: '', label: '' }
  }

  provide('activeItem', activeItem)
  provide('removeItem', removeItem)
  provide('activeColClick', activeColClick)
  provide('resetControl', resetControl)
  const andEndEmit = (data: FormCombinationComponent, type: number) => {
    debugger
    if (type == 1) {
      state.formCombination.designJson.list.push(data)
    } else {
      if (!state.activeId) {
        ElMessage({
          message: '当前没有选中项',
          type: 'warning',
          customClass: 'customMsgCls',
        })
        return
      }
      if (!state.formConf.islayout) {
        ElMessage({
          message: '当前选中项不是布局组件不可添加',
          type: 'warning',
          customClass: 'customMsgCls',
        })
        return
      }
      if (state.formConf.type == 'card') {
        state.formConf.list.push(data)
      }
      if (state.formConf.type == 'tabs') {
        state.formConf.columns[state.formConf.default].list.push(data)
      }
    }
  }

  const clearAll = () => {
    state.formCombination.designJson.list = []
    state.formConf = { type: '', label: '' }
  }

  const viewPreview = () => {
    state.previewDialog = true
    // state.formCombination.designJson.list.forEach((element: any) => {
    //   element.relaod && element.relaod()
    // })
  }
  onMounted(async () => {
    const id = props.id || '' //|| this.$route.query.id || ''
    if (!id) {
      state.formCombination = deepClone(formCombinationDefaultJson)
    } else {
      getData(id)
    }
  })

  const loadData = (code: any) => {
    if (code) {
      bizApi.formCombination
        .getDesignJson(code, { code: code })
        .then((result: any) => {
          state.data = result.data
        })
    }
  }

  // 获取数据
  const key = ref(111)
  const getData = (id: string) => {
    bizApi.formCombination.getDesign(id).then((res: any) => {
      key.value++
      state.formCombination = res.data
      loadData(state.formCombination.code)
    })
  }

  // 保存后重新加载下后台数据，rev 以及id
  const save = () => {
    if (proxy.$route.name !== 'CreateLayout') {
      if (
        !state.formCombination.code ||
        !state.formCombination.name ||
        state.formCombination.code.length > 50 ||
        !state.formCombination.typeCode
      ) {
        ElMessage({
          message: '请完善表单！',
          type: 'warning',
          customClass: 'customMsgCls',
        })
        state.activeId = ''
        return
      }
      // 解决甘特图导出时的问题
      state.formCombination.designJson.list.forEach((item) => {
        if (item.type == 'AbGanttChartConfig') {
          item.control.custData = []
        }
      })
      bizApi.formCombination
        .saveDesignJson(state.formCombination)
        .then((res: any) => {
          getData(res.data)
          ElMessage({
            message: '保存成功！',
            type: 'success',
            customClass: 'customMsgCls',
          })
          state.activeId = ''
          state.formConf.key = null
        })
    }
    if (proxy.$route.name == 'CreateLayout') {
      const paramsData = {
        projectId: proxy.$route.params.projectId,
        resourceType: proxy.$route.params.resourceType,
        resourceId: proxy.$route.params.resourceId,
        data: state.formCombination,
      }
      postData(saveResourceDataUrl, paramsData)
        .then((result: any) => {
          ElMessage({
            message: '保存成功！',
            type: 'success',
            customClass: 'customMsgCls',
          })
          proxy.$router.replace({
            params: {
              ...proxy.$route.params,
              ...{ formDesignId: result.data },
            },
          })
        })
        .catch((res: any) => {})
    }
  }

  const getFlatComponentList = () => {
    const array: FormCombinationComponent[] = []
    state.formCombination.designJson.list.forEach((item) => {
      if (item.columns) {
        setChildList(item.columns, array)
      } else {
        array.push(item)
      }
    })
    return array
  }
  provide('getFlatComponentList', getFlatComponentList)

  const setChildList = (columns: any, array: any) => {
    columns.forEach((item: any) => {
      if (!item.list) return
      item.list.forEach((element: any) => {
        if (element.columns) {
          setChildList(element.columns, array)
        } else {
          array.push(element)
        }
      })
    })
  }
</script>
<style lang="scss" scoped>
  @import '../styles/index.scss';
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    h5 {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
    }
  }
</style>
<style lang="scss">
  .customMsgCls {
    z-index: 20010 !important;
  }
  .isAppSquareLayout {
    padding-top: 0px;
    .el-dialog__body {
      height: calc(100% - 60px) !important;
    }
  }
</style>
