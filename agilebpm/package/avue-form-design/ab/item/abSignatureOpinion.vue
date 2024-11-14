<template>
  <el-input :disabled="item.readOnly" v-model="item.defaultValue" v-if="item.patternType === 'command'"
    placeholder="请输入意见" />

  <el-button :icon="EditPen" v-if="item.patternType === 'signature'">
    签名
  </el-button>

  <div v-if="item.patternType === 'signatureOpinion'">
    <el-input :disabled="item.readOnly" v-model="item.defaultValue" type="textarea" placeholder="请输入意见" />
    <el-button :icon="EditPen" style="margin-top: 5px;margin-left: 5px">签名</el-button>
  </div>
</template>

<script lang="ts">
export default {
  name: "abSignatureOpinion",
};
</script>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { EditPen } from '@element-plus/icons-vue'
const props = defineProps({ item: { type: Object, required: true }, })
const { item } = toRefs(props)
</script>
