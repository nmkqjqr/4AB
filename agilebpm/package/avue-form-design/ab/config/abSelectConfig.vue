<template>
  <el-form-item
    v-if="['radio', 'checkbox'].includes(data.type)"
    label="按钮风格"
    prop="hideLable"
  >
    <el-radio-group v-model="data.buttonStyle">
      <el-radio label="marquee">选框</el-radio>
      <el-radio label="button">按钮</el-radio>
    </el-radio-group>
  </el-form-item>
  <div class="el-form-item">
    <el-tabs v-model="data.dicType">
      <el-tab-pane label="静态数据" name="statusData">
        <draggable
          style="margin-top: 10px"
          tag="ul"
          :list="data.dicData"
          :group="{ name: 'dic' }"
          ghost-class="ghost"
          item-key="sn"
          handle=".drag-item"
        >
          <template #item="{ element, index }">
            <li style="margin-bottom: 5px">
              <el-input
                style="margin-right: 5px"
                clearable
                v-model="element.label"
                placeholder="请输入描述"
                maxlength="20"
              />
              <el-input
                style="margin-right: 5px"
                clearable
                v-model="element.value"
                placeholder="请输入值"
                maxlength="20"
              />
              <el-icon :size="30" v-if="data.dicData.length > 1">
                <Operation
                  class="drag-item"
                  style="margin: 0 5px; cursor: move"
                />
              </el-icon>
              <el-button
                v-if="data.dicData.length > 1"
                style="margin-left: 5px"
                @click="handleRemoveFields(index)"
                circle
                size="small"
                :icon="CloseBold"
              ></el-button>
            </li>
          </template>
        </draggable>

        <el-button type="text" @click="handleAddFields">添加列</el-button>
        <span v-if="data.defaultValue"></span>
      </el-tab-pane>
      <el-tab-pane label="数据字典" name="dicData">
        <el-form-item label="字典分类" style="margin-top: 10px">
          <el-tag
            key="item"
            v-if="data.dicCodeName && data.dicCodeName.length > 0"
          >
            {{ data.dicCodeName }}
          </el-tag>
          <ab-cust-dialog
            dialog-key="sjzdsjq"
            :icon="Search"
            round
            size="small"
            style="margin-left: 8px"
            type="primary"
            @ok="getDicCode"
          >
            选择
          </ab-cust-dialog>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </div>
  <el-form-item>
    <template #label>
      <div>
        默认值
        <el-tooltip
          class="box-item"
          content="支持以#{}包含的以脚本运行，eg:#{sysScript.getCurrentUserName()}"
          effect="dark"
          placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>

    <el-col :span="16">
      <span v-if="data.dicType != 'statusData'">
        <tree-select
          clearable
          style="width: 270px"
          :multiple="['multiSelect', 'checkbox'].includes(data.type)"
          v-model="data.defaultValue"
          :dic-code="data.dicCode"
          placeholder="选择或输入默认值"
        />
      </span>
      <span v-else>
        <el-select
          v-if="!['multiSelect', 'checkbox'].includes(data.type)"
          v-model="data.defaultValue"
          style="width: 270px"
          allow-create
          clearable
          filterable
          placeholder="选择或输入默认值"
        >
          <el-option
            v-for="item in data.dicData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <ab-multi-select
          style="width: 270px"
          v-else
          v-model="data.defaultValue"
          allow-create
          clearable
          filterable
          placeholder="选择或输入默认值"
        >
          <el-option
            v-for="item in data.dicData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ab-multi-select>
      </span>
    </el-col>
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'ab-select-config',
  }
</script>

<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  import { Operation, CloseBold, QuestionFilled } from '@element-plus/icons-vue'
  import Draggable from 'vuedraggable'
  import { abMultiSelect } from '@ab-core'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { sysApi } from '@agilebpm/api'
  import treeSelect from './component/treeSelect.vue'

  import _ from 'lodash'
  //继承的属性data
  const props = defineProps({ data: { type: Object, required: true } })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)
  if (!data.value.defaultValue) {
    data.value.defaultValue = null
  }

  // //字典分类下拉框数据
  // const dicSelect = ref()
  // //获取数据字典的下拉框
  // sysApi.dict
  //   .getDictList()
  //   .then((result) => (dicSelect.value = result.data.rows))

  if (!data.value.dicType) {
    data.value.dicType = 'statusData'
  }

  if (
    ['radio', 'checkbox'].includes(data.value.type) &&
    !data.value.buttonStyle
  ) {
    data.value.buttonStyle = 'marquee'
  }

  if (!data.value.dicData) {
    data.value.dicData = [
      {
        sn: 1,
        label: '选项1',
        value: '1',
      },
      {
        sn: 2,
        label: '选项2',
        value: '2',
      },
      {
        sn: 3,
        label: '选项3',
        value: '3',
      },
    ]
  }

  //删除单条静态数据
  const handleRemoveFields = (index: number) => {
    if (data.value.dicData[index].value == data.value.defaultValue) {
      data.value.defaultValue = null
    }
    data.value.dicData.splice(index, 1)
  }
  //新增单条静态数据
  const handleAddFields = () => {
    data.value.dicData.push({
      label: `新字段`,
      value: abUtil.Arrays.getNextSn(data.value.dicData).toString(),
      sn: abUtil.Arrays.getNextSn(data.value.dicData),
    })
  }

  // //需要更新字典的数据
  if (data.value.dicCode) {
    sysApi.dict.getDictListByCode(data.value.dicCode).then((result) => {
      data.value.dicNodeSelect = result.filter((s) => !s.disable)
    })
  }

  //选择字典后的操作
  const getDicCode = (rel: any) => {
    data.value.dicCode = rel[0].code
    data.value.dicCodeName = rel[0].name
    data.value.defaultValue = null
    sysApi.dict.getDictListByCode(data.value.dicCode).then((result) => {
      data.value.dicNodeSelect = result.filter((s) => !s.disable)
    })
  }

  //当默认值静态数据变化时, 赋值默认值和名称
  watch(
    () => data.value.defaultValue,
    () => {
      if (data.value.defaultValue) {
        data.value.defaultValueName = data.value.defaultValue
          .split(',')
          .map((s: any) =>
            data.value.dicType == 'statusData'
              ? data.value.dicData.find(
                  (item: { value: any }) => s == item.value
                ).label
              : data.value.dicNodeSelect.find(
                  (item: { code: any }) => s == item.code
                ).name
          )
          .join(',')
      } else data.value.defaultValueName = ''
    }
  )
</script>
