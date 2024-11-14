<template >
  <div :style="{width:'100%',height:'100%',background:color}">
    <!-- <el-button @click.stop="btnClick">开始发起流程</el-button>
    <el-dialog title="提示" v-model="state.dialogVisible" width="30%" append-to-body>
      <div>
        <h1>组件详细内容</h1>
        <el-input v-model="state.value"></el-input>
      </div>
    </el-dialog> -->
  </div>
</template>
<script lang="ts">
export default {
  name: 'Test',
}
</script>
<script lang="ts" setup>
import { onMounted, provide, reactive, toRefs } from 'vue'
const state = reactive({
  dialogVisible: false,
  value: '',
})
const color = ref('')
const getRandomColor = function () {
  return (
    'rgb(' +
    Math.round(Math.random() * 255) +
    ',' +
    Math.round(Math.random() * 255) +
    ',' +
    Math.round(Math.random() * 10) +
    ')'
  )
}
onMounted(() => {
  color.value = getRandomColor()
})
const btnClick = () => {
  console.log('fasdfasdf---------------->')
  state.dialogVisible = true
}
</script>
<style lang="scss">
</style>