<template>
  <div>
    <Gantt
      ref="ganttRef"
      :component-config="props.componentConfig"
      :get-flat-component-list="getFlatComponentList()"
      :global-params="globalParams"
    />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AbGanttChartLayout',
  }
</script>
<script setup lang="ts">
  import Gantt from './components/gantt.vue'
  import { PropType } from 'vue'
  const globalParams = inject('globalParams') as any
  const getFlatComponentList = inject('getFlatComponentList') as any
  const props = defineProps({
    componentConfig: {
      type: Object as PropType<FormCombinationComponent>,
      required: true,
    },
  })
  const ganttRef = ref()

  const { componentConfig } = toRefs(props)
  // 更新联动
  const initFuntion = () => {
    ganttRef.value.getCustData()
  }
  componentConfig.value.relaod = initFuntion

  let intervalID: any

  // 在组件销毁前停止定时器
  onBeforeUnmount(() => {
    clearInterval(intervalID)
  })

  watch(
    () => [
      componentConfig.value?.control?.timedRefresh,
      componentConfig.value?.control?.refreshCycle,
    ],
    () => {
      const ct = componentConfig.value?.control
      clearInterval(intervalID)
      if (ct.timedRefresh) {
        intervalID = setInterval(
          function () {
            initFuntion()
          },
          ct.refreshCycle > 1 ? ct.refreshCycle * 1000 : 1000
        )
      }
    },
    {
      immediate: true,
    }
  )
</script>
