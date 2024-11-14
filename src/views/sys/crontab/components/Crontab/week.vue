<template>
  <el-form size="small">
    <el-form-item>
      <el-radio v-model="info.type" label="1">
        每周 允许的通配符[, - * / L #]
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="2">不指定</el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="info.type" label="3">
        周期 从星期
        <el-input-number
          v-model="info.cycleMin"
          :max="info.cycleMax"
          :min="1"
        />
        -
        <el-input-number
          v-model="info.cycleMax"
          :max="7"
          :min="info.cycleMin"
        />
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="4">
        第
        <el-input-number v-model="info.cycleStart" :max="7" :min="1" />
        周的星期
        <el-input-number v-model="info.cycleInterval" :max="7" :min="1" />
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="5">
        本月最后一个星期
        <el-input-number v-model="info.lastWeek" :max="7" :min="1" />
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="6">指定</el-radio>
      <el-checkbox-group v-model="info.assign" @change="info.type = '6'">
        <el-checkbox
          v-for="index in 7"
          :key="index"
          :label="index.toString()"
          name="type"
        />
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>
<script type="ts" setup>

  import { reactive, watch } from "vue";

  const props = defineProps({
    modeValue: { required: true, type: String }
  });

  const emits = defineEmits(["update:modelValue"]);

  const info = reactive({
    type: "2",
    cycleMin: 1,
    cycleMax: 2,
    cycleStart: 1,
    cycleInterval: 1,
    lastWeek: 1,
    assign: []
  });

  const computeUnit = computed(() => {
    let s = ''
    switch (parseInt(info.type)) {
      // 每周
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
      //
      case 4:
        s = `${info.cycleStart}/${info.cycleInterval}`
        break
      // 本月最后一个星期
      case 5:
        s = `${info.lastWeek}L`
        break
      // 指定
      case 6:
        s = info.assign.join(',')
    }
    return s || '?'
  })


  watch(computeUnit, (newVal, oldValue) => {
    emits('update:modelValue', newVal)
  })

  watch(
    () => info.type,
    (newValue, oldValue) => {
      if (newValue === '6') {
        info.assign = ['1']
      }
    }
  )
</script>
<style scoped>
  .el-checkbox.el-checkbox--small {
    width: 35px;
  }
</style>
