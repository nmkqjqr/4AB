<template>
  <div>
    <el-header class="top-buttons">
      <el-button :icon="Back" @click="backRouter">返回</el-button>
    </el-header>
    <el-divider class="dividermar" />
    <div v-loading="info.loading" class="common-layout">
      <div class="app-header">
        <div class="app-image">
          <el-carousel height="520px" indicator-position="outside">
            <el-carousel-item v-for="item in info.data.image" :key="item.id">
              <el-image
                fit="fill"
                :src="item.url"
                style="width: 100%; height: 520px"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="app-introce">
          <h1>
            {{ info.data.name }}
            <el-tag type="success">{{ info.data.typeName }}</el-tag>
          </h1>
          <p class="app-desc">
            {{ info.data.desc }}
          </p>
          <div class="app-price">¥ {{ info.data.price.toFixed(2) }}</div>
          <div v-if="info.data.allowInstall" class="app-button">
            <el-button
              v-if="!info.data.installed"
              type="primary"
              @click="installApp"
            >
              一键安装
            </el-button>
            <el-button v-else :disabled="true" type="primary">已安装</el-button>
          </div>
          <div v-else class="app-button">
            <el-button :disabled="true" type="primary">联系客服开放</el-button>
          </div>
        </div>
      </div>
      <el-divider />
      <el-scrollbar>
        <div class="app-detail" v-html="info.data.detail"></div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Back } from '@element-plus/icons-vue'
  import { sysApi, getData, abTools, postForm } from '~/agilebpm'
  import { publicPath } from '~/src/config'

  const { proxy } = abTools.useCurrentInstance()

  const appId = proxy.$route.query.id

  const info = reactive({
    data: {
      image: [] as any[],
      name: '',
      desc: '',
      price: 0,
      typeName: '',
      detail: '',
      allowInstall: false,
      installed: false,
    },
    loading: true,
  })

  const installApp = () => {
    info.loading = true
    postForm(sysApi.tenant.appInstallUrl, { appId })
      .then((resp) => {
        if (resp.isOk) {
          loadData()
          ElMessage.success('安装成功！')
        } else {
          ElMessage.success('安装失败！')
        }
      })
      .finally(() => (info.loading = false))
  }

  const backRouter = () => {
    abTools.closeTab(proxy.$route.path)
    proxy.$router.back()
  }

  const loadData = () => {
    info.loading = true
    getData(sysApi.tenant.appstoreGetAppUrl, { appId })
      .then((resp: any) => {
        if (resp.isOk) {
          const data = { ...resp.data }
          if (data.image) {
            data.image = data.image
              .split(',')
              .map((fileId: string, index: number) => ({
                id: index,
                url: sysApi.sysFile.getViewFileUrl(fileId),
              }))
          } else {
            data.image = [{ id: 1, url: `${publicPath}static/logo.png` }]
          }
          info.data = data
        }
      })
      .finally(() => (info.loading = false))
  }

  onMounted(() => {
    loadData()
  })
</script>
<style lang="scss" scoped>
  .common-layout {
    padding: 30px;
  }

  .top-buttons {
    padding: 20px;
  }

  .app-header {
    display: flex;

    .app-image {
      width: 40%;
      min-width: 660px;
    }
    .app-introce {
      width: 60%;
      margin-left: 30px;

      .app-desc {
        font-size: 1.3rem;
        text-overflow: clip;
      }

      .app-price {
        font-size: 1.8rem;
        font-weight: 700;
        color: #ff6700;
      }

      .app-button {
        margin-top: 20px;
      }
    }

    .app-detail {
      margin-top: 10px;
    }
  }
</style>
