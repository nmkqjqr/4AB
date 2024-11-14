<template>
  <!-- <el-form-item>
    <template #label>
      <div>
        格式化
        <el-tooltip
          class="box-item"
          content="请严格遵循日期格式化的大小写,例如: YYYY-MM-DD HH:mm:ss "
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-select v-model="data.dateMultiFormat" allow-create clearable filterable>
      <el-option key="YYYY" label="YYYY" value="YYYY" />
      <el-option key="YYYY-MM" label="YYYY-MM" value="YYYY-MM" />
      <el-option key="YYYY-MM-DD" label="YYYY-MM-DD" value="YYYY-MM-DD" />
      <el-option
        key="YYYY-MM-DD HH:mm"
        label="YYYY-MM-DD HH:mm"
        value="YYYY-MM-DD HH:mm"
      />
      <el-option
        key="YYYY-MM-DD HH:mm:ss"
        label="YYYY-MM-DD HH:mm:ss"
        value="YYYY-MM-DD HH:mm:ss"
      />
    </el-select>
  </el-form-item> -->
  <el-form-item>
    <template #label>
      <div>
        最小限制
        <el-tooltip
          class="box-item"
          content="选择表单中其他时间类型字段或手动输入"
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-select
      allow-create
      clearable
      filterable
      v-model="data.dateMultiMin"
      placeholder="请选择最小时间范围"
    >
      <el-option
        key="${currentDateTime}"
        label="当前时间"
        value="${currentDateTime}"
      />
      <el-option
        v-for="(column, index) in allSelect"
        :key="index"
        :label="column.name"
        :value="column.param"
      ></el-option>
    </el-select>
  </el-form-item>

  <el-form-item>
    <template #label>
      <div>
        最大限制
        <el-tooltip
          class="box-item"
          content="选择表单中其他时间类型字段或手动输入"
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-select
      clearable
      allow-create
      filterable
      v-model="data.dateMultiMax"
      placeholder="请选择最大时间范围"
    >
      <el-option
        key="${currentDateTime}"
        label="当前时间"
        value="${currentDateTime}"
      />
      <el-option
        v-for="(column, index) in allSelect"
        :key="index"
        :label="column.name"
        :value="column.param"
      ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item
    label="多选个数"
    prop="limit"
    :rules="[
      {
        pattern: '^([1-9]|[1-9]\\d|100)$',
        message: '个数最小为1，最大为100',
      },
    ]"
  >
    <el-input v-model="data.limit" />
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'ab-date-multi-config',
  }
</script>

<script lang="ts" setup>
  import _ from 'lodash'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { getDesign } from './dateUtil'
  //继承的属性data
  const props = defineProps({
    data: { type: Object, required: true },
    form: { type: Object, required: true },
  })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)

  data.value.dateMultiType = 'dates'

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

  console.log(rel)

  let currentTable = rel.currentTable

  //最大最小日期下拉框：时间类型（当前表，和主表）
  let allSelect = rel.allArr.filter(
    (s) =>
      s.code != data.value.code &&
      s.type == 'date' &&
      (s.table == currentTable.tableCode || s.table == bo.rel.tableCode)
  )

  //多选日期下拉框：时间类型（只有当前表，不包含主表）
  let currentSelect = rel.allArr.filter(
    (s) =>
      s.code != data.value.code &&
      s.table == currentTable.tableCode &&
      s.type == 'date'
  )

  data.value.objectMultiMapping = rel.objectMapping

  //默认格式化字符串
  if (!data.value.dateMultiFormat) {
    data.value.dateMultiFormat = 'YYYY-MM-DD'
  }
</script>
