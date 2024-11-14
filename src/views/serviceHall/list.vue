<template>
  <div
    class="hall"
    :style="{
      background: 'url(' + info.backgroundUrl + ') no-repeat center center',
      backgroundSize: '100% 100%',
    }"
  >
    <Header />
    <div class="hall-container">
      <div class="hall-title">
        <h3>{{ info.serviceHallData.tabsName }}办事</h3>
      </div>
      <div class="hallClass">
        <el-card class="box-card cardWidth100">
          <el-tabs
            v-model="info.activeType"
            class="demo-tabs"
            @tab-change="handleChange"
          >
            <el-tab-pane label="按主题分类" name="theme">
              <Table
                :active-type="info.activeType"
                :click-data="info.serviceClickData"
                :list="info.serviceHallData.theme"
              />
            </el-tab-pane>
            <el-tab-pane label="按部门分类" name="dept">
              <Table
                :active-type="info.activeType"
                :click-data="info.serviceClickData"
                :list="info.serviceHallData.dept"
              />
            </el-tab-pane>
            <el-tab-pane label="按标签分类" name="tag">
              <Table
                :active-type="info.activeType"
                :click-data="info.serviceClickData"
                :list="info.serviceHallData.tag"
              />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import Header from './header.vue'
  import Table from './table.vue'
  import { abTools } from '~/agilebpm'
  const { proxy } = abTools.useCurrentInstance()

  const info: any = reactive({
    activeType: '',
    serviceHallData: JSON.parse(localStorage.getItem('serviceHallData')),
    serviceClickData: JSON.parse(localStorage.getItem('serviceClickData')),
    backgroundUrl: require('./style/img/bg.png'),
  })
  info.activeType = info.serviceClickData.type == 'theme' ? 'theme' : 'dept'

  const handleChange = (value: any) => {}
</script>
<style lang="scss" scoped>
  @import './style/index.scss';
</style>
