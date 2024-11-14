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
            <el-carousel-item v-for="item in info.data.images" :key="item.id">
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
            <el-tag v-if="!info.data.isOpen">内部安装</el-tag>
          </h1>
          <p class="app-desc">
            {{ info.data.desc }}
          </p>
          <div class="app-price">¥ {{ info.data.price.toFixed(2) }}</div>
          <div v-if="tenantId" class="app-button">
            <el-button
              v-if="info.data.isOpen && !info.data.appstoreId"
              type="primary"
              @click="addApp"
            >
              授权给租户
            </el-button>
            <el-button
              v-if="
                info.data.isOpen && info.data.appstoreId && !info.data.installed
              "
              type="primary"
              @click="removeApp"
            >
              取消授权给租户
            </el-button>
            <el-button
              v-if="!info.data.installed"
              type="primary"
              @click="installApp"
            >
              一键安装
            </el-button>
            <el-button
              v-if="info.data.installed"
              :disabled="true"
              type="primary"
            >
              已安装
            </el-button>
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
  const tenantId = proxy.$route.query.tenantId || ''

  const info = reactive({
    data: {
      images: [] as any[],
      name: '',
      desc: '',
      price: 0,
      typeName: '',
      detail: '',
      isOpen: 0,
      appstoreId: '',
      installed: false,
    },
    loading: true,
  })

  const addApp = () => {
    info.loading = true
    postForm(sysApi.tenant.appstoreAddAppUrl, { appId, tenantId })
      .then((resp) => {
        if (resp.isOk) {
          ElMessage.success('添加成功！')
          loadData()
        } else {
          ElMessage.error('添加失败！')
        }
      })
      .finally(() => (info.loading = false))
  }

  const removeApp = () => {
    info.loading = true
    postForm(sysApi.tenant.appstoreRemoveAppUrl, { appId, tenantId })
      .then((resp) => {
        if (resp.isOk) {
          ElMessage.success('取消成功！')
          loadData()
        } else {
          ElMessage.success('取消失败！')
        }
      })
      .finally(() => (info.loading = false))
  }

  const installApp = () => {
    info.loading = true
    postForm(sysApi.tenant.appInstallUrl, { appId, tenantId })
      .then((resp) => {
        if (resp.isOk) {
          ElMessage.success('安装成功！')
          loadData()
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
    getData(sysApi.tenant.appstoreGetAppUrl, { appId, tenantId })
      .then((resp) => {
        const app: any = resp.data
        if (app.image) {
          app.images = app.image.split(',').map((s: string, index: number) => ({
            id: index,
            url: sysApi.sysFile.getViewFileUrl(s),
          }))
        } else {
          app.images = [{ id: 1, url: `${publicPath}static/logo.png` }]
        }
        delete app.image
        info.data = app
      })
      .finally(() => (info.loading = false))
  }

  onMounted(() => loadData())
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
