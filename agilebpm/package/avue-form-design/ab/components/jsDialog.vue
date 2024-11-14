<template>
  <el-dialog v-model="data.visible" title="js配置" width="600px">
    <el-form :model="data" label-suffix="：" labelPosition="left" labelWidth="90px">
      <el-form-item label="js脚本">
        <el-input v-model="data.js" clearable placeholder="请输入js脚本"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="data.name" clearable placeholder="请输入js描述"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button text type="primary" @click="data.visible = false">
          取消
        </el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: 'jsDialog',
}
</script>

<script lang="ts" setup>
import { PropType, defineProps, onMounted, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const info = reactive({})
onMounted(() => { })
const ok = () => { }
</script>
