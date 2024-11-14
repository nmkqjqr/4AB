<template>
  <el-form size="small">
    <el-form-item>
      <el-radio v-model="info.type" label="1">
        每月 允许的通配符[, - * /]
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
        <el-input-number
          v-model="info.cycleMax"
          :max="12"
          :min="info.cycleMin"
        />
        月
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="4">
        从
        <el-input-number v-model="info.cycleStart" :max="12" :min="1" />
        月开始，每
        <el-input-number v-model="info.cycleInterval" :max="12" :min="1" />
        月执行一次
      </el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="info.type" label="5">指定</el-radio>
      <el-checkbox-group v-model="info.assign" @change="info.type = '5'">
        <el-checkbox
          v-for="index in 12"
          :key="index"
          :label="index.toString().padStart(2, '0')"
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
    cycleMin: 1,
    cycleMax: 2,
    cycleStart: 1,
    cycleInterval: 1,
    assign: []
  });

  const computeUnit = computed(() => {
    let s = "";
    switch (parseInt(info.type)) {
      // 每月
      case 1:
        s = "*";
        break;
      // 不指定
      case 2:
        s = "?";
        break;
      // 周期
      case 3:
        s = `${info.cycleMin}-${info.cycleMax}`;
        break;
      case 4:
        s = `${info.cycleStart}/${info.cycleInterval}`;
        break;
      case 5:
        s = info.assign.join(",");
        break;
    }
    return s || '*';
  });

  watch(computeUnit, (newVal, oldValue) => {
    emits("update:modelValue", newVal);
  });

  watch(
    () => info.type,
    (newValue, oldValue) => {
      if (newValue === '5') {
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
