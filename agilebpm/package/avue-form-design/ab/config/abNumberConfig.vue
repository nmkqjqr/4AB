<template>
  <div>
    <label class="el-form-item__label" style="padding: 0">数字控件配置</label>
  <el-form-item label="金额前缀"  prop="coinValue">
    <el-input v-model="data.coinValue" placeholder="请输入金额前缀"/>
  </el-form-item>
  <el-form-item label="展示千分位"  prop="comdify" label-width="120px">
    <el-switch
    v-model="data.comdify"
    inline-prompt
    active-text="是"
    inactive-text="否"
  />
  </el-form-item>

  <el-form-item label="支持大写转换"  prop="convertCurrency" label-width="120px">
    <el-switch
    v-model="data.convertCurrency"
    inline-prompt
    active-text="是"
    inactive-text="否"
  />
  </el-form-item>
  <defult-value-config v-model="data.defaultValue" :filed-type="data.fieldType"></defult-value-config>
  <el-form-item label="小数位数"  prop="decimalPlace">
    <el-input-number v-model="data.decimalPlace" placeholder="请输入小数位数" :min="0"/>
  </el-form-item>
  
  </div>
</template>

<script lang="ts">
  export default {
      name: "ab-number-config",
  };
  </script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import defultValueConfig from './component/defaultValueConfig.vue'
  const props = defineProps({data:{type:Object,required:true},})
  const { data } = toRefs(props)
</script>
