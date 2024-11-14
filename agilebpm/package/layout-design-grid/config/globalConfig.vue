<template>
  <div class="tabs_main_padding">
    <el-form label-width="100px" :model="formCombination">
      <el-form-item
        label="页面名称："
        prop="name"
        :rules="{ required: true, message: '必填' }"
        v-if="!isAppSquare"
      >
        <ab-pinyin
          v-model="formCombination.name"
          v-model:to="formCombination.code"
        />
      </el-form-item>
      <el-form-item
        label="页面编码："
        prop="code"
        v-if="!isAppSquare"
        :rules="[
          { required: true, message: '必填' },
          { max: 50, message: '最多可输入50个字符' },
          {
            pattern: /^[a-zA-Z]\w*$/,
            message: '只能以字母开头,允许字母、数字和下划线',
          },
        ]"
      >
        <ab-code
          v-model="formCombination.code"
          :disabled="!!formCombination.id"
        />
      </el-form-item>
      <el-form-item
        label="字典分类："
        prop="typeCode"
        :rules="[{ required: true, message: '必填' }]"
        v-if="!isAppSquare"
      >
        <ab-select-tree v-model="formCombination.typeCode" width="210px" type-code="biz" />
      </el-form-item>
      <el-form-item label="描述：" prop="desc">
        <el-input v-model="formCombination.desc" type="textarea" />
      </el-form-item>
      <el-form-item label="设计备注：">
        <el-input
          v-model="formCombination.designJson.designDesc"
          rows="6"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="样式风格：">
        <el-button text type="primary" @click="drawer = true">设置</el-button>
      </el-form-item>
    </el-form>
    <br />
    <el-divider content-position="center">约定全局联动参数</el-divider>
    <el-form label-position="top">
      <el-form-item>
        <el-table :data="params">
          <el-table-column label="参数名" prop="name">
            <template #default="{ row }">
              <el-input
                v-model="row.name"
                @change="changeParams($event, row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="值" prop="value">
            <template #default="{ row, column, $index }">
              <el-select
                v-model="row.value"
                allow-create
                clearable
                default-first-option
                filterable
                placeholder="手输固定值"
                :reserve-keyword="false"
              >
                <el-option label="URL 参数" value="${urlParam}" />
                <el-option label="当前用户ID" value="${currentUserId}" />
                <el-option label="当前用户账户" value="${currentUserAccount}" />
                <el-option label="当前组织ID" value="${currentOrgId}" />
                <el-option label="当前组织编码" value="${currentOrgCode}" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="55">
            <template #default="{ row, column, $index }">
              <el-icon :size="22" @click="params.splice($index, 1)">
                <Delete />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
        <el-button text type="primary" @click="params.push({})">添加</el-button>
        <el-alert
          :closable="false"
          title="约定页面可用的交互参数，这些参数会从系统默认值、URL上取值，
        也支持在某个组件中设置值，那么监听了该值的组件就会联动加载。"
          type="info"
        />
      </el-form-item>
      <el-form-item label="SQL扩充参数">
        <el-input
          v-model="formCombination.designJson.paramsExpandSql"
          rows="6"
          type="textarea"
        />
      </el-form-item>
      <watch-params-setting
        :config="formCombination.designJson"
        :form-combination="props.formCombination"
        label="SQL参数联动"
      />
      <el-alert
        :closable="false"
        title="SQL仅允许返回一条数据，以属性Map形式扩充当前联动参数，支持使用URL参数作为变量，支持联动参数触发二次更新。如：select * from org_user where id_ = {userId}"
        type="info"
      />
    </el-form>
    <StyleConfig
      :config="formCombination.designJson"
      :drawer="drawer"
      @close-drawer="closeDrawer"
    />
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import { Delete } from '@element-plus/icons-vue'
  import watchParamsSetting from './watchParamsSetting.vue'
  import StyleConfig from './styleConfig.vue'
  import { abTools } from '~/agilebpm'
  const props = defineProps({
    formCombination: {
      required: true,
      type: Object as PropType<FormCombination>,
    },
  })

  const { proxy } = abTools.useCurrentInstance()

  const isAppSquare = proxy.$route.name == 'CreateLayout' ? true : false

  const drawer = ref(false)

  const { params } = toRefs(props.formCombination.designJson)

  // if (!props.formCombination.typeCode) {
  //   props.formCombination.typeCode = 'mrfl'
  // }

  const changeParams = (value: any, row: any) => {
    if (!row.value) {
      row.value = ''
    }
  }
  const closeDrawer = () => {
    drawer.value = false
  }
</script>

<style lang="scss" scoped></style>
