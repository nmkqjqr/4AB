<template>
  <div class="center_side">
    <div class="top_action">
      <el-button type="primary" @click="emits('save')">保存</el-button>
      <el-button @click="emits('back')">返回</el-button>

      <el-button :icon="View" type="text" @click="viewPreview">预览</el-button>
      <el-button :icon="Delete" type="text" @click="resetAll">清空</el-button>
    </div>
    <div style="width: 100%; height: calc(100% - 50px)">
      <el-scrollbar class="center_designer" @click="globalClick">
        <el-row class="center_designer_row" :gutter="15">
          <groupContainer
            :active-col="props.activeCol"
            :active-id="props.activeId"
            :component-conf="componentConf"
            :list="bizLogicProgram.designJson.list"
          />
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { View, Delete } from '@element-plus/icons-vue'
  import { PropType } from 'vue'
  import groupContainer from './groupContainer.vue'
  const bizLogicProgram = inject('bizLogicProgram') as any
  const props = defineProps({
    activeId: String,
    activeCol: String,
    componentConf: {
      required: true,
      type: Object as PropType<LogicComponent>,
    },
  })
  const { componentConf } = toRefs(props)

  const emits = defineEmits([
    'clearAll',
    'activeItem',
    'viewPreview',
    'save',
    'back',
  ])
  const draggableAdd = (evt: any) => {
    // 获取当前索引
    const newIndex = evt.newIndex
    const key = new Date().getTime().toString()
    const obj: any =
      bizLogicProgram.value.designJson.list[newIndex] || undefined
    if (!obj) {
      return
    }
    bizLogicProgram.value.designJson.list[newIndex].formId = obj.type + key
    groupClick(obj)
    console.log(bizLogicProgram.value.designJson.list)
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
</script>
<style lang="scss">
  @import '../styles/index.scss';
</style>
