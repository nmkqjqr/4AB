<template>
  <div>
    <label class="el-form-item__label" style="padding: 0">动态选择配置：</label>
    <el-form-item label="对话框" class="is-required">
      <el-input v-model="data.dialogName" :readonly="true">
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
      <el-select v-model="data.labelField" placeholder="请选择展示字段">
        <el-option
          v-for="(item, index) in pageData.dialogFields"
          :key="index"
          :label="`${item.showName}(${item.returnName})`"
          :value="item.returnName"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="值字段" class="is-required">
      <el-select v-model="data.valueField" placeholder="请选择映射值字段">
        <el-option
          v-for="(item, index) in pageData.dialogFields"
          :key="index"
          :label="`${item.showName}(${item.returnName})`"
          :value="item.returnName"
        />
      </el-select>
    </el-form-item>
    <defult-value-config
      v-model="data.defaultValue"
      :filed-type="data.fieldType"
    ></defult-value-config>

    <el-form-item
      label="可筛选"
      v-if="
        pageData.dialogInfo.conditionFields &&
        pageData.dialogInfo.conditionFields.length > 0
      "
    >
      <el-switch
        v-model="data.filterable"
        inline-prompt
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>
    <el-form-item label="筛选字段" class="is-required" v-if="data.filterable">
      <el-select v-model="data.filterField" placeholder="请选择搜索关键字段">
        <el-option
          v-for="(item, index) in pageData.dialogInfo.conditionFields"
          :key="index"
          :label="`${item.showName}(${item.columnName})`"
          :value="dialogUtil.buildcondition(item)"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="多选">
      <el-switch
        v-model="data.multiple"
        inline-prompt
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>
    <el-form-item label="多选限制" v-if="data.multiple">
      <el-input-number v-model="data.multipleLimit" :min="1" />
    </el-form-item>

    <dialog-condition-seeting
      v-if="pageData.dialogInfo"
      :dialog="pageData.dialogInfo"
      :params="data.params"
      :paramsDefaultValue="data.paramsDefaultValue"
      :currentCode="props.data.tableCode"
      :column-prop="props.data.prop"
      :is-mb="props.form.isMb"
    />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ab-dynamic-select-config',
  }
</script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { bizApi } from '@agilebpm/api'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import defultValueConfig from './component/defaultValueConfig.vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import dialogConditionSeeting from './component/dialogConditionSeeting.vue'
  import * as dialogUtil from './component/DialogConditionUtil'

  const props = defineProps({
    data: { type: Object, required: true },
    form: { type: Object, required: true },
  })
  const { data } = toRefs(props)
  const getDiyTableFn = inject('getDiyTable') as any

  const pageData = reactive({
    dialogInfo: {} as any,
    dialogFields: [] as any[],
    params: {} as any,
    paramsDefaultValue: {} as any,
    conditionFields: [] as any[],
    columns: [] as any[],
    boInfo: window.getBo() as any,
    isBo: abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo',
  })

  //选择对话框
  const choseDialog = (list: any) => {
    if (!list || list.length < 1) {
      return
    }
    const dialogNo = list[0]
    data.value.dialogKey = dialogNo.code
    data.value.dialogName = dialogNo.name
    data.value.params = {}
    data.value.valueField = null
    data.value.labelField = null
    data.value.filterField = null
    data.value.multiple = false
    data.value.multipleLimit = 0
  }

  const cleanDataDialogInfo = () => {
    data.value.dialogKey = ''
    data.value.dialogName = ''
    data.value.params = {}
    data.value.valueField = null
    data.value.labelField = null
    data.value.filterField = null
    data.value.multiple = false
    data.value.multipleLimit = 0
  }

  //获取返回值 和 参数列表
  const getDialogInfo = async (dialogKey: string) => {
    if (!dialogKey) {
      return
    }
    //清掉之前的数据
    pageData.dialogFields.splice(0, pageData.dialogFields.length)
    try {
      const result = await bizApi.customDialog.getDialogByCode(dialogKey)
      pageData.dialogFields.push(
        ...dialogUtil.handleDialogConditionFields(result.data)
      )
      pageData.dialogInfo = result.data
    } catch (error) {
      ElMessage.error(
        `【${props.data.label}】字段配置的对话框【${dialogKey}】获取失败，请检查对话框，重新配置`
      )
      cleanDataDialogInfo()
    }
  }

  watch(
    () => data.value.dialogKey,
    (newValue) => {
      getDialogInfo(newValue)
    }
  )
  const getColumnNameByReturnName = (returnName: string) => {
    if (
      !returnName ||
      !pageData.dialogFields ||
      pageData.dialogFields.length === 0
    ) {
      return returnName
    }
    const result = ''
    pageData.dialogFields.forEach((item: any) => {
      if (item.returnName === returnName) {
        result = item.columnName
      }
    })
    return result
  }

  watch(
    () => data.value.labelField,
    (newValue: any) => {
      data.value.labelColumn = getColumnNameByReturnName(newValue)
    }
  )
  watch(
    () => data.value.valueField,
    (newValue: any) => {
      data.value.valueColumn = getColumnNameByReturnName(newValue)
    }
  )

  const initData = () => {
    if (!data.value.params) {
      data.value.params = {}
    }
    if (!data.value.paramsDefaultValue) {
      data.value.paramsDefaultValue = {}
    }
  }

  initData()

  onMounted(async () => {
    pageData.boInfo = window.getBo()
    if (data.value.dialogKey) {
      await getDialogInfo(data.value.dialogKey)
      if (data.value.labelField) {
        data.value.labelColumn = getColumnNameByReturnName(
          data.value.labelField
        )
      }
      if (data.value.valueField) {
        data.value.valueColumn = getColumnNameByReturnName(
          data.value.valueField
        )
      }
    }
  })
</script>
