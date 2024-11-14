<template>
  <label class="el-form-item__label" style="padding: 0">流水号配置：</label>
  <el-form-item label-width="120px" label="流水号">
    <el-tag v-if="data.serialnoConfig.serialName" closable @close="closeTag">
      {{ data.serialnoConfig.serialName }}
    </el-tag>

    <ab-cust-dialog
      dialog-key="serialNoSelector"
      :dialog-setting="{ multiple: 0 }"
      round
      size="small"
      :icon="Search"
      style="margin-left: 5px"
      type="primary"
      @ok="choseSerialNo"
    >
      请选择
    </ab-cust-dialog>
  </el-form-item>
  <el-form-item label="隐藏标头" label-width="120px" prop="hideLable">
    <el-switch v-model="data.hideLable" />
  </el-form-item>
  <el-form-item label="显示二维码" label-width="120px" prop="showCode">
    <el-switch
      v-model="data.serialnoConfig.showCode"
      inline-prompt
      active-text="是"
      inactive-text="否"
      :active-value="1"
      :inactive-value="0"
    />
  </el-form-item>
  <div v-if="data.serialnoConfig.showCode">
    <el-form-item label-width="120px" prop="codeType">
      <template #label>
        <div>
          二维码类型:
          <el-tooltip
            class="box-item"
            content="当选择条形码时，流水号中不能包含中文，否则生成条形码会出错"
            effect="dark"
            placement="top-start"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-radio-group v-model="data.serialnoConfig.codeType" size="small">
        <el-radio-button label="bar">条形码</el-radio-button>
        <el-radio-button label="qr">二维码</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      :label="data.serialnoConfig.codeType === 'bar' ? '线条宽度' : '宽度'"
      label-width="120px"
      prop="width"
    >
      <el-input-number
        v-model="data.serialnoConfig.codeConfig.width"
        :min="data.serialnoConfig.codeType === 'bar' ? 1 : 40"
        :max="data.serialnoConfig.codeType === 'bar' ? 10 : 1000"
      />
    </el-form-item>
    <el-form-item
      label="高度"
      label-width="120px"
      prop="height"
      v-if="data.serialnoConfig.codeType === 'bar'"
    >
      <el-input-number
        v-model="data.serialnoConfig.codeConfig.height"
        :min="10"
        :max="1000"
      />
    </el-form-item>
    <el-form-item label="边距" label-width="120px" prop="margin">
      <el-input-number
        v-model="data.serialnoConfig.codeConfig.margin"
        :min="0"
        :max="40"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ab-serialno-config',
  }
</script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { Search, Plus } from '@element-plus/icons-vue'

  const props = defineProps({ data: { type: Object, required: true } })
  const { data } = toRefs(props)

  const initData = () => {
    if (!data.value.serialnoConfig) {
      data.value.serialnoConfig = {
        serialCode: 0,
        serialName: '',
        showCode: 0,
        codeType: 'bar',
        codeConfig: {
          width: 0,
          height: 0,
          margin: 4,
        },
      }
    }
    if (data.value.serialCode) {
      data.value.serialnoConfig.serialCode = data.value.serialCode
      data.value.serialCode = null
    }
    if (data.value.serialName) {
      data.value.serialnoConfig.serialName = data.value.serialName
      data.value.serialName = null
    }
  }

  watch(
    () => data.value.serialnoConfig.codeType,
    (val) => {
      if (!val) {
        return
      }
      if (val === 'bar') {
        data.value.serialnoConfig.codeConfig.width = 1.5
        data.value.serialnoConfig.codeConfig.height = 40
      } else {
        data.value.serialnoConfig.codeConfig.width = 100
        data.value.serialnoConfig.codeConfig.height = 100
      }
    }
  )

  const choseSerialNo = (list: any) => {
    if (!list || list.length < 1) {
      return
    }

    const serialNo = list[0]
    data.value.serialnoConfig.serialCode = serialNo.code
    data.value.serialnoConfig.serialName = serialNo.name
  }

  const closeTag = () => {
    data.value.serialnoConfig.serialCode = null
    data.value.serialnoConfig.serialName = null
  }

  initData()
</script>
