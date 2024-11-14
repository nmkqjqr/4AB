<template>
  <div class="hall-header">
    <div class="hall-container clearFloat">
      <div class="logoName">
        <span class="logo">
          <el-image
            v-if="info.lightLogo && info.lightLogo.length > 0"
            :src="info.lightLogo"
            style="width: 50px; height: 50px"
          />
          <el-image
            v-else
            :src="require('@/assets/login_images/logo-small.png')"
            style="width: 50px; height: 50px"
          />
        </span>
        <span class="systemName">
          {{ info.systemName }}
        </span>
      </div>
      <div class="tabBox">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane name="first">
            <template #label>
              <img
                class="imageStyle"
                src="./style/img/banshidating.png"
                style="width: 16px"
              />
              <span class="titleStyle">办事大厅</span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="loginBtn">
        <el-button @click="toLogin">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { request, sysApi, abTools } from '~/agilebpm'
  const { proxy } = abTools.useCurrentInstance()
  const info: any = reactive({
    lightLogo: '',
    systemName: 'AgileBPM',
  })
  const toLogin = () => {
    proxy.$router.push({ path: '/login' })
  }
  const activeName = ref('first')
  // 获取资源个性化配置
  const getCompanyConfig = () => {
    request({
      url: sysApi.configuration.getCompanyConfig,
      method: 'get',
    }).then(
      ({ data }) => {
        if (data && data.length > 0) {
          const dataInfo = JSON.parse(data)
          if (JSON.parse(dataInfo.whiteLogo)[0]) {
            info.lightLogo = sysApi.sysFile.getViewFileUrl(
              JSON.parse(dataInfo.whiteLogo)[0].id
            )
          }
          if (dataInfo.systemName && dataInfo.systemName.length > 0) {
            info.systemName = dataInfo.systemName
          }
        }
      },
      () => {}
    )
  }
  getCompanyConfig()
</script>
<style lang="scss" scoped>
  @import './style/index.scss';
</style>
