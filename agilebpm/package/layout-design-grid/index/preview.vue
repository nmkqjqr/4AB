<template>
  <div class="preview_main">
    <previewGroup :design-json="designJson" :list="list" />
  </div>
</template>
<script lang="ts">
  export default { name: 'LayoutPreview' }
</script>
<script setup lang="ts">
  import { reactive, defineProps, toRefs, PropType } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { bizApi,appsquareApi } from '@agilebpm/api'
  import previewGroup from './previewGroup.vue'
  const props = defineProps({
    designJson: {
      required: true,
      type: Object as PropType<DesignJson>,
    },
    params: {
      required: false,
      type: Object,
    },
    designCode: {
      type: String,
      required: true,
    },
  })
  const { designJson } = toRefs(props)
  // eslint-disable-next-line vue/no-setup-props-destructure
  const { list, params } = toRefs(props.designJson)
  // @ts-ignore
  const { proxy } = getCurrentInstance()

  const globalParams = reactive({})

  provide('globalParams', globalParams)
  provide('designJson', designJson)

  // 其次取url地址上的值
  for (const key in proxy.$route.query) {
    globalParams[key] = proxy.$route.query[key]
  }

  const getFlatComponentList = () => {
    const array: FormCombinationComponent[] = []
    list.value.forEach((item) => {
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

  let isLoding = true
  let last
  watch(
    () => {
      // 当不需要监听时，直接return 固定值
      if (!props.designJson.paramsExpandSql || !props.designJson.watchParam) {
        return 1
      }
      //@ts-ignore
      return globalParams[props.designJson.watchParam]
    },
    (newValue, oldVal) => {
      doFrashSqlParam()
    }
  )
  // 一开始的时候无需执行，因为后台已经执行过了
  // 当鼠标为键入值时，不断更新值，这时候第一次会执行，第二次会延时执行，后面多次均不再执行
  let isLoding2 = false
  const doFrashSqlParam = () => {
    if (!props.designCode) return

    // 加载中则等待并重试
    if (isLoding) {
      // 多次加载时，只执行第二次，后面的全部return
      if (!isLoding2) return
      isLoding2 = false

      window.setTimeout(() => {
        isLoding2 = true
        doFrashSqlParam()
      }, 1000)
    }
    isLoding = true
    // 执行更新动作
    if(proxy.$route.name !== "CreateAppSquare"){
      bizApi.formCombination
      .frashSqlParam(props.designCode, globalParams)
      .then((result) => {
        abUtil.easyClone(result.data, globalParams)
        isLoding = false
      })
    }
    if(proxy.$route.name == "CreateAppSquare"){
      appsquareApi.thirdParty.refreshParamThirdParty(proxy.$route.params.id, globalParams).then((result:any) => {
        abUtil.easyClone(result.data, globalParams)
        isLoding = false
      })
    }
  }

  onMounted(() => {
    // 参数准备后，如果再改变值才执行SQL更新，默认SQL只在后台更新的
    window.setTimeout(() => {
      isLoding = false
      isLoding2 = true
    }, 1)
    if (props.params) {
      abUtil.easyClone(props.params, globalParams)
      return
    }
    // 首先是后台返回的值
    params.value.forEach((param) => {
      if (param.name) {
        globalParams[param.name] = param.value
      }
    })

    for (const key in proxy.$route.params) {
      globalParams[key] = proxy.$route.params[key]
    }
  })
</script>
<style lang="scss" scoped>
  .preview_main {
    overflow: auto;
  }
</style>
