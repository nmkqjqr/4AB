<template>
  <el-card
    shadow="never"
    style="
      height: 100%;
      padding: 0;
      overflow-y: auto;
      background-color: transparent;
    "
  >
    <div v-html="showValue" />
  </el-card>
</template>

<script lang="ts">
  export default {
    name: 'AbRich',
  }
</script>

<script setup lang="ts">
  import { PropType } from 'vue'
  const props = defineProps({
    componentConfig: {
      type: Object as PropType<FormCombinationComponent>,
      required: true,
    },
  })

  const { componentConfig } = toRefs(props)

  const globalParams = inject('globalParams') as any
  const showValue = ref(componentConfig.value.control?.contentValue)

  componentConfig.value.initFunction = () => replaceValue()

  //通过param替换默认值成变量
  const replaceValue = () => {
    const ct = componentConfig.value.control
    if (ct && ct?.contentValue) {
      showValue.value = ct.contentValue
      if (
        ct.contentValue &&
        ct.contentValue.length > 0 &&
        ct.param &&
        ct.param.length > 0
      ) {
        //只读下做映射分离

        const param = ct.param
          .filter((obj: any) => obj.key)
          .map((s: any) => {
            return {
              key: `{${s.key}}`,
              value: s.value.abArgFormat(globalParams),
            }
          })

        if (param && param.length > 0) {
          // 定义一个正则表达式，匹配数组中的所有 key
          const reg = new RegExp(
            param.map((item: any) => item.key).join('|'),
            'g'
          )
          // 定义一个替换函数，根据匹配的 key 返回对应的 value
          const replacer = (match: string) => {
            return param?.find((item: any) => item.key == match).value ?? ''
          }
          // 使用 replace() 方法替换字符串中的内容
          showValue.value = ct.contentValue.replace(reg, replacer)
        }
      }
    }
  }

  replaceValue()

  watch(
    () => componentConfig.value.control.param,
    () => replaceValue(),
    { deep: true }
  )

  watch(
    () => globalParams,
    () => replaceValue(),
    { deep: true }
  )
</script>
