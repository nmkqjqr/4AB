<template>
  <div v-if="isSmallScreenWidth(windowWith)">
    <el-button
      :icon="DArrowRight"
      type="primary"
      @click="drawer = true"
      style="position: fixed; top: 250px; right: -2px; width: 60px"
    >
      {{ $abT('bpm.office.dynamic', '动态') }}
    </el-button>
  </div>
  <dynamic-content
    v-else
    :instance="props.instance"
    :task-key="props.taskKey"
  />
  <el-drawer
    v-model="drawer"
    direction="rtl"
    size="35%"
    :destroy-on-close="true"
    :show-close="true"
    :with-header="false"
  >
    <dynamic-content :instance="props.instance" :task-key="props.taskKey" />
  </el-drawer>
</template>

<script lang="ts" setup>
  import dynamicContent from './dynamic-content.vue'
  import { DArrowRight } from '@element-plus/icons-vue'
  import { ElAffix } from 'element-plus'
  import { isSmallScreenWidth } from './myTaskConfig'

  const props = defineProps({
    instance: { type: Object, required: true },
    taskKey: { type: String, required: false, default: null },
  })

  const windowWith = ref(0)
  const drawer = ref(false)

  const getWindowWith = () => {
    windowWith.value = window.innerWidth
  }

  onMounted(() => {
    getWindowWith()
    window.addEventListener('resize', getWindowWith)
  })
</script>

<style lang="scss" scoped></style>
