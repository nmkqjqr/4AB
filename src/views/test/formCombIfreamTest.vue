<template>
  <div class="-container">{{ params }}</div>
  <el-button @click="updateParam()">更新一个参数到全局参数</el-button>
  当前编号：{{ id }}
  <p>当前URL地址：{{ url }}</p>
</template>
<script lang="ts" setup>
  import { abUtil } from '~/agilebpm'

  const url = document.location.href
  const params = {} //proxy.$route.query
  let a = 1
  const updateParam = () => {
    debugger
    a++
    // 发送数据报送事件，当URL参数发生变化，则重新加载了
    window.parent.postMessage({
      type: 'abFormIfreamEvent',
      url: document.location.href,
      isUpdateGlobalParam: true,
      params: {
        name: 'abc',
        test: `test${a}`,
      },
    })
  }
  const id = abUtil.AbRandom.randomNum6()
</script>

<style lang="scss" scoped></style>
