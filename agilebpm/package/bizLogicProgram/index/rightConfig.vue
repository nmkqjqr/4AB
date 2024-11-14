<template>
  <div class="right_side">
    <el-tabs v-model="activeName" class="demo-tabs" stretch>
      <el-tab-pane label="组件配置" name="first">
        <div class="tabs_main_padding">
          <el-form
            v-if="componentConf.key"
            label-suffix="："
            label-width="90px"
            :model="componentConf"
          >
            <el-form-item label="组件名称">
              <el-input v-model="componentConf.label" />
            </el-form-item>

            <div v-if="componentConfigPage[componentConf.type]">
              <component
                :is="componentConfigPage[componentConf.type]"
                :config="componentConf"
              />
            </div>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="全局配置" name="second">
        <global-config />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import globalConfig from '../config/globalConfig.vue'
  import { componentConfigPage } from '../config/layoutconfig'

  const props = defineProps({
    activeId: String,
    activeCol: String,
    componentConf: {
      required: true,
      type: Object as PropType<LogicComponent>,
    },
  })
  const { componentConf } = toRefs(props)

  const state = reactive({
    activeName: 'second',
    dialogVisible: false,
    tempData: {} as any,
  })

  const { activeName } = toRefs(state)

  watch(
    () => props.activeId,
    (value, old) => {
      if (value) {
        state.activeName = 'first'
      } else {
        state.activeName = 'second'
      }
    }
  )
</script>
<style lang="scss">
  @import '../styles/index.scss';
</style>
