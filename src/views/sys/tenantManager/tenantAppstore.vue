<template>
  <div class="common-layout">
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
      <li
        v-for="app in apps"
        :key="app.id"
        v-loading="app.loading"
        class="app-list-item"
      >
        <a @click="forwardDetail(app.id)">
          <el-image
            fit="fill"
            :initial-index="4"
            :src="app.images[0].url"
            style="width: 100%; height: 200px"
            :zoom-rate="1.2"
          />
          <h2>{{ app.name }}</h2>
        </a>
        <div>
          <el-tag type="danger">¥ {{ app.price.toFixed(2) }}</el-tag>
          <el-tag type="success">{{ app.typeName }}</el-tag>
          <el-tag v-if="!app.isOpen">内部安装</el-tag>
        </div>
        <el-divider />
        <div class="buttons">
          <el-button
            v-if="app.isOpen && !app.appstoreId"
            type="primary"
            @click="addAppToTenant(app)"
          >
            授权给租户
          </el-button>
          <el-button
            v-if="app.isOpen && app.appstoreId && !app.installed"
            type="primary"
            @click="removeAppToTenant(app)"
          >
            取消授权给租户
          </el-button>
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

  const tenantId = proxy.$route.query.id

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
    appTypes: [{ key: '', value: '全部' }],
    activeTypeCode: '',
    loading: false,
    fetchData() {
      postData(sysApi.tenant.appstoreAppListUrl, {
        queryParam: { tenantId },
      }).then((resp) => {
        if (!resp.isOk) {
          backRouter()
          return
        }
        const { apps, appTypes } = resp.data
        apps.forEach((item: any) => {
          if (item.image) {
            item.images = item.image
              .split(',')
              .map((fileId: string, index: number) => ({
                id: index,
                url: sysApi.sysFile.getViewFileUrl(fileId),
              }))
            delete item['image']
          } else {
            item.images = [{ id: 1, url: `${publicPath}static/logo.png` }]
          }
        })
        info.apps = apps
        info.appTypes = [{ key: '', value: '全部' }, ...appTypes]
      })
    },
  })

  const forwardDetail = (id: string) => {
    proxy.$router.push({
      name: 'TenantMgrAppDetail',
      query: { id, tenantId },
    })
  }

  const addAppToTenant = (app: any) => {
    app.loading = true
    postForm(sysApi.tenant.appstoreAddAppUrl, { appId: app.id, tenantId })
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

  const removeAppToTenant = (app: any) => {
    app.loading = true
    postForm(sysApi.tenant.appstoreRemoveAppUrl, { appId: app.id, tenantId })
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

  const appInstall = (app: any) => {
    app.loading = true
    postForm(sysApi.tenant.appInstallUrl, { appId: app.id, tenantId })
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
  const backRouter = () => {
    abTools.closeTab(proxy.$route.path)
    proxy.$router.back()
  }

  onMounted(() => {
    info.fetchData()
  })
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
