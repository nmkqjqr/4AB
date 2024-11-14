<template>
  <div>
    <label class="el-form-item__label" style="padding: 0">
      自定义数据选择配置：
    </label>
    <el-form-item label="对话框" class="is-required">
      <el-input v-model="data.dataSelectorConfig.dialogName" :readonly="true">
        <template #append>
          <ab-cust-dialog
            dialog-key="custDialog"
            type="primary"
            :dialogSetting="{ multiple: 0 }"
            @ok="choseDialog"
          >
            <el-icon><Search /></el-icon>
          </ab-cust-dialog>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="展示字段" class="is-required">
      <el-select v-model="pageData.labelInfo" placeholder="请选择展示字段">
        <el-option
          v-for="(item, index) in pageData.dialogFields"
          :key="index"
          :label="item.showName"
          :value="item.returnName + ',' + item.columnName"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="值字段" class="is-required">
      <el-select v-model="pageData.valueInfo" placeholder="请选择映射值字段">
        <el-option
          v-for="(item, index) in pageData.dialogFields"
          :key="index"
          :label="item.showName"
          :value="item.returnName + ',' + item.columnName"
        />
      </el-select>
    </el-form-item>
    <defult-value-config
      v-model="data.defaultValue"
      :filed-type="data.fieldType"
    ></defult-value-config>

    <dialog-condition-seeting
      v-if="pageData.dialogInfo"
      :dialog="pageData.dialogInfo"
      :params="data.dataSelectorConfig.params"
      :paramsDefaultValue="data.dataSelectorConfig.paramsDefaultValue"
      :currentCode="props.data.tableCode"
      :column-prop="props.data.prop"
      :is-mb="props.form.isMb"
    />

    <!--icon-->
    <el-form-item label="icon">
      <ab-choose-svg
        v-model="data.dataSelectorConfig.icon"
        style="width: 100%"
      ></ab-choose-svg>
    </el-form-item>

    <!--搜索按钮文本-->
    <el-form-item label="按钮文本">
      <el-input
        v-model="data.dataSelectorConfig.searchDesc"
        placeholder="请输入按钮文本"
      />
    </el-form-item>
    <!--是否多选-->
    <el-form-item label="多选">
      <el-switch
        v-model="data.dataSelectorConfig.multiple"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <!--展示详情-->
    <detail-setting :config="data.dataSelectorConfig" />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ab-data-selector-config',
  }
</script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { bizApi } from '@agilebpm/api'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import defultValueConfig from './component/defaultValueConfig.vue'
  import abChooseSvg from '~/agilebpm/package/ab-core/components/ab-choose-svg/index.vue'
  import dialogConditionSeeting from './component/dialogConditionSeeting.vue'
  import detailSetting from './component/detailSetting.vue'
  import * as dialogUtil from './component/DialogConditionUtil'

  const props = defineProps({
    data: { type: Object, required: true },
    form: { type: Object, required: true },
  })
  const { data } = toRefs(props)

  const pageData = reactive({
    dialogFields: [] as any[],
    valueInfo: '',
    labelInfo: '',
    dialogInfo: {},
  })

  //选择对话框
  const choseDialog = (list: any) => {
    if (!list || list.length < 1) {
      return
    }
    const dialogNo = list[0]
    data.value.dataSelectorConfig.dialogKey = dialogNo.code
    data.value.dataSelectorConfig.dialogName = dialogNo.name
    data.value.dataSelectorConfig.valueField = null
    data.value.dataSelectorConfig.labelField = null
    pageData.labelInfo = ''
    pageData.valueInfo = ''
    data.value.dataSelectorConfig.params = {}
    data.value.dataSelectorConfig.paramsDefaultValue = {}
  }

  //获取返回值 和 参数列表
  const getDialogInfo = function (dialogKey: string) {
    if (!dialogKey) {
      return
    }
    //清掉之前的数据
    pageData.dialogFields.splice(0, pageData.dialogFields.length)

    bizApi.customDialog.getDialogByCode(dialogKey).then(
      (result: any) => {
        if (!result.isOk || !result.data) {
          ElMessage.error(`${dialogKey}对话框获取失败`)
          return
        }
        pageData.dialogFields.push(
          ...dialogUtil.handleDialogConditionFields(result.data)
        )
        pageData.dialogInfo = result.data
      },
      () => {
        ElMessage.error(
          `【${props.data.label}】字段配置的对话框【${dialogKey}】获取失败，请检查对话框，重新配置`
        )
        data.value.dataSelectorConfig.dialogKey = ''
        data.value.dataSelectorConfig.dialogName = ''
        data.value.dataSelectorConfig.valueField = null
        data.value.dataSelectorConfig.labelField = null
        pageData.labelInfo = ''
        pageData.valueInfo = ''
        data.value.dataSelectorConfig.params = {}
      }
    )
  }

  const initData = () => {
    if (!data.value.dataSelectorConfig) {
      data.value.dataSelectorConfig = {
        multiple: 0,
        searchDesc: '',
        dialogKey: '',
        valueField: '',
        labelField: '',
        icon: '',
        param: '',
        labelColumn: '',
        params: {},
        paramsDefaultValue: {},
      }
    } else {
      if (
        data.value.dataSelectorConfig.labelField &&
        data.value.dataSelectorConfig.labelColumn
      ) {
        pageData.labelInfo = `${data.value.dataSelectorConfig.labelField},${data.value.dataSelectorConfig.labelColumn}`
      }
      if (
        data.value.dataSelectorConfig.valueField &&
        data.value.dataSelectorConfig.param
      ) {
        pageData.valueInfo = `${data.value.dataSelectorConfig.valueField},${data.value.dataSelectorConfig.param}`
      }
    }
    data.value.dataSelectorConfig.selectType = 'custom'
    //兼容一下老数据
    if (!data.value.dataSelectorConfig.params) {
      data.value.dataSelectorConfig.params = {}
    }
    if (!data.value.dataSelectorConfig.paramsDefaultValue) {
      data.value.dataSelectorConfig.paramsDefaultValue = {}
    }
  }

  initData()
  onMounted(() => {
    if (data.value.dataSelectorConfig.dialogKey) {
      getDialogInfo(data.value.dataSelectorConfig.dialogKey)
    }
  })

  watch(
    () => data.value.dataSelectorConfig.dialogKey,
    (newValue) => {
      getDialogInfo(newValue)
    }
  )

  watch(
    () => pageData.valueInfo,
    (newValue) => {
      if (!newValue) {
        data.value.dataSelectorConfig.valueField = ''
        data.value.dataSelectorConfig.param = ''
        return
      }
      const strs = newValue.split(',')
      data.value.dataSelectorConfig.valueField = strs[0]
      data.value.dataSelectorConfig.param = strs[1]
    }
  )

  watch(
    () => pageData.labelInfo,
    (newValue) => {
      if (!newValue) {
        data.value.dataSelectorConfig.labelField = ''
        data.value.dataSelectorConfig.labelColumn = ''
        return
      }
      const strs = newValue.split(',')
      data.value.dataSelectorConfig.labelField = strs[0]
      data.value.dataSelectorConfig.labelColumn = strs[1]
    }
  )
</script>
