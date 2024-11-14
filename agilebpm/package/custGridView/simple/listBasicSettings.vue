<template>
  <div>
    <el-form
      ref="formRef"
      class="demo-ruleForm formaStyle"
      label-position="right"
      label-width="90px"
      :model="info.data"
      :rules="rules"
    >
      <el-form-item label="名称" prop="name" v-if="!info.isAppSquare">
        <ab-pinyin
          v-model="info.data.name"
          v-model:to="info.data.code"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="编码" prop="code" v-if="!info.isAppSquare">
        <ab-code
          v-model="info.data.code"
          :disabled="info.isEdit && !info.iscopy"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="分类" prop="typeCode" v-if="!info.isAppSquare">
        <ab-select-tree
          v-model="info.data.typeCode"
          style="width: 200px"
          type-code="biz"
        />
      </el-form-item>
      <!-- 需要调接口 -->
      <el-form-item label="主键" prop="pkName" v-if="!info.isAppSquare">
        <el-select
          v-model="info.data.pkName"
          clearable
          placeholder="请选择"
          style="width: 200px"
        >
          <el-option
            v-for="item in info.data.fieldsList"
            :key="item.fieldName"
            :label="item.fieldDesc"
            :value="item.fieldName"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="info.data.gridType !== 'app' && !info.isAppSquare"
        label="数据源"
        prop="dsKey"
        :rules="[{ required: true, message: '必填' }]"
      >
        <ab-ds-selector v-model:ds-key="info.data.dsKey" width="200px" />
      </el-form-item>
      <el-form-item label="分页数量" prop="pageSize">
        <el-select
          v-model="info.data.pageSize"
          placeholder=""
          style="width: 200px"
          @change="changePageSize"
        >
          <el-option
            v-for="item in info.pageSizeList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否多选" prop="chooseType">
        <el-radio-group
          v-model="info.data.chooseType"
          size="small"
          style="width: 200px"
        >
          <el-radio-button :label="0">单选</el-radio-button>
          <!-- <el-radio-button :label="1">单选</el-radio-button> -->
          <el-radio-button :label="2">多选</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="默认查询" prop="initQuery">
        <el-radio-group
          v-model="info.data.initQuery"
          size="small"
          style="width: 200px"
        >
          <el-radio-button :label="0">否</el-radio-button>
          <el-radio-button :label="1">是</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="行号/序号" prop="showRowsNum">
        <el-radio-group
          v-model="info.data.showRowsNum"
          size="small"
          style="width: 200px"
        >
          <el-radio-button :label="0">否</el-radio-button>
          <el-radio-button :label="1">是</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="固定操作栏" prop="fixTool">
        <el-radio-group
          v-model="info.data.fixTool"
          size="small"
          style="width: 200px"
        >
          <el-radio-button :label="0">否</el-radio-button>
          <el-radio-button :label="1">是</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="操作栏宽度" prop="operationWidth">
        <el-slider
          v-model="info.data.operationWidth"
          :max="400"
          :min="50"
          show-stops
          :step="20"
          style="width: 200px; margin-left: 10px"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="status">
        <el-radio-group
          v-model="info.data.status"
          size="small"
          style="width: 200px"
        >
          <el-radio-button :label="0">否</el-radio-button>
          <el-radio-button :label="1">是</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { abDsSelector } from '@ab-core'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  const emit = defineEmits(['searchObjName', 'search', 'update:modelValue'])
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
  })
  const { proxy } = abTools.useCurrentInstance()
  const formRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    name: [
      {
        required: true,
        message: '必填',
        trigger: 'blur',
      },
    ],
    code: [
      { required: true, message: '必填' },
      { max: 50, message: '最多可输入50个字符' },
      {
        pattern: /^[a-zA-Z]\w*$/,
        message: '只能以字母开头,允许字母、数字和下划线',
      },
    ],
    typeCode: [
      {
        required: true,
        message: '必选',
        trigger: 'change',
      },
    ],
    pkName: [
      {
        required: true,
        message: '必选',
        trigger: 'change',
      },
    ],
  })

  const info: any = reactive({
    data: useVModel(props, 'modelValue', emit),
    pageSizeList: [5, 10, 20, 50, 100, 200, 500],
    isEdit: false,
    iscopy: proxy.$route.query.copy,
    isAppSquare:proxy.$route.name == 'CreateForm' ? true : false
  })
  if (info.data.extendConf) {
    const extendConf = JSON.parse(info.data.extendConf)
    if (extendConf.operationWidth) {
      info.data.operationWidth = extendConf.operationWidth
    } else {
      info.data.operationWidth = 220
    }
  }
  watch(
    () => [props.modelValue],
    (now, old) => {
      info.data = now[0]
    }
  )

  watch(
    () => info.data.dsKey,
    (val) => {
      emit('searchObjName')
    }
  )

  watch(
    () => info.data.code,
    (val, oldValue) => {
      info.data.sqlButtonVO.forEach((item: any) => {
        if (item.alias.indexOf(oldValue) !== -1) {
          item.alias = item.alias.replace(oldValue, '')
        }
        item.alias = val + item.alias
        if (item.url.indexOf('/ab-bpm/biz/bizCustGrid/view/export_') !== -1) {
          item.url = `/ab-bpm/biz/bizCustGrid/view/export_${val}`
        }
        if (item.url.indexOf('/ab-bpm/biz/bizCustGrid/view/import_') !== -1) {
          item.url = `/ab-bpm/biz/bizCustGrid/view/import_${val}`
        }
      })
    }
  )
  if (info.data.pkName.length <= 0) {
    info.data.pkName = info.data.fieldsList[0] ? info.data.fieldsList[0].fieldName : ''
  }
  if (proxy.$route.query.code && proxy.$route.query.code.length > 0 || proxy.$route.query.custGridId) {
    info.isEdit = true
  }

  const choosecslb = (list: any) => {
    if (list[0]) {
      info.data.relatedId = list[0].code_
      info.data.relatedName = list[0].name_
      // info.data.boCode = list[0].bo_code_
    } else {
      info.data.relatedId = ''
      info.data.relatedName = ''
    }
  }
  const changePageSize = (value: any) => {
    if (info.data.id && info.data.id.length > 0) {
      emit('search')
    }
  }

  defineExpose({ info })
</script>
<style lang="scss"></style>
