<template>
  <el-form
    style="margin-top: 15px"
    :model="data"
    label-suffix="："
    labelWidth="95px"
    @submit.prevent
  >
    <el-form-item label="字段描述">
      <el-input
        v-model="data.label"
        clearable
        show-word-limit
        placeholder="请输入标题"
      ></el-input>
    </el-form-item>

    <el-form-item label="控件栅格">
      <el-slider
        v-model="data.span"
        :max="24"
        :min="4"
        show-stops
        :step="1"
        style="width: 90%"
      />
      <el-radio-group v-model.number="data.span">
        <el-radio-button label="24">一列</el-radio-button>
        <el-radio-button label="12">两列</el-radio-button>
        <el-radio-button label="8">三列</el-radio-button>
        <el-radio-button label="6">四列</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="验证码类型">
      <el-radio-group v-model="data.sendType">
        <el-radio-button :label="0">邮箱</el-radio-button>
        <el-radio-button :label="1">短信</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      class="is-required"
      :label="data.sendType ? '短信字段' : '邮箱字段'"
    >
      <el-select
        v-model="data.sendSmsColumn"
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
  </el-form>
</template>

<script lang="ts">
  export default {
    name: 'ab-verificationCode-config',
  }
</script>

<script lang="ts" setup>
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

  let rel = getDesign(
    bo,
    isEasy,
    isEasy ? data.value : { code: data.value.sendSmsColumn }
  )

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
</script>

<style scoped lang="scss">
  :deep(.myStyle .el-table .cell) {
    padding: 0 !important;
  }
</style>
