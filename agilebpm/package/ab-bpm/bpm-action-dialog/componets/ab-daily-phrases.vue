<template>
  <!-- <span>常用语</span> -->
  <el-tag
    v-for="(item, index) in options"
    :key="index"
    style="margin-bottom: 10px"
    @click="clickTag(item)"
  >
    {{ item }}
  </el-tag>
</template>

<script lang="ts" setup>
  import { sysApi } from '@agilebpm/api'
  const emit = defineEmits(['setDailyPhrases'])
  const options = ref([] as string[])
  //请求常用语
  sysApi.productLicence.getDailyPhrases().then((result: any) => {
    options.value.splice(0, options.value.length)
    if (result.data && result.data.length > 0) {
      result.data.forEach((item: any) => {
        options.value.push(item.locution)
      })
    }
  })

  const clickTag = (tagValue: string) => {
    if (!tagValue) {
      return
    }
    emit('setDailyPhrases', tagValue)
  }
</script>

<style></style>
