<template>
  <div v-if="bizLogicProgram.designJson" class="designer_main">
    <div class="container">
      <leftDragable @addEnd="andEndEmit" />
      <centerMain
        :active-col="state.activeCol"
        :active-id="state.activeId"
        :component-conf="state.componentConf"
        @activeItem="activeItem"
        @back="$emit('close', true)"
        @clearAll="clearAll"
        @save="save"
      />
      <rightConfig
        :active-col="state.activeCol"
        :active-id="state.activeId"
        :component-conf="state.componentConf"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, provide, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import leftDragable from './leftDragable.vue'
  import centerMain from './centerMain.vue'
  import rightConfig from './rightConfig.vue'
  import { defaultJson } from '../config/index'
  import { bizApi } from '@agilebpm/api'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const state = reactive({
    activeId: '',
    activeCol: '',
    componentConf: {} as LogicComponent,
  })

  const bizLogicProgram = ref<BizLogicProgram>({} as any)

  const props = defineProps({
    id: { required: false, type: String, default: '' },
  })
  const emits = defineEmits(['close'])

  const activeItem = (element: any) => {
    state.activeId = element.key || ''
    if (element.key) {
      state.componentConf = element
    }
  }
  const activeColClick = (col: any) => {
    state.activeCol = col.key || ''
  }
  const resetControl = () => {
    state.componentConf = { type: '', label: '' }
  }
  const removeItem = (element: any) => {
    bizLogicProgram.value.designJson.list =
      bizLogicProgram.value.designJson.list.filter(
        (item: any) => item.key !== element.formId
      )
    state.componentConf = { type: '', label: '' }
  }

  provide('bizLogicProgram', bizLogicProgram)

  provide('globalParams', () => {
    return bizLogicProgram.value.designJson.params || {}
  })

  provide('activeItem', activeItem)
  provide('removeItem', removeItem)
  provide('activeColClick', activeColClick)
  provide('resetControl', resetControl)
  const andEndEmit = (data: any) => {
    console.log(data)
  }

  const clearAll = () => {
    bizLogicProgram.value.designJson.list = []
    state.componentConf = { type: '', label: '' }
  }

  onMounted(async () => {
    const id = props.id || '' //|| this.$route.query.id || ''
    if (!id) {
      bizLogicProgram.value = abUtil.clone(defaultJson)
    } else {
      getData(id)
    }
  })

  // 获取数据
  const getData = (id: string) => {
    bizApi.formCombination.getDesign(id).then((res: any) => {
      bizLogicProgram.value = res.data
    })
  }

  // 保存后重新加载下后台数据，rev 以及id
  const save = () => {
    if (!bizLogicProgram.value.code || !bizLogicProgram.value.name) {
      ElMessage({
        message: '请完善表单！',
        type: 'warning',
      })
      state.activeId = ''
      return
    }

    bizApi.formCombination
      .saveDesignJson(bizLogicProgram.value)
      .then((res: any) => {
        getData(res.data)
        ElMessage({
          message: '保存成功！',
          type: 'success',
        })
      })
  }
</script>
<style lang="scss" scoped>
  @import '../styles/index.scss';
</style>
