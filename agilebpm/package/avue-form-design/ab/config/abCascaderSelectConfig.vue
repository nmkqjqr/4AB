<template>
  <div>
    <label class="el-form-item__label" style="padding: 0">级联选择配置：</label>
    <el-form-item label="对话框" class="is-required">
      <el-input v-model="data.dialogName" :readonly="true">
        <template #append>
          <ab-cust-dialog
            dialog-key="custDialog"
            type="primary"
            :param="{ style_$VEQ: 'tree' }"
            @ok="choseDialog"
          >
            <el-icon><Search></Search></el-icon>
          </ab-cust-dialog>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="展示字段" class="is-required">
      <el-select v-model="data.labelField" placeholder="请选择展示字段">
        <el-option
          v-for="(item, index) in dialogFields"
          :key="index"
          :label="item.showName"
          :value="item.returnName"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="值字段" class="is-required">
      <el-select v-model="data.valueField" placeholder="请选择映射值">
        <el-option
          v-for="(item, index) in dialogFields"
          :key="index"
          :label="item.showName"
          :value="item.returnName"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="多选">
      <el-switch
        v-model="data.abCascaderConfig.multiple"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>

    <el-form-item v-if="data.abCascaderConfig.multiple">
      <template #label>
        <div>
          任意选:
          <el-tooltip
            class="box-item"
            content="在多选模式下，可让父子节点取消关联，选择任意一级选项"
            effect="dark"
            placement="top-start"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-switch
        v-model="data.abCascaderConfig.checkStrictly"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>

    <!-- <el-form-item label="默认值">
    <el-input
      type="text"
      v-model="data.defaultValue"
      :placeholder="defaultValuePlaceholder"
    />
  </el-form-item> -->
    <defult-value-config
      v-model="data.defaultValue"
      :filed-type="data.fieldType"
    ></defult-value-config>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ab-cascader-select-config',
  }
</script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { ElMessage } from 'element-plus'
  import { bizApi } from '@agilebpm/api'
  import defultValueConfig from './component/defaultValueConfig.vue'
  import * as dialogUtil from './component/DialogConditionUtil'

  const props = defineProps({ data: { type: Object, required: true } })

  const { data } = toRefs(props)
  const dialogFields = ref([] as any)
  const dialogParams = ref([] as any)
  const params: any = ref(props.data.params)

  //选择对话框
  const choseDialog = (list: any) => {
    if (!list || list.length < 1) {
      return
    }

    const dialogNo = list[0]
    data.value.dialogKey = dialogNo.code
    data.value.dialogName = dialogNo.name
    data.value.valueField = null
    data.value.labelField = null
  }

  const cleanDataDialogInfo = () => {
    data.value.dialogKey = ''
    data.value.dialogName = ''
    data.value.valueField = null
    data.value.labelField = null
  }

  //获取返回值 和 参数列表
  const getDataFiled = function (dialogKey: string) {
    if (!dialogKey) {
      return
    }
    dialogFields.value.splice(0, dialogFields.value.length)
    bizApi.customDialog.getDialogByCode(dialogKey).then(
      (result: any) => {
        if (!result.isOk || !result.data) {
          ElMessage.error(`${dialogKey}对话框获取失败`)
          return
        }
        dialogFields.value.push(
          ...dialogUtil.handleDialogConditionFields(result.data)
        )
      },
      () => {
        ElMessage.error(
          `【${props.data.label}】字段配置的对话框【${dialogKey}】获取失败，请检查对话框，重新配置`
        )
        cleanDataDialogInfo()
      }
    )
  }

  watch(
    () => data.value.dialogKey,
    (newValue) => {
      getDataFiled(newValue)
    },
    { immediate: true }
  )

  if (!data.value.abCascaderConfig) {
    data.value.abCascaderConfig = {
      multiple: false,
      checkStrictly: false,
    }
  }
</script>
