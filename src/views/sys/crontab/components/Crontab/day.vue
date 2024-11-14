<template>
  <el-form size="small">
    <el-form-item>
      <el-radio v-model="info.type" label="1">
        每天 允许的通配符[, - * / L W]
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="2">不指定</el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="3">
        周期从
        <el-input-number
          v-model="info.cycleMin"
          :max="info.cycleMax"
          :min="1"
        />
        -
        <el-input-number v-model="info.cycleMax" :min="info.cycleMin" />
        日
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="4">
        从
        <el-input-number v-model="info.cycleStart" :max="31" :min="1" />
        日开始，每
        <el-input-number v-model="info.cycleInterval" :min="1" />
        天执行一次
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="5">
        每月
        <el-input-number v-model="info.nearWorkday" :max="31" :min="1" />
        号最近的那个工作日
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="6">本月最后一天</el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="7">指定</el-radio>
      <el-checkbox-group v-model="info.assign" @change="info.type = '7'">
        <el-checkbox
          v-for="index in 31"
          :key="index"
          :label="index.toString().padStart(2, '0')"
          name="type"
        />
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>
<script type="ts" setup>
  import { defineEmits, defineProps, reactive, watch } from 'vue'
  const props = defineProps({
    modeValue: { required: true, type: String },
  })

  const emits = defineEmits(['update:modelValue'])

  const info = reactive({
    type: '1',
    cycleMin: 1,
    cycleMax: 2,
    cycleStart: 1,
    cycleInterval: 1,
    nearWorkday: 1,
    assign: [],
  })

  const computeUnit = computed(() => {
    let s = ''
    switch (parseInt(info.type)) {
      // 每天
      case 1:
        s = '*'
        break
      // 不指定
      case 2:
        s = '?'
        break
      // 周期
      case 3:
        s = `${info.cycleMin}-${info.cycleMax}`
        break
      // 间隔
      case 4:
        s = `${info.cycleStart}/${info.cycleInterval}`
        break
      // 每月最近工作日
      case 5:
        s = `${info.nearWorkday}W`
        break
      // 本月最后一天
      case 6:
        s = 'L'
        break
      // 指定
      case 7:
        s = info.assign.join(',')
        break
    }
    return s || '?'
  })

  watch(computeUnit, (newVal, oldValue) => {
    emits('update:modelValue', newVal)
  })

  watch(
    () => info.type,
    (newValue, oldValue) => {
      if (newValue === '7') {
        info.assign = ['01']
      }
    }
  )
</script>
<style scoped>
  .el-checkbox.el-checkbox--small {
    width: 35px;
  }
</style>
