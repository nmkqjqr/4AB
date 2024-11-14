<template>
  <span>
    <el-form-item label="隐藏标头">
      <el-switch v-model="data.hideLable" />
    </el-form-item>
    <!-- <el-form-item label="上传样式">
      <el-radio-group
        v-model="data.listType"
        @change="() => (data.defaultValue = '')"
      >
        <el-radio label="text">文件</el-radio>
        <el-radio label="picture-card">图片</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item>
      <template #label>
        <div>
          <el-tooltip
            class="box-item"
            content="文字扫描需要先上传图片，对上传的图片指定附件分类"
            effect="dark"
            placement="top-start"
          >
            <el-icon style="width: 100%; font-style: normal">
              <QuestionFilled />
              附件分类：
            </el-icon>
          </el-tooltip>
        </div>
      </template>
      <tree-select
        v-model="data.uploadType"
        dic-code="fileType"
        placeholder="选择或输入默认值"
      />
    </el-form-item>

    <el-form-item label="识别类型" class="is-required">
      <el-select
        v-model="data.ocrType"
        @change="changeType"
        placeholder="请选择要识别的类型"
      >
        <el-option
          v-for="item in info.ocrType"
          :key="item.type"
          :label="item.desc"
          :value="item.type"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="识别配置" class="is-required">
      <el-button
        :icon="Plus"
        round
        size="small"
        type="primary"
        :disabled="!data.ocrType"
        @click="addParam"
      >
        添加
      </el-button>
    </el-form-item>

    <div class="myStyle" v-if="data.param && data.param.length > 0">
      <el-table
        :cell-style="cellStyle"
        :data="data.param"
        :header-cell-style="{ height: '10px' }"
        :row-key="rowKeyFunc"
        :row-style="cellStyle"
        style="padding: 0; margin-bottom: 40px"
      >
        <el-table-column align="center" label="识别参数">
          <template #default="{ row, $index }">
            <el-select
              clearable
              v-model="row.key"
              placeholder="请选择"
              @change="row.value = undefined"
            >
              <el-option
                v-for="item in info.ocrSupport"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="填充字段">
          <template #default="{ row }">
            <el-select clearable v-model="row.value" placeholder="请选择">
              <el-option
                v-for="item in filterArr(row)"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column width="35">
          <template #default="{ $index }">
            <el-button link type="danger">
              <el-icon :size="22" @click="() => data.param.splice($index, 1)">
                <Delete />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </span>
</template>

<script lang="ts">
  export default {
    name: 'ab-ocr-config',
  }
</script>

<script lang="ts" setup>
  import { Plus } from '@element-plus/icons-vue'
  import { sysApi } from '~/agilebpm'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import treeSelect from './component/treeSelect.vue'
  import { getDesign } from './dateUtil'
  //继承的属性data
  const props = defineProps({
    data: { type: Object, required: true },
    form: { type: Object, required: true },
  })
  const info = reactive({
    ocrType: [] as any[],
    ocrSupport: [] as any[],
  })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)
  // 类型类型下拉框
  sysApi.tools
    .getEnum('com.dstz.component.ai.enums.OcrTypeEnum', true)
    .then((rel) => {
      info.ocrType = rel.data
      if (data.value?.ocrType) {
        info.ocrSupport = rel.data.find(
          (s: any) => s.type == data.value.ocrType
        ).support
      }
    })

  const rowKeyFunc = (row: any) => row.key

  const cellStyle = () => {
    return {
      height: '40px',
      padding: '0',
    }
  }

  const changeType = () => {
    info.ocrSupport = info.ocrType.find(
      (s) => s.type == data.value.ocrType
    ).support
    if (data.value.param && data.value.param.length > 0) data.value.param = []
  }

  //是否是简式流程
  const isEasy =
    abTools.useCurrentInstance().proxy.$route.query.mode === 'diyBo'

  //简式流程获取bo的方法
  const jsonToBo = inject('jsonToBo') as any

  let bo: any
  if (isEasy) {
    bo = jsonToBo(props.form.isMb)
  } else {
    bo = window.getBo()
  }

  let rel = getDesign(bo, isEasy, data.value)
  let currentTable = rel.currentTable

  data.value.objectMapping = rel.objectMapping

  let allSelect = rel.allArr.filter(
    (s) =>
      s.code != data.value.code &&
      (s.table == currentTable.tableCode || s.table == bo.rel.tableCode)
  )

  const addParam = () => {
    if (!data.value.param || data.value.param.length == 0) {
      data.value.param = [
        {
          key: '',
          value: '',
        },
      ]
    } else {
      data.value.param.push({
        key: '',
        value: '',
      })
    }
  }

  const filterArr = (row: any) => {
    if (info.ocrSupport && info.ocrSupport.length > 0) {
      let arr = info.ocrSupport.find((s) => s.key == row.key)
      return allSelect.filter(
        (item: any) =>
          (!arr.cType || arr.cType.includes(item.cType)) &&
          (!arr.type || item.cType == 'tabs' || arr.type.includes(item.type))
      )
    }
  }
</script>

<style scoped lang="scss">
  :deep(.myStyle .el-table .cell) {
    padding: 0 !important;
  }
</style>
