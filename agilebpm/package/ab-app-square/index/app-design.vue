<template>
  <div>
    <formCustSqlEditSimple ref="simpleRef" @app-square-app-save="appSquareAppSave" @set-default-cust-grid-data="setDefaultCustGridData" :is-app-square-app="true"></formCustSqlEditSimple>
  </div>
</template>
<script lang="ts" setup>
import formCustSqlEditSimple from '@/views/biz/formCustSql/formCustSqlEdit.vue'
const emit = defineEmits(['appSquareAppSave','setDefaultCustGridData'])
const state = reactive({
})
const simpleRef = ref(null)
const setForm = (data:any) => {
  simpleRef.value.setForm(data)
}
const saveApp = () => {
  simpleRef.value.handlebeforesaveFn()
}
const appSquareAppSave = (data:any) => {
  emit('appSquareAppSave',data)
}
const setDefaultCustGridData = (data:any) => {
  emit('setDefaultCustGridData',data)
}
const getModifyData = () => {
  return simpleRef.value.info.data
}

defineExpose({
  setForm,
  saveApp,
  getModifyData
})

</script>
<style lang="scss" scoped>
</style>
