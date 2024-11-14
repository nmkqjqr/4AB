<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="TenantMgrList"
        edit-refresh
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.tenant.saveUrl"
      />
      <ab-load v-model="info.data" :url="`${sysApi.tenant.getUrl}?id=`" />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="180px"
          :model="info.data"
        >
          <el-form-item
            label="名称"
            prop="name"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.name" placeholder="名称" />
          </el-form-item>
          <el-form-item
            label="别名"
            prop="alias"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.alias" placeholder="别名" />
          </el-form-item>

          <el-form-item
            label="隔离模式"
            prop="isolationMode"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-radio-group
              v-model="info.data.isolationMode"
              @change="changeIsolationMode"
            >
              <el-radio label="logic">逻辑隔离</el-radio>
              <el-radio label="physics">物理隔离</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="数据源"
            prop="datasourceAlias"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="dataSourceDisplayName" :disabled="true">
              <template #append>
                <ab-cust-dialog
                  v-model="info.data.datasourceAlias"
                  dialog-key="dataSourceSelector"
                  :dialog-setting="{ multiple: 0 }"
                  type="primary"
                  @ok="setDataSource"
                >
                  选择
                </ab-cust-dialog>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="到期日"
            prop="expireDay"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-date-picker
              v-model="info.data.expireDay"
              format="YYYY-MM-DD"
              placeholder="到期日"
              size="large"
              type="date"
            />
          </el-form-item>
          <el-form-item
            label="状态"
            prop="status"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-radio-group v-model="info.data.status" class="ml-4">
              <el-radio label="enabled" size="large">启用</el-radio>
              <el-radio label="disabled" size="large">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-divider />
          <!-- 
          <el-tabs v-model="info.activeName">
            <el-tab-pane label="属性" name="properties">
              <el-form-item
                v-for="(item, index) in info.data.properties"
                :key="item.name"
                :label="item.desc"
                :prop="`properties[${index}].value`"
                :rules="item.validRule"
              >
                <el-input v-model="item.value" :placeholder="item.desc" />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="配额" name="quota">
              <el-form-item
                v-for="(item, index) in info.data.quotas"
                :key="item.key"
                :label="item.desc"
                :prop="`quotas[${index}].maximum`"
              >
                <el-input-number
                  v-model="item.maximum"
                  :min="-1"
                  :placeholder="item.desc"
                />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          -->
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>
<script lang="ts" setup>
  import { FormInstance } from 'element-plus'
  import { sysApi } from '~/agilebpm'

  const formRef = ref<FormInstance>()

  const info = reactive({
    data: {
      name: '',
      alias: '',
      isolationMode: 'physics',
      datasourceAlias: '',
      datasourceName: '',
      expireDay: '',
      properties: {},
      quotas: {},
      status: 'disabled',
    },
    activeName: 'properties',
  })

  /**
   * 数据源显示名称
   */
  const dataSourceDisplayName = computed(() => {
    const data = info.data
    if (!data.datasourceAlias || !data.datasourceName) {
      return ''
    }
    return `${data.datasourceName}（${data.datasourceAlias}）`
  })

  /**
   * 设置数据源
   * @param dataList 数据列表
   */
  function setDataSource(dataList: any[]) {
    if (dataList) {
      const { name, alias } = dataList[0]
      info.data.datasourceAlias = alias
      info.data.datasourceName = name
    }
  }

  /**
   * 清理数据源
   */
  function changeIsolationMode() {
    const data = info.data
    if (data.isolationMode == 'logic') {
      data.datasourceAlias = 'datasourceDefault'
      data.datasourceName = '默认数据源'
    } else {
      data.datasourceAlias = ''
      data.datasourceName = ''
    }
  }
</script>
