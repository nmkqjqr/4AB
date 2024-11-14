<template>
  <div class="afd-config-form">
    <el-form
      label-position="right"
      label-suffix="："
      label-width="100px"
      :model="data"
    >
      <el-form-item
        label="分类"
        v-if="!data.isMb && !info.isWf && !info.isAppsquareForm"
        prop="typeCode"
        :rules="[{ required: true, message: '必填' }]"
      >
        <ab-select-tree
          v-model="data.typeCode"
          :operation="false"
          type-code="biz"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item
        label="名称"
        v-if="!data.isMb && !info.isWf && !info.isAppsquareForm"
        prop="name"
        :rules="[{ required: true, message: '必填' }]"
      >
        <ab-pinyin
          v-model="data.name"
          v-model:to="data.code"
          placeholder="请输入名称"
          maxlength="100"
          show-word-limit
          :type="2"
        />
      </el-form-item>
      <el-form-item
        label="编码"
        v-if="!data.isMb && !info.isWf && !info.isAppsquareForm"
        prop="code"
        :rules="[{ required: true, message: '必填' }]"
      >
        <ab-code
          v-model="data.code"
          :disabled="!!$route.query.id"
          placeholder="请输入编码"
          :maxlength="isOracle ? 20 : 40"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="data.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="表单模式" v-if="!data.isMb">
        <el-select v-model="data.formMode">
          <el-option
            v-for="val in info.BizFormDesignFormMode"
            :key="val.key"
            :label="val.desc"
            :value="val.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="!data.isMb && ['pc', 'compate', 'both'].includes(data.formMode)"
        label="电脑端模板"
        prop="pcTemplateCode"
      >
        <el-select v-model="data.pcTemplateCode">
          <el-option
            v-for="val in info.BizFormTemplateList.filter(
              (item) => item.formType == 'pc'
            )"
            :key="val.code"
            :label="val.name"
            :value="val.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="data.isMb || ['mobile', 'compate'].includes(data.formMode)"
        label="手机端模板"
        prop="mbTemplateCode"
      >
        <el-select v-model="data.mbTemplateCode">
          <el-option
            v-for="val in info.BizFormTemplateList.filter(
              (item) => item.formType == 'mobile'
            )"
            :key="val.code"
            :label="val.name"
            :value="val.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="标签宽度"
        prop="labelWidth"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input-number
          v-model="data.labelWidth"
          :min="90"
          :step="5"
          controls-position="right"
          placeholder="请输入标签默认宽度"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="标签后缀" prop="labelWidth">
        <el-input
          v-model="data.labelSuffix"
          controls-position="right"
          placeholder="请输入标签后缀"
        ></el-input>
      </el-form-item>
      <el-form-item label="默认占位符" prop="defaultPlaceholder">
        <el-switch
          v-model="data.defaultPlaceholder"
          inline-prompt
          active-text="显示"
          inactive-text="隐藏"
        />
      </el-form-item>
      <el-form-item label="只读input框" prop="readonlyShowText">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="流程权限为只读时，不显示控件，只显示文本"
          placement="top-start"
        >
          <el-switch
            v-model="data.readonlyShowText"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="国际化" prop="international">
        <el-tooltip class="box-item" effect="dark" placement="top-start">
          <template #content>
            表单保存时会异步生成国际化
            <br />
            可能需要花费几分钟后才会生效
            <br />
            生成后可以去【翻译管理】模块修改
          </template>
          <el-switch
            v-model="data.international"
            inline-prompt
            active-text="开启"
            inactive-text="关闭"
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="默认字段" prop="defaultColumn" v-if="!info.isBo">
        <el-tooltip class="box-item" effect="dark" placement="top-start">
          <template #content>
            开启后，【业务实体】会默认增加以下字段：
            <br />
            创建人、创建时间、创建所在组织、更新人、更新时间
          </template>
          <el-switch
            v-model="data.defaultColumn"
            inline-prompt
            active-text="开启"
            inactive-text="关闭"
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="默认栅格">
        <el-slider
          v-model="data.span"
          :max="24"
          :min="4"
          show-stops
          :step="2"
          style="width: 90%"
        />
        <el-radio-group v-model.number="data.span">
          <el-radio-button label="24">一列</el-radio-button>
          <el-radio-button label="12">两列</el-radio-button>
          <el-radio-button label="8">三列</el-radio-button>
          <el-radio-button label="6">四列</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="修改栅格">
        <el-slider
          v-model="info.span"
          :max="24"
          :min="4"
          show-stops
          :step="2"
          style="width: 90%"
          @change="setSpan"
        />
        <el-radio-group v-model.number="info.span" @change="setSpan">
          <el-radio-button label="24">一列</el-radio-button>
          <el-radio-button label="12">两列</el-radio-button>
          <el-radio-button label="8">三列</el-radio-button>
          <el-radio-button label="6">四列</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <buttonCustom :data="data"></buttonCustom>
    <table-plugins :option="data" :form="data"></table-plugins>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus'
  import { Edit } from '@element-plus/icons-vue'
  import { sysApi, bizApi } from '@agilebpm/api'
  import tablePlugins from './tablePlugins.vue'
  import buttonCustom from './buttonCustom.vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'

  const props = defineProps({
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    isOracle: {
      type: Boolean,
      default: false,
    },
  })

  const info = reactive({
    span: 12,
    BizFormDesignFormMode: {},
    BizFormTemplateList: [],
    isWf: false,
    isAppsquareForm: false,
    isBo: abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo',
  })

  onMounted(() => {
    sysApi.tools
      .getEnum('com.dstz.biz.api.constant.BizFormDesignFormMode', true)
      .then((resp) => {
        info.BizFormDesignFormMode = resp.data
      })

    bizApi.formTemplate.getAll().then(({ data }) => {
      info.BizFormTemplateList = data.rows
    })
    info.isWf = inject('isWf')
    info.isAppsquareForm = inject('isAppsquareForm')
  })

  const setSpan = () => {
    props.data.column.forEach((c) => {
      if (!c.fixSpan) {
        c.span = info.span
      }
    })
    ElMessage({
      message: '修改栅格成功',
      type: 'success',
    })
  }
</script>
<style lang="scss" scoped>
  .afd-config-form {
    padding: 10px 0 0 0;
  }
</style>
