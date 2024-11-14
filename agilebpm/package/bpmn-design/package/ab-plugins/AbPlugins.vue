<template>
  <div class="my-process-plugin" :style="{ height: height + 'px' }">
    <resizebar
      :height="height"
      type="row"
      @setHeight="(val) => (height += val)"
    />
    <div class="my-process-plugin-header">
      <span>流程插件配置</span>
      <el-icon
        v-show="height > 100"
        :size="14"
        style="cursor: pointer"
        @click="height = 46"
      >
        <ArrowDownBold />
      </el-icon>
      <el-icon
        v-show="height < 100"
        :size="14"
        style="cursor: pointer"
        @click="height = 390"
      >
        <ArrowUpBold />
      </el-icon>
    </div>
    <div class="my-process-plugin-content">
      <el-row style="width: 100%; height: 100%">
        <el-col class="left-plus-list" :span="5">
          <div>
            <el-empty
              v-show="canAddPluginsList.length == 0"
              description="没有更多可用插件了"
              :image-size="100"
            />
            <div v-for="item in canAddPluginsList" :key="item.key">
              <div class="plugins_item">
                <div class="plugin_left">
                  <div class="left_icon">
                    <el-icon>
                      <Finished v-if="!item.icon" />
                      <component :is="item.icon" v-else />
                    </el-icon>
                  </div>
                  <div class="center_text">
                    <div
                      class="one_line"
                      style="font-size: 14px; font-weight: 600; color: #333"
                    >
                      {{ item.name }}
                    </div>
                    <div
                      class="one_line"
                      style="margin-top: 3px; font-size: 12px; color: #bcbcbc"
                    >
                      {{ item.desc }}
                    </div>
                  </div>
                </div>
                <div style="width: 15%">
                  <el-button
                    :icon="Plus"
                    size="small"
                    type="primary"
                    @click="addPluginClick(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col class="left-plus-content" :span="19">
          <el-row :gutter="12" style="width: 100%">
            <el-col
              v-for="(item, key) in pluginsList"
              v-show="getPluginByKey(key)"
              :key="key"
              :span="screenWidth <= 1350 ? 24 : 12"
            >
              <component
                :is="getPluginByKey(key).component"
                v-if="getPluginByKey(key)"
                :bo-list="boList"
                :flow-setting="flowSetting"
                :node-config="nodeConfig"
                :plugin-data="item"
                style="margin-bottom: 10px"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, PropType } from 'vue'
  import resizebar from '../resizebar/index.vue'
  import {
    Plus,
    ArrowDownBold,
    ArrowUpBold,
    Finished,
  } from '@element-plus/icons-vue'
  import { flowPlugins, getPluginsByNodeType } from './modules'

  const props = defineProps({
    nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
    boList: {
      required: true,
      type: Array,
    },
  })
  const screenWidth = ref(1351)
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth
    })()
  }

  const height = ref(390)
  const { flowSetting, nodeConfig } = toRefs(props)

  const addPluginClick = (item: any) => {
    if (nodeConfig.value.nodeName) {
      // 初始化插件定义
      if (nodeConfig.value.plugins === undefined) {
        nodeConfig.value.plugins = {} as Map<string, any>
      }
      nodeConfig.value.plugins[item.key] = JSON.parse(
        JSON.stringify(item.initJson)
      )
    } else {
      flowSetting.value.plugins[item.key] = JSON.parse(
        JSON.stringify(item.initJson)
      )
    }
  }

  const getPluginByKey = (key: any) => {
    let plugin: any
    if (nodeConfig.value.nodeName) {
      plugin = getPluginsByNodeType(nodeConfig.value.nodeType).filter(
        (item) => item.key == key
      )
    } else {
      plugin = flowPlugins.filter((item) => item.key == key)
    }

    return plugin.length > 0 ? plugin[0] : false
  }

  const canAddPluginsList = computed(() => {
    if (nodeConfig.value.nodeName) {
      return getPluginsByNodeType(nodeConfig.value.nodeType).filter(
        (item) => !nodeConfig.value.plugins?.[item.key]
      )
    } else {
      return flowPlugins.filter((item) => !flowSetting.value.plugins[item.key])
    }
  })

  const pluginSettings = computed(() => {
    return nodeConfig.value.nodeName
      ? getPluginsByNodeType(nodeConfig.value.nodeType)
      : flowPlugins
  })

  const pluginsList = computed(() => {
    // 节点类型
    if (nodeConfig.value.nodeName) {
      return nodeConfig.value.plugins
    } else {
      return flowSetting.value.plugins
    }
  })
</script>
<script lang="ts">
  export default {
    name: 'AbPlugins',
  }
</script>

<style lang="scss" scoped>
  .my-process-plugin {
    position: relative;
    display: grid;
    grid-template-rows: max-content auto;
    grid-template-columns: 100%;
    width: 100%;
    background-color: #fff;
    border-top: 5px solid #e6eef8;
    .my-process-plugin-header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 36px;
      padding: 0px 8px;
      background-color: #f8f8f8;
    }
    .my-process-plugin-content {
      overflow: hidden;
      .left-plus-list {
        box-sizing: border-box;
        height: 100%;
        overflow-y: scroll;
      }
      .left-plus-content {
        box-sizing: border-box;
        height: 100%;
        padding: 4px;
        overflow-y: scroll;
        border-left: 2px solid #eeeeee;
      }
    }
  }
  .plugins_item {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    padding: 0px 6px;
    cursor: pointer;
    border-bottom: 1px solid #f7f7f7;
    .plugin_left {
      display: flex;
      align-items: center;
      width: 85%;

      .left_icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: #eeeeee;
        border-radius: 14px;
      }
      .center_text {
        width: 78%;
        margin-left: 8px;
        overflow: hidden;
        font-size: 14px;
      }
    }
  }
  .plugins_item:hover {
    background: #f7f7f7;
  }
  .plus-item-bg {
    height: 250px;
    color: #eeeeee;
    background-color: #000;
  }
  .one_line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
