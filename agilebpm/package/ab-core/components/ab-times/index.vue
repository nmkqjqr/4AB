<template>
  <span style="overflow: hidden">
    <div class="ivu-input-wrapper" style="float: left; width: 120px">
      <el-input v-model="data.day" placeholder="天数">
        <template #append>天</template>
      </el-input>
    </div>
    <el-select
      v-model="data.hour"
      placeholder="小时"
      style="float: left; width: 80px"
    >
      <el-option
        v-for="h in data.hourArr"
        :key="h"
        :label="h + '小时'"
        :value="h"
      >
        {{ h + '小时' }}
      </el-option>
      <template #append>天</template>
    </el-select>
    <el-select
      v-model="data.minute"
      placeholder="分钟"
      style="float: left; width: 80px"
    >
      <el-option
        v-for="m in data.minuteArr"
        :key="m"
        :label="m + '分钟'"
        :value="m"
      />
      <template #append>天</template>
    </el-select>
  </span>
</template>

<script setup lang="ts">
  import { PropType } from 'vue'

  const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    modelValue: Number,
    placeholder: { type: String, required: false, default: '' },
    showMinute: { type: Boolean, required: false, default: false },
  })

  const data = reactive({
    colspan: 8,
    hourArr: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    minuteArr: [0, 1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 50],
    minute: 0,
    hour: 0,
    day: 0,
  })

  watch(
    [() => data.day, () => data.hour, () => data.minute],
    (newValue, oldValue) => {
      calTimes()
    }
  )

  watch(
    () => props.modelValue,
    (time: any, oldvalue) => {
      if (time === undefined) {
        time = 0
      }
      data.day = Math.floor(time / (60 * 24))
      data.hour = Math.floor((time - data.day * (60 * 24)) / 60)
      data.minute = time - data.day * (60 * 24) - data.hour * 60
    },
    {
      immediate: true,
    }
  )

  const emit = defineEmits(['update:modelValue'])
  const calTimes = () => {
    let modelValue = 0
    modelValue += 60 * 24 * data.day
    modelValue += 60 * data.hour
    modelValue += data.minute
    // if (modelValue == 0) modelValue = ''
    emit('update:modelValue', modelValue)
  }
</script>
