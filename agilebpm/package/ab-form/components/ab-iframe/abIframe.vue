<template>
  <div>
    <iframe
      v-if="srcUrl && srcUrl.length > 0"
      v-bind="$attrs"
      :src="srcUrl"
      style="width: 100%; border: none"
      :style="{ height: props.height + 'px' }"
    />
    <el-empty v-else description="暂未设置URL地址" />
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    url: {
      type: String,
      required: true,
    },
    //是否禁用
    height: {
      type: Number,
      default: 600,
    },
    param: {
      type: Array,
      default: () => [],
    },
  })

  const srcUrl = ref(props.url)

  watch(
    () => props.param,
    (val) => {
      if (props.url && props.url.length > 0 && val && val.length > 0) {
        let str = ''
        val.forEach((s: any) => {
          if (s.key && s.key.length > 0) {
            str += `${s.key}=${s.value}&`
          }
        })
        let sign = ''
        if (str && str.length > 0) {
          str = str.substring(0, str.length - 1)
          sign = props.url.includes('?') ? '&' : '?'
        }
        srcUrl.value = props.url + sign + str
      }
      console.log('最终的url', srcUrl.value)
    },
    { immediate: true, deep: true }
  )
</script>
