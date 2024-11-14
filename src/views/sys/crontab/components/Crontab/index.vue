<template>
  <el-container>
    <el-main>
      <el-tabs class="demo-tabs" model-value="0" :stretch="true">
        <el-tab-pane label="秒">
          <second v-model="info[0]" />
        </el-tab-pane>
        <el-tab-pane label="分钟">
          <minute v-model="info[1]" />
        </el-tab-pane>
        <el-tab-pane label="小时">
          <hour v-model="info[2]" />
        </el-tab-pane>
        <el-tab-pane label="日" name="日">
          <day v-model="info[3]" />
        </el-tab-pane>
        <el-tab-pane label="月" name="月">
          <month v-model="info[4]" />
        </el-tab-pane>
        <el-tab-pane label="周" name="周">
          <week v-model="info[5]" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-footer height="145px">
      <h4>最近5次运行时间：</h4>
      <el-row v-for="(item, index) in nextTriggerTimes" :key="index">
        {{ item }}
      </el-row>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
  export default {
    name: 'Crontab',
  }
</script>
<script setup lang="ts">
  import second from './second.vue'
  import minute from './minute.vue'
  import hour from './hour.vue'
  import day from './day.vue'
  import month from './month.vue'
  import week from './week.vue'
  import { reactive } from 'vue'
  import { sysApi } from '~/agilebpm'

  const props = defineProps({
    modelValue: { require: true, type: String },
  })

  const emits = defineEmits(['update:modelValue'])

  const info = reactive([
    '*', // 秒
    '*', // 分钟
    '*', // 小时
    '*', // 日
    '*', // 月
    '?', // 周
  ])

  const nextTriggerTimes = ref([])

  const cronExpression = computed(() => {
    const express = info.join(' ')
    setTimeout(() => {
      sysApi.crontab
        .getCrontabNextTriggerTimes(cronExpression.value)
        .then((res) => (nextTriggerTimes.value = res.data))
    }, 300)
    return express
  })

  watch(cronExpression, (newValue, oldValue) => {
    emits('update:modelValue', newValue)
  })
</script>
