<template>
  <el-form-item label="允许半选">
    <el-switch v-model="data.allowHalf" />
  </el-form-item>
  <el-form-item label="默认值">
    <el-rate
     class="rateStyle"
     clearable 
      :allow-half="data.allowHalf" 
      v-model="data.defaultValue"
    />  
    <el-button type="text" style="margin-left: 20px" @click="data.defaultValue = ''">
     清除默认值
    </el-button>
  </el-form-item>

</template>

<script lang="ts">
  export default {
    name: 'ab-rate-config',
  }
</script>

<script lang="ts" setup>
  //继承的属性data
  const props = defineProps({ data: { type: Object, required: true } })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)

</script>


<style lang="scss">
.rateStyle{
  .el-rate__item{
    .el-icon{
      cursor: pointer;
    }
  }
}
</style>