<template>
  <div ref="myDiv" style="width: 100%; height: 100%">
    <EchartsView ref="echartsRef" :config="props.componentConfig" />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AbEcharts',
  }
</script>

<script setup lang="ts">
  import EchartsView from './components/echartsView.vue'
  import { PropType } from 'vue'
  const echartsRef = ref()
  const props = defineProps({
    componentConfig: {
      type: Object as PropType<FormCombinationComponent>,
      required: true,
    },
  })

  const { componentConfig } = toRefs(props)
  const initFuntion = () => {
    nextTick(() => echartsRef.value.opeitionInit())
  }

  componentConfig.value.initFunction = initFuntion
  componentConfig.value.relaod = initFuntion
  initFuntion()

  const myDiv = ref()
  let observer: any

  onMounted(() => {
    observer = new ResizeObserver(() => {
      console.log('observer变化了')
      echartsRef.value.changeHeight()
    })

    observer.observe(myDiv.value)
  })

  onUnmounted(() => {
    observer.disconnect()
  })

  watch(
    () => props.componentConfig.control,
    (val) => {
      initFuntion()
    },
    {
      deep: true,
    }
  )
</script>
