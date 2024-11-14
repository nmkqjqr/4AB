<template>
  <el-form-item>
    <template #label>
      <div>
        <el-tooltip
          class="box-item"
          content="扫码后会在扫码按钮下方展示返回的扫码值，是否对其隐藏"
          effect="dark"
          placement="top-start"
        >
          <el-icon style="width: 100%; font-style: normal">
            <QuestionFilled />
            隐藏码值：
          </el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-switch v-model="data.hideScanValue" />
  </el-form-item>
  <el-form-item v-if="!data.hideScanValue">
    <template #label>
      <div>
        <el-tooltip
          class="box-item"
          content="若允许修改返的扫码值，则展现形式将会使用输入框展示，可以二次修改"
          effect="dark"
          placement="top-start"
        >
          <el-icon style="width: 100%; font-style: normal">
            <QuestionFilled />
            修改码值：
          </el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-switch v-model="data.allowModification" />
  </el-form-item>
  <el-form-item>
    <template #label>
      <div>
        <el-tooltip
          class="box-item"
          content="（非必填）对于部分扫码枪硬件，用于调用扫码时的传参，用来确认业务数据提供的额外参数，可以是表单字段，也可以手动输入"
          effect="dark"
          placement="top-start"
        >
          <el-icon style="width: 100%; font-style: normal">
            <QuestionFilled />
            扫码参数：
          </el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-select
      clearable
      allow-create
      filterable
      v-model="data.scanColumn"
      placeholder="请选择要发送的验证码字段"
    >
      <el-option
        v-for="(column, index) in allSelect"
        :key="index"
        :label="column.name"
        :value="column.code"
      ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <template #label>
      <div>
        <el-tooltip
          class="box-item"
          content="（非必填）扫码后返回扫码值时，需要同步执行的js方法名称"
          effect="dark"
          placement="top-start"
        >
          <el-icon style="width: 100%; font-style: normal">
            <QuestionFilled />
            后置事件：
          </el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-input v-model="data.afterEvent" />
  </el-form-item>
  <el-form-item>
    <template #label>
      <div>
        <el-tooltip
          class="box-item"
          content="按照指定的模板执行自定义事件，支持自由传参，以及对扫码值结果进行改造或增强"
          effect="dark"
          placement="top-start"
        >
          <el-icon style="width: 100%; font-style: normal">
            <QuestionFilled />
            模板事件：
          </el-icon>
        </el-tooltip>
      </div>
    </template>
    <el-button
      type="primary"
      :icon="Edit"
      round
      size="small"
      @click="info.dialogVisible = true"
    >
      配置
    </el-button>
  </el-form-item>
  <el-dialog
    @closed="dialogFn"
    style="width: 400px"
    v-model="info.dialogVisible"
    title="模板事件配置"
  >
    <el-form :model="info" label-width="120px" label-suffix="：">
      <el-form-item label="开启事件">
        <el-switch v-model="info.tempEnable" />
      </el-form-item>

      <el-form-item v-if="info.tempEnable" class="is-required">
        <template #label>
          <div>
            <el-tooltip
              class="box-item"
              content="指提前在代码中定义好的方法"
              effect="dark"
              placement="top-start"
            >
              <el-icon style="width: 100%; font-style: normal">
                <QuestionFilled />
                事件模板：
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-select
          clearable
          allow-create
          filterable
          @change="changeTempCode"
          v-model="info.tempCode"
          placeholder="请选择要执行的事件模板"
        >
          <el-option
            v-for="(item, key) in abScanTransMethods"
            :key="key"
            :label="item.name"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="
          info.tempEnable &&
          abScanTransMethods[info.tempCode]?.param?.length > 0
        "
        label="模板参数"
      >
        <span
          style="width: 100%"
          v-for="(item, index) in abScanTransMethods[info.tempCode].param
            .slice()
            .reverse()"
        >
          <el-select
            clearable
            allow-create
            filterable
            v-model="info.tempParam[index]"
            :placeholder="'请选择' + item.desc + '字段'"
          >
            <el-option
              v-for="(column, index) in allSelect"
              :key="index"
              :label="column.name"
              :value="column.code"
            ></el-option>
          </el-select>
        </span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button text type="default" @click="setReFlag(false)">取消</el-button>
      <el-button type="primary" @click="setReFlag(true)">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  export default {
    name: 'ab-scanTrans-config',
  }
</script>

<script lang="ts" setup>
  import { Edit } from '@element-plus/icons-vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import abScanTransMethods from '~/agilebpm/package/ab-form/components/scanTransFunctions'
  import { getDesign } from './dateUtil'
  import { abUtil } from '~/agilebpm'

  //继承的属性data
  const props = defineProps({
    data: { type: Object, required: true },
    form: { type: Object, required: true },
  })

  const info = reactive({
    reFlag: false,
    dialogVisible: false,
    tempEnable: props.data.tempEnable,
    tempCode: props.data.tempCode,
    tempParam: props.data.tempParam ?? [],
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

  //筛选当前表单中可选择数字 以及 字符串字段
  let allSelect = rel.allArr.filter((s) => {
    return (
      s.code != data.value.code &&
      ['varchar', 'number'].includes(s.type) &&
      (s.table == currentTable.tableCode || s.table == bo.rel.tableCode)
    )
  })

  data.value.objectMapping = rel.objectMapping

  const dialogFn = () => {
    if (info.reFlag) {
      data.value.tempEnable = info.tempEnable
      data.value.tempCode = info.tempCode
      data.value.tempParam = abUtil.clone(info.tempParam).slice().reverse()

      info.reFlag = false
    } else {
      info.tempEnable = data.value.tempEnable
      info.tempCode = data.value.tempCode
      info.tempParam = data.value.tempParam ?? []
    }
    info.dialogVisible = true
  }

  const setReFlag = (flag: boolean) => {
    info.reFlag = flag
    if (info.tempEnable && flag && !info.tempCode) {
      ElMessage.warning('开启事件需要指定事件模板，请选择事件模板！')
    } else {
      info.dialogVisible = false
    }
  }
  const changeTempCode = () => {
    info.tempParam = []
    if (info.tempCode) {
      abScanTransMethods[info.tempCode].param.forEach(() => {
        info.tempParam.push('')
      })
    }
  }
</script>

<style scoped lang="scss">
  :deep(.myStyle .el-table .cell) {
    padding: 0 !important;
  }
</style>
