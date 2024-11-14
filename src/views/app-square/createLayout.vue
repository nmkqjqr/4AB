<template>
  <ab-layout-designer
    v-if="designInfo.show"
    :id="designInfo.defId"
    v-model="designInfo.show"
    @close="closeDefinition()"
  />
</template>
<script lang="ts">
  // 应用广场创建组联表单
  export default {
    name: 'CreateLayout'
  }
</script>
<script setup lang="ts">
import { abLayoutDesigner } from '~/agilebpm/build/combinationApp'
import { abUtil,abTools } from '~/agilebpm'
import '../biz/bizFormCombination/icons/icon.js'
import '../biz/bizFormCombination/icons/layout-left.js'
const { proxy } = abTools.useCurrentInstance()
const designInfo = reactive({
  show: true,
  defId: proxy.$route.params.formDesignId || '',
})

const closeDefinition = () => {
  window.close()
}


</script>
<style lang="scss" scoped>
.createAppSquareBox{
   height: 100%;
 }
</style>