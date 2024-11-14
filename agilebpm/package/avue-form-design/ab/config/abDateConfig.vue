<template>
  <el-form-item label="日期类型">
    <el-select
      v-model="data.dateType"
      placeholder="请选择日期类型"
      @change="changeDateFormat"
    >
      <el-option label="年" value="year" />
      <el-option label="年月" value="month" />
      <el-option label="年月日" value="date" />
      <el-option label="年月日时分秒" value="datetime" />
    </el-select>
  </el-form-item>
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
    <el-select v-model="data.dateFormat" allow-create clearable filterable>
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
      v-model="data.dateMin"
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
      allow-create
      clearable
      filterable
      v-model="data.dateMax"
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

  <el-form-item>
    <template #label>
      <div>
        默认值
        <el-tooltip
          class="box-item"
          content="当前时间并非设计阶段的当前时间, 而是指表单首次使用时的时间"
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-select
      v-model="data.defaultValue"
      allow-create
      clearable
      filterable
      placeholder="选择或输入默认值"
    >
      <el-option
        key="${currentDateTime}"
        label="当前时间"
        value="${currentDateTime}"
      />
    </el-select>
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'ab-date-config',
  }
</script>

<script lang="ts" setup>
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
  let allSelect = rel.allArr.filter(
    (s) =>
      s.code != data.value.code &&
      s.type == 'date' &&
      (s.table == currentTable.tableCode || s.table == bo.rel.tableCode)
  )



  //联动更新格式
  const changeDateFormat = (value: string) => {
    data.value.dateFormat = getDateFormat(value)
  }

  //获取格式
  const getDateFormat = (value: string) => {
    switch (value) {
      case 'year':
        return 'YYYY'
      case 'month':
      case 'monthrange':
        return 'YYYY-MM'
      case 'datetime':
      case 'datetimerange':
        return 'YYYY-MM-DD HH:mm:ss'
      default:
        return 'YYYY-MM-DD'
    }
  }

  // watch(
  //   () => data.value.defaultValue,
  //   (newVal) => {
  //     console.log('data.value.defaultValue,', data.value.defaultValue)
  //   },
  //   { deep: true, immediate: true }
  // )
</script>
