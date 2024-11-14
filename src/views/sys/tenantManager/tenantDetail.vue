<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-load v-model="info.data" :url="`${sysApi.tenant.getUrl}?id=`" />
      <el-button :icon="Back" type="primary" @click="backPage">返回</el-button>
    </el-header>
    <el-divider class="dividermar" />
    <el-main style="margin-top: 10px">
      <div>
        <el-descriptions border :column="3" title="租户信息">
          <el-descriptions-item align="center" label="名称" label-align="right">
            {{ info.data.name }}
          </el-descriptions-item>
          <el-descriptions-item
            align="center"
            label="隔离模式"
            label-align="right"
          >
            <el-tag>
              {{
                info.data.isolationMode === 'logic' ? '逻辑隔离' : '物理隔离'
              }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            align="center"
            label="数据源别名"
            label-align="right"
          >
            <el-tag>{{ info.data.datasourceAlias }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item align="center" label="状态" label-align="right">
            <el-tag>
              {{ info.data.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            align="center"
            label="到期日"
            label-align="right"
          >
            {{ info.data.expireDay }}
          </el-descriptions-item>
          <el-descriptions-item
            align="center"
            label="创建时间"
            label-align="right"
          >
            {{ info.data.createTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!--
      <div style="margin-top: 20px">
        <el-descriptions border title="租户属性">
          <el-descriptions-item
            v-for="item in info.data.properties"
            :key="item.name"
            align="center"
            :label="item.desc"
          >
            {{ item.value }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div style="margin-top: 20px">
        <el-descriptions border title="租户配额">
          <el-descriptions-item
            v-for="item in info.data.quotas"
            :key="item.key"
            align="center"
            :label="`${item.desc}（已使用/最大限制）`"
          >
            {{ item.used }}/{{ item.maximum }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      -->
    </el-main>
  </el-container>
</template>
<script lang="ts" setup>
  import { Back } from '@element-plus/icons-vue'
  import { sysApi, abTools } from '~/agilebpm'
  const { proxy } = abTools.useCurrentInstance()

  const info = reactive({
    data: {
      name: '',
      isolationMode: '',
      datasourceAlias: '',
      status: '',
      expireDay: '',
      createTime: '',
      properties: [] as any[],
      quotas: [] as any[],
    },
    propertiesInfo: [],
    quotaInfos: [],
  })

  function backPage() {
    abTools.closeTab(proxy.$route.path)
    proxy.$router.push({
      name: 'TenantMgrList',
    })
  }
</script>
