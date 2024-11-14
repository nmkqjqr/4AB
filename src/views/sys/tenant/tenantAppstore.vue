<template>
  <div v-loading="loading" class="common-layout">
    <el-header class="top-buttons">
      <el-button :icon="Back" @click="backRouter">返回</el-button>
    </el-header>
    <el-divider class="dividermar" />
    <div class="nav">
      <el-space :size="80">
        <el-button
          v-for="appType in info.appTypes"
          :key="appType.key"
          text
          :type="appType.key === info.activeTypeCode ? 'primary' : ''"
          @click="info.activeTypeCode = appType.key"
        >
          {{ appType.value }}
        </el-button>
      </el-space>
    </div>
    <el-divider />
    <ul v-if="apps.length" class="app-list">
      <li v-for="app in apps" :key="app.id" class="app-list-item">
        <a @click="forwardDetail(app.id)">
          <el-image
            fit="fill"
            :initial-index="4"
            :src="app.image[0]"
            style="width: 100%; height: 200px"
            :zoom-rate="1.2"
          />
          <h2>{{ app.name }}</h2>
        </a>
        <div>
          <el-tag type="danger">¥ {{ app.price.toFixed(2) }}</el-tag>
          <el-tag type="success">{{ app.typeName }}</el-tag>
        </div>
        <el-divider />
        <div v-if="app.allowInstall" class="buttons">
          <el-button
            v-if="!app.installed"
            type="primary"
            @click="appInstall(app)"
          >
            一键安装
          </el-button>
          <el-button v-if="app.installed" :disabled="true" type="primary">
            已安装
          </el-button>
        </div>
        <div v-else class="buttons">
          <el-button :disabled="true" type="primary">联系客服开放</el-button>
        </div>
      </li>
    </ul>
    <el-empty v-else description="无应用" />
  </div>
</template>
<script lang="ts" setup>
  import { Back } from '@element-plus/icons-vue'
  import { sysApi, postData, abTools, postForm } from '~/agilebpm'
  import { publicPath } from '~/src/config'

  const { proxy } = abTools.useCurrentInstance()

  const loading = ref<boolean>(false)

  const apps = computed(() => {
    if (info.activeTypeCode) {
      return info.apps.filter((item) => item.typeCode === info.activeTypeCode)
    } else {
      return info.apps
    }
  })

  const info = reactive<{
    apps: any[]
    appTypes: any[]
    activeTypeCode: string
    fetchData: () => void
    loading: boolean
  }>({
    apps: [],
    appTypes: [],
    activeTypeCode: '',
    loading: false,
    fetchData() {
      loading.value = true
      postData(sysApi.tenant.appstoreAppListUrl, {
        queryParam: {},
      })
        .then((resp) => {
          if (!resp.isOk) {
            backRouter()
            return
          }
          const { apps, appTypes } = resp.data
          apps.forEach((item: any) => {
            if (item.image) {
              item.image = item.image
                .split(',')
                .map(sysApi.sysFile.getViewFileUrl)
            } else {
              item.image = [`${publicPath}static/logo.png`]
            }
          })
          info.appTypes = [{ key: '', value: '全部' }, ...appTypes]
          info.apps = apps
        })
        .finally(() => (loading.value = false))
    },
  })

  const appInstall = (app: any) => {
    app.loading = true
    postForm(sysApi.tenant.appInstallUrl, { appId: app.appId })
      .then((resp) => {
        if (resp.isOk) {
          ElMessage.success('操作成功！')
          info.fetchData()
        } else {
          ElMessage.error('操作失败！')
        }
      })
      .finally(() => (app.loading = false))
  }

  const forwardDetail = (id: string) => {
    proxy.$router.push({
      name: 'TenantAppDetail',
      query: { id },
    })
  }

  const backRouter = () => {
    abTools.closeTab(proxy.$route.path)
    proxy.$router.back()
  }

  onMounted(() => info.fetchData())
</script>
<style lang="scss" scoped>
  .top-buttons {
    padding: 20px;
  }

  .nav {
    box-sizing: content-box;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 50px;
    margin-top: 20px;
  }

  .app-list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;

    .app-list-item {
      box-sizing: content-box;
      width: 300px;
      padding: 10px;
      margin: 10px;
      background-color: rgb(245 247 249);

      .buttons {
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
