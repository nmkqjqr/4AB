<template>
  <el-form-item label="日期类型">
    <el-select
      v-model="data.dateRangeType"
      placeholder="请选择日期类型"
      @change="changeDateFormat"
    >
      <el-option label="年月" value="monthrange" />
      <el-option label="年月日" value="daterange" />
      <el-option label="年月日时分秒" value="datetimerange" />
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
    <el-select v-model="data.dateRangeFormat" allow-create clearable filterable>
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
      filterable
      clearable
      v-model="data.dateRangeMin"
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
      v-model="data.dateRangeMax"
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

  <el-form-item class="is-required" label="结束字段">
    <el-select
      v-model="data.valueRangeMapping"
      placeholder="请选择结束时间对应的字段"
    >
      <el-option
        v-for="(column, index) in currentSelect"
        :key="index"
        :label="column.name"
        :value="column.code"
      ></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="统计数量">
    <el-switch v-model="data.isStatistics" />
  </el-form-item>
  <span v-if="data.isStatistics">
    <el-form-item label="统计类型">
      <template #label>
        <div>
          统计类型
          <el-tooltip
            class="box-item"
            content="统计类型如果为小时，并且时间类型为日期带时分秒则直接统计两个区间的小时，不考虑每天/工作时"
            effect="dark"
            placement="top-start"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-select
        v-model="data.statisticsType"
        placeholder="请选择统计类型"
        clearable
      >
        <el-option key="hour" label="小时" value="hour" />
        <el-option key="day" label="天数" value="day" />
        <el-option key="month" label="月数" value="month" />
      </el-select>
    </el-form-item>

    <el-form-item
      label="工时/天"
      v-if="
        data.statisticsType == 'hour' && data.dateRangeType != 'datetimerange'
      "
    >
      <el-select v-model="data.dayHourCount" placeholder="请选择每天工作小时数">
        <el-option
          v-for="(column, index) in 24"
          :key="index + 1"
          :label="index + 1"
          :value="index + 1"
        ></el-option>
      </el-select>
    </el-form-item>
    <span
      v-if="
        data.statisticsType == 'day' ||
        (data.statisticsType == 'hour' && data.dateRangeType != 'datetimerange')
      "
    >
      <el-form-item label="计算方式">
        <template #label>
          <div>
            计算方式
            <el-tooltip
              class="box-item"
              content=" 日期类型为天数时，统计工作日可为半天。
                      开始时间：12点后当天为0.5天，18点后不算天数
                      结束时间：08点前不算天数，14点前当天为0.5天"
              effect="dark"
              placement="top-start"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-radio-group v-model="data.dayNumberType">
          <el-radio key="allDay" label="allDay">所有日</el-radio>
          <el-radio key="workDay" label="workDay">工作日</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="data.dayNumberType == 'workDay'">
        <template #label>
          <div>
            假期系统
            <el-tooltip
              class="box-item"
              content="不同假期系统定义的节假日可能不同，导致工作日天数也会不同。"
              effect="dark"
              placement="top-start"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <tree-select
          clearable
          style="width: 270px"
          v-model="data.dayNumberTypeDict"
          dic-code="holidaySystemType"
        />
      </el-form-item>
    </span>
    <el-form-item label="统计字段" class="is-required" v-if="data.isStatistics">
      <el-select
        v-model="data.dayNumberColumn"
        placeholder="请选择统计字段"
        clearable
      >
        <el-option
          v-for="(column, index) in dayCurrentSelect"
          :key="index"
          :label="column.name"
          :value="column.code"
        ></el-option>
      </el-select>
    </el-form-item>
  </span>
</template>

<script lang="ts">
  export default {
    name: 'ab-date-range-config',
  }
</script>

<script lang="ts" setup>
  import treeSelect from './component/treeSelect.vue'
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

  //下拉框数据（只有当前表，不包含主表）
  let dayCurrentSelect = rel.allArr.filter(
    (s) =>
      s.code != data.value.code &&
      s.table == currentTable.tableCode &&
      s.type == 'number'
  )

  data.value.objectRangeMapping = rel.objectMapping

  //默认格式化字符串
  if (!data.value.dateRangeFormat) {
    data.value.dateRangeFormat = 'YYYY-MM-DD'
  }
  //默认date为日期类型
  if (!data.value.dateRangeType) {
    data.value.dateRangeType = 'daterange'
  }

  //默认计算方式
  if (!data.value.dayNumberType) {
    data.value.dayNumberType = 'allDay'
  }

  //默认统计类型
  if (!data.value.statisticsType) {
    data.value.statisticsType = 'day'
  }

  //默认是否统计
  if (!data.value.isStatistics) {
    data.value.isStatistics = false
  }

  //默认天数/小时
  if (!data.value.dayHourCount) {
    data.value.dayHourCount = 8
  }

  //联动更新格式
  const changeDateFormat = (value: string) => {
    data.value.dateRangeFormat = getDateFormat(value)
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
</script>
