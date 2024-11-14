<template>
  <el-form-item label="模式选择">
    <el-radio-group v-model="data.patternType">
      <el-radio value="command">批示</el-radio>
      <el-radio value="signature">签名</el-radio>
      <el-radio value="signatureOpinion">签批</el-radio>
    </el-radio-group>
  </el-form-item>

  <el-form-item label="签批配置" v-show="data.patternType === 'signatureOpinion'">
    <el-select v-model="data.signatureConfig" placeholder="请选择签批配置">
      <el-option label="多人重复多次" value="moreRepeat" />
      <el-option label="单人重复多次" value="singleRepeat" />
      <el-option label="多人只签一次" value="moreOnce" />
      <el-option label="单人只签一次" value="singleOnce" />
    </el-select>
  </el-form-item>

  <el-form-item label="签名配置" v-show="data.patternType === 'signatureOpinion'">
    <el-radio-group v-model="data.signatureRequired">
      <el-radio value="kx">可选</el-radio>
      <el-radio value="bt">必填</el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script lang="ts">
export default {
  name: "ab-signature-opinion-config",
};
</script>

<script lang="ts" setup>

//继承的属性data
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },

})
//将data内的属性转为响应式数据
const { data } = toRefs(props)

const initData = () => {
  if (!data.value.patternType) {
    data.value.patternType = "signatureOpinion"
  }
  if (!data.value.signatureConfig) {
    data.value.signatureConfig = "moreRepeat"
  }
  if (!data.value.signatureRequired) {
    data.value.signatureRequired = "bt"
  }
}
initData()

</script>

