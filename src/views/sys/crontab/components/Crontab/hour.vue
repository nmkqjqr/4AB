<template>
  <el-form size="small">
    <el-form-item>
      <el-radio v-model="info.type" label="1">
        小时，允许的通配符[, - * /]
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="info.type" label="2">
        周期从
        <el-input-number
          v-model="info.cycleMin"
          :max="info.cycleMax"
          :min="0"
        />
        -
        <el-input-number
          v-model="info.cycleMax"
          :max="23"
          :min="info.cycleMin"
        />
        小时
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="3">
        周期从
        <el-input-number v-model="info.cycleStart" :max="23" :min="1" />
        小时开始，每
        <el-input-number v-model="info.cycleInterval" :max="23" :min="1" />
        小时执行一次
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="4">指定</el-radio>
      <el-checkbox-group v-model="info.assign" @change="info.type = '4'">
        <el-checkbox
          v-for="index in 24"
          :key="index"
          :label="(index - 1).toString().padStart(2, '0')"
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
    type: "1",
    cycleMin: 0,
    cycleMax: 2,
    cycleStart: 0,
    cycleInterval: 1,
    assign: [],
  });

  const computeUnit = computed(() => {
    let s = "";
    switch (parseInt(info.type)) {
      case 1:
        s = "*";
        break;
      case 2:
        s = `${info.cycleMin}-${info.cycleMax}`;
        break;
      case 3:
        s = `${info.cycleStart}/${info.cycleInterval}`;
        break;
      case 4:
        s = info.assign.join(",");
    }
    return s || '*';
  });

  watch(computeUnit, (newVal, oldValue) => {
    emits("update:modelValue", newVal);
  });

  watch(
    () => info.type,
    (newValue, oldValue) => {
      if (newValue === '4') {
        info.assign = ['00']
      }
    }
  )
</script>
<style scoped>
  .el-checkbox.el-checkbox--small {
    width: 35px;
  }
</style>
