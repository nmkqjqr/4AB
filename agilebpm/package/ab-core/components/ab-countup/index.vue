<template>
  <span ref="countRef" />
</template>

<script lang="ts">
  export default {
    name: 'CountUp',
  }

  //定义的配置对象
  declare interface DefaultOptions {
    startVal: number // number to start at (0)
    decimalPlaces: number // number of decimal places (0)
    duration: number // animation duration in seconds (2)
    useGrouping: boolean // example: 1,000 vs 1000 (true)
    useEasing: boolean // ease animation (true)
    smartEasingThreshold: number // smooth easing for large numbers above this if useEasing (999)
    smartEasingAmount: number // amount to be eased for numbers above threshold (333)
    separator: string // grouping separator (',')
    decimal: string // decimal ('.')
  }
</script>

<script lang="ts" setup>
  import { CountUp } from 'countup.js'
  import { PropType } from 'vue'
  const countRef = ref()

  const props = defineProps({
    // 父类传入的最终值
    endVal: {
      type: String,
      default: '0',
    },

    //可以执行父类传入的方法
    options: {
      type: Object,
      default: () => {},
    },
    //可以接收父类传入的配置，如果不传则按下方默认配置
    defaultOptions: {
      type: Object as PropType<DefaultOptions>,
      default: () => ({
        startVal: 0, // number to start at (0)
        decimalPlaces: 0, // number of decimal places (0)
        duration: 4, // animation duration in seconds (2)
        useGrouping: true, // example: 1,000 vs 1000 (true)
        useEasing: true, // ease animation (true)
        smartEasingThreshold: 999, // smooth easing for large numbers above this if useEasing (999)
        smartEasingAmount: 333, // amount to be eased for numbers above threshold (333)
        separator: ',', // grouping separator (',')
        decimal: '.', // decimal ('.')
      }),
    },
  })

  const coutOptions = Object.assign({}, props.defaultOptions, props.options)

  watch(
    () => props.endVal,
    () =>
      new CountUp(countRef.value, parseInt(props.endVal), coutOptions).start()
  )
</script>
