<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="headerLeft">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="state.data.name"
            placement="bottom"
            v-if="state.appNameStrOrInput"
          >
            <p class="appName" @click="toggleName">
              <svg-icon :icon="state.data.icon" style="width: 34px" />
              <span>{{ state.data.name }}</span>
            </p>
          </el-tooltip>
          <p class="appName" v-else>
            <el-input
              ref="inputRef"
              v-model="state.data.name"
              style="width: 160px"
              placeholder="请输入"
              @blur="blurName"
            />
          </p>
          <!-- <span class="tag">
            <el-tag type="success">启用</el-tag>
          </span> -->
        </div>
        <div class="headerCenter">
          <el-tabs
            v-model="state.activeName"
            class="header-tabs"
            type="card"
            @tab-click="handleClick"
          >
            <el-tab-pane label="应用预览" name="appView"></el-tab-pane>
            <el-tab-pane label="应用设置" name="appSetting"></el-tab-pane>
            <el-tab-pane label="自动化流&触发器" name="third"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="headerRight">
          <el-button class="btn" @click="visit">访问</el-button>
        </div>
        <div></div>
      </el-header>
      <el-container>
        <el-aside
          width="240px"
          :style="{
            padding: state.activeName == 'appSetting' ? '0px' : '20px',
          }"
        >
          <div v-if="state.activeName == 'appView'">
            <TreeCreatSearch :menu="state.treeList" @click-node="clickNode"></TreeCreatSearch>
          </div>
          <div v-if="state.activeName == 'appSetting'">
            <AppSettingMenu @select-menu="settingMenuChange"></AppSettingMenu>
          </div>
        </el-aside>
        <el-main style="padding: 0">
          <div v-if="state.activeName == 'appView'">
            <AppView ref="appViewRef"></AppView>
          </div>
          <div v-if="state.activeName == 'appSetting'">
            <view v-if="state.settingMenu == 'baseInfo'">
              <AppSettingForm v-model="state.data"></AppSettingForm>
            </view>
            <view v-if="state.settingMenu == 'auth' && state.data?.id">
              <AppSettingAuth :project-id="state.data.id"></AppSettingAuth>
            </view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
  import { getData, postData } from '~/agilebpm/api/ab-request'
  import {
    getProjectUrl,
    saveProjectUrl,
  } from '~/agilebpm/api/modules/ab-appSquare/ab-appSquare-project'
  import { abTools } from '~/agilebpm'
  import { Search, Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import TreeCreatSearch from './tree-creat-search'
  import AppSettingMenu from './app-setting-menu.vue'
  import AppSettingForm from './app-setting-form.vue'
  import AppSettingAuth from './app-setting-auth.vue'
  import AppView from './app-view.vue'
  const { proxy } = abTools.useCurrentInstance()
  const state = reactive({
    data: {} as any,
    appNameStrOrInput: true,
    appName: '测试数据',
    activeName: 'appView',
    settingMenu: 'baseInfo',
  })

  const inputRef = ref(null)
  const appViewRef = ref(null)

  const getProject = () => {
    getData(getProjectUrl + proxy.$route.params.projectId)
      .then(
        ({ data }) => {
          state.data = data
        },
        () => {}
      )
      .catch(() => {})
  }
  getProject()

  const toggleName = () => {
    state.appNameStrOrInput = !state.appNameStrOrInput
    nextTick(() => {
      inputRef.value.focus()
    })
  }
  const blurName = () => {
    state.appNameStrOrInput = !state.appNameStrOrInput
    postData(saveProjectUrl, {
      id: proxy.$route.params.projectId,
      name: state.data.name,
    })
      .then(
        ({ msg }) => {},
        () => {}
      )
      .catch(() => {})
  }

  const settingMenuChange = (menuKey: any) => {
    state.settingMenu = menuKey
  }

  const visit = () => {
    if(!proxy.$route.params.id){
      ElMessage({
        message: '暂无可访问的页面',
        type: 'warning',
      })
      return
    }
    window.open(proxy.$router.resolve('/visitPage/'+ proxy.$route.params.projectId + '/' + proxy.$route.params.id).href, '_blank');
  }

  const clickNode = (node:any) => {
    appViewRef.value.getVo(node)
  }
</script>
<style lang="scss" scoped>
  .common-layout,
  .el-container {
    height: 100%;
  }
  .common-layout {
    .el-header {
      display: flex;
      align-items: center;
      justify-content: start;
      background: #fff;
      border-bottom: 1px solid #f6f8f9;
      .headerLeft {
        display: flex;
        align-items: center;
        justify-content: start;
        width: 33%;
        .tag {
          margin-left: 10px;
        }
      }
      .headerRight {
        display: flex;
        align-items: center;
        justify-content: end;
        width: 34%;
      }
      .appName {
        display: flex;
        align-items: center;
        justify-content: start;
        cursor: pointer;
        span {
          margin-left: 10px;
        }
      }
      :deep(.headerCenter) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 33%;
        .el-tabs {
          --el-tabs-header-height: 57px !important;
          .el-tabs__header {
            margin: 0 !important;
          }
        }
      }
    }
    .el-container {
      .el-aside {
        padding: 20px;
        background: #fff;
      }
    }
  }
  :deep(.header-tabs){
    .el-tabs__header{
      border: 0;
      .is-active{
        // background: #f8f8f8;
      }
    }
    >.el-tabs__header .el-tabs__nav,.el-tabs__item{
      border:0 !important;
    }
  }
</style>
