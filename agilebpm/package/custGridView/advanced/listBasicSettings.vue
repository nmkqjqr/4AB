<template>
  <div>
    <el-card class="box-card" style="width: 100%; margin-bottom: 8px">
      <template #header>
        <div class="card-header">
          <span>列表基础设置</span>
        </div>
      </template>
      <el-form
        ref="formRef"
        class="demo-ruleForm formaStyle"
        :inline="true"
        label-position="left"
        label-width="100px"
        :model="info.data"
        :rules="rules"
      >
        <!-- 需要调接口 -->
        <el-form-item label="主键" prop="pkName">
          <el-select
            v-model="info.data.pkName"
            clearable
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="item in info.data.fieldsList"
              :key="item.fieldName"
              :label="item.fieldDesc"
              :value="item.fieldName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="typeCode">
          <ab-select-tree
            v-model="info.data.typeCode"
            style="width: 200px"
            type-code="biz"
          />
        </el-form-item>
        <el-form-item label="是否多选" prop="chooseType">
          <el-radio-group
            v-model="info.data.chooseType"
            size="small"
            style="width: 200px"
          >
            <el-radio-button :label="0">单选</el-radio-button>
            <!-- <el-radio-button :label="1">单选</el-radio-button> -->
            <el-radio-button :label="2">多选</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="数据源"
          prop="dsKey"
          :rules="[{ required: true, message: '必填' }]"
        >
          <ab-ds-selector
            v-model:ds-key="info.data.dsKey"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="分页数量" prop="pageSize">
          <el-select
            v-model="info.data.pageSize"
            placeholder=""
            style="width: 200px"
          >
            <el-option
              v-for="item in info.pageSizeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="默认查询" prop="initQuery">
          <el-switch
            v-model="info.data.initQuery"
            active-color="#13ce66"
            :active-value="1"
            class="ml-2"
            inactive-color="#dcdfe6"
            :inactive-value="0"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="行号/序号" prop="showRowsNum">
          <el-switch
            v-model="info.data.showRowsNum"
            active-color="#13ce66"
            :active-value="1"
            class="ml-2"
            inactive-color="#dcdfe6"
            :inactive-value="0"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="固定操作栏" prop="fixTool">
          <el-switch
            v-model="info.data.fixTool"
            active-color="#13ce66"
            :active-value="1"
            class="ml-2"
            inactive-color="#dcdfe6"
            :inactive-value="0"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="操作栏宽度" prop="operationWidth">
          <el-slider
            v-model="info.data.operationWidth"
            :max="400"
            :min="50"
            show-stops
            :step="20"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch
            v-model="info.data.status"
            active-color="#13ce66"
            :active-value="1"
            class="ml-2"
            inactive-color="#dcdfe6"
            :inactive-value="0"
            style="width: 200px"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" style="width: 100%; margin-bottom: 8px">
      <template #header>
        <div class="card-header">
          <span>左侧树设置</span>
        </div>
      </template>
      <left-tree-settings v-model="info.data" />
    </el-card>
    <el-card class="box-card" style="width: 100%; margin-bottom: 8px">
      <template #header>
        <div class="card-header">
          <span>手机列表设置</span>
        </div>
      </template>
      <phone-list-settings v-model="info.data" />
    </el-card>
    <el-card class="box-card" style="width: 100%; margin-bottom: 8px">
      <template #header>
        <div class="card-header">
          <span>默认排序设置</span>
        </div>
      </template>
      <default-sorting v-model="info.data" :advanced="true"/>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import leftTreeSettings from './leftTreeSettings.vue'
  import phoneListSettings from './phoneListSettings.vue'
  import defaultSorting from '../components/defaultSorting.vue'
  import { abDsSelector } from '@ab-core'

  const emit = defineEmits(['searchObjName', 'update:modelValue'])
  const props = defineProps({
    modelValue: { required: true, type: Object }, // 赋值目标对象
  })
  const formRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    pkName: [
      {
        required: true,
        message: '必选',
        trigger: 'change',
      },
    ],
    typeCode: [
      {
        required: true,
        message: '必选',
        trigger: 'change',
      },
    ],
  })

  const info: any = reactive({
    data: useVModel(props, 'modelValue', emit),
    pageSizeList: ['5', '10', '20', '50', '100', '200', '500'],
  })

  if (info.data.extendConf) {
    const extendConf = JSON.parse(info.data.extendConf)
    if (extendConf.operationWidth) {
      info.data.operationWidth = extendConf.operationWidth
    } else {
      info.data.operationWidth = 220
    }
  }

  watch(
    () => [props.modelValue],
    (now, old) => {
      info.data = now[0]
    }
  )

  watch(
    () => info.data.dsKey,
    (val) => {
      emit('searchObjName')
    }
  )

  watch(
    () => [info.data.fieldsList],
    (now, old) => {
      if (now && now.length > 0) {
        info.data.pkName = ''
        if(info.data.fieldsList[0].fieldName.includes("id") || info.data.fieldsList[0].fieldName.includes("ID")){
          info.data.pkName = info.data.fieldsList[0].fieldName
        }
      } else {
        info.data.pkName = ''
      }
    }
  )

  onMounted(() => {})
  defineExpose({ info })
</script>
<style lang="scss"></style>
