<template>
  <div>
    <el-form label-width="60px">
      <el-form-item
        label="名称"
        :rules="[
          { required: true, message: '必填' },
          { max: 50, message: '最多可输入50个字符' },
        ]"
      >
        <el-input v-model="selectItem.nodeName" />
      </el-form-item>
    </el-form>
    <condition-script
      ref="script"
      v-model="selectItem.choicesConfig"
      :is-support-script-variables="false"
      :manual-script="false"
      @ok="ok"
    />
  </div>
</template>
<script lang="ts" setup>
  import conditionScript from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/conditionScript.vue'

  const props = defineProps({
    selectItem: { required: true, type: Object },
    commonUtil: { required: true, type: Object },
  })

  const { selectItem } = toRefs(props)

  /* const info = reactive({
  selectItem: props.selectItem,
}) */

  /* watch(
  () => selectItem,
  (newVal, oldVal) => {},
  { deep: true }
)
 */
  const ok = (data: any) => {}
</script>
<style scoped>
  .form-control {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 32px;
    padding: 4px 7px;
    font-size: 14px;
    line-height: 1.5;
    color: #515a6e;
    cursor: pointer;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
  }
  :deep(.el-select-dropdown__item) {
    padding: 0 20px !important;
  }
  td {
    padding: 10px;
  }
  fieldset {
    padding: 10px;
    border: 2px dotted #ddd;
  }
</style>
