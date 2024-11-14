<template>
  <div class="ab-form-design">
    <avue-form-design
      ref="avueFormDesignRef"
      :design-id="props.designId"
      :is-wf="true"
      :style="{ height: info.formHeigth }"
    />
  </div>
</template>
<script lang="ts" setup>
  import avueFormDesign from '~/agilebpm/package/avue-form-design/index.vue'

  const props = defineProps({
    designId: { required: false, type: String },
  })

  const avueFormDesignRef = ref<any>(null)

  avueFormDesignRef?.value?.getBo()
  const info = {
    formHeigth: `${window.innerHeight - 45}px`,
  }

  //提交前获取表单json
  const getJson = (code: any, name: any) => {
    return avueFormDesignRef?.value?.getJson(code, name)
  }
  const getBo = () => {
    return avueFormDesignRef?.value?.getBo()
  }
  defineExpose({
    getJson,
    getBo,
  })
</script>

<style>
  .ab-form-design .el-form-item__content {
    flex-wrap: wrap-reverse !important;
  }

  #app {
    height: 100%;
    min-height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    margin: 0;
  }
</style>
