<template>
  <div>
    <el-divider content-position="center">图标菜单配置</el-divider>
    <el-form-item label="菜单标题">
      <el-input v-model="config.control.title" placeholder="请输入菜单标题" />
    </el-form-item>
    <el-form-item label="图标按钮">
      <el-dropdown split-button @click="addIcon()">
        添加图标按钮
        <template #dropdown>
          <el-dropdown-menu>
            <ab-cust-dialog
              dialog-key="bpmDefinitionSelector"
              text
              type="primary"
              @ok="selectFlow"
            >
              流程按钮
            </ab-cust-dialog>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-form-item>
    <el-form-item label="图标方向">
      <el-radio-group v-model="config.control.direction">
        <el-radio label="horizontal">水平</el-radio>
        <el-radio label="vertical">垂直</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="图标大小">
      <el-slider
        v-model="config.control.iconSize"
        :max="40"
        :min="10"
        show-stops
        :step="5"
        style="width: 80%"
      />
    </el-form-item>
    <el-form-item label="字体大小">
      <el-slider
        v-model="config.control.textSize"
        :max="24"
        :min="12"
        show-stops
        :step="2"
        style="width: 80%"
      />
    </el-form-item>
    <el-form-item label="每行个数">
      <el-slider
        v-model="config.control.spaceSize"
        :max="20"
        :min="1"
        show-stops
        :step="1"
        style="width: 80%"
      />
    </el-form-item>
    <draggable
      :animation="340"
      group="iconGroup"
      item-key="index"
      :list="config.control.iconButtonList"
    >
      <template #item="{ element, index }">
        <div class="columns_item_config">
          <vab-icon :icon="element.icon" style="font-size: 26px" />
          <el-input v-model="element.name" />
          <el-button
            :icon="Edit"
            style="padding: 5px; margin-right: 0; margin-left: 10px"
            text
            type="primary"
            @click="edit(element)"
          />
          <el-button
            :icon="Sort"
            style="padding: 5px; margin-right: 0"
            text
            type="primary"
          />
          <el-button
            :icon="Delete"
            style="padding: 5px"
            text
            type="primary"
            @click="config.control.iconButtonList.splice(index, 1)"
          />
        </div>
      </template>
    </draggable>
  </div>
  <el-dialog
    v-model="pageInfo.showDialog"
    :title="pageInfo.isAdd ? '新增' : '编辑' + '图标按钮'"
    width="500px"
  >
    <el-form
      ref="formRef"
      label-position="right"
      label-width="100"
      :model="pageInfo.currentItem"
    >
      <el-form-item
        label="图标名字："
        prop="name"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input v-model="pageInfo.currentItem.name" />
      </el-form-item>
      <el-form-item
        label="图标选择："
        prop="icon"
        :rules="[{ required: true, message: '必填' }]"
      >
        <ab-choose-svg v-model="pageInfo.currentItem.icon" />
        <svg-icon
          :icon="pageInfo.currentItem.icon"
          style="width: 30px; height: 30px; margin-left: 12px"
        />
      </el-form-item>
      <el-form-item
        label="URL："
        prop="url"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input
          v-model="pageInfo.currentItem.url"
          placeholder="url 可使用全局参数"
        />
      </el-form-item>
      <el-form-item label="展示条件：" prop="showCondition">
        <el-input
          v-model="pageInfo.currentItem.showCondition"
          placeholder="设置该图表展示的条件，默认展示"
          type="textarea"
        />
        <el-select placeholder="条件参数选择">
          <el-option
            v-for="item in formCombination.designJson.params"
            :key="item.name"
            :label="item.name"
            :value="item.name"
            @click="
              pageInfo.currentItem.showCondition =
                (pageInfo.currentItem.showCondition || '') +
                'globalParams.' +
                item.name
            "
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button text @click="pageInfo.showDialog = false">取消</el-button>
        <el-button type="primary" @click="dialogOk">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import {Edit, Delete, Sort } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import draggable from 'vuedraggable'
  import { abChooseSvg } from '@ab-core'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    config: {
      required: true,
      type: Object as PropType<FormCombinationComponent>,
    },
    formCombination: {
      required: true,
      type: Object as PropType<FormCombination>,
    },
  })
  const { config, formCombination } = toRefs(props)

  const pageInfo = reactive({
    currentItem: {} as any,
    showDialog: false,
    isAdd: true,
    editTemp: {},
  })

  // 当id发生变化了，这里重新加载在线表单
  watch(
    () => {
      return pageInfo.showDialog
    },
    (newValue) => {
      if (!newValue) {
        formRef.value?.clearValidate()
      }
    }
  )

  const formRef = ref<FormInstance>()
  const dialogOk = () => {
    formRef.value?.validate((valid: boolean) => {
      if (valid) {
        if (pageInfo.isAdd) {
          config.value.control.iconButtonList.push(pageInfo.currentItem)
          pageInfo.showDialog = false
        } else {
          pageInfo.showDialog = false
          abUtil.easyClone(pageInfo.currentItem, pageInfo.editTemp)
        }
      } else {
        ElMessage({
          showClose: true,
          message: '请检查表单',
          type: 'warning',
        })
      }
    })
  }

  const edit = (item: any) => {
    // abUtil.easyClone(item, pageInfo.currentItem)
    pageInfo.showDialog = true
    pageInfo.currentItem = item
    pageInfo.isAdd = false
    window.setTimeout(() => {
      formRef.value?.validate(() => {})
    }, 10)
  }

  const addIcon = () => {
    pageInfo.currentItem = {} //file-text-line
    pageInfo.showDialog = true
    pageInfo.isAdd = true
  }

  const selectFlow = (data: any) => {
    data.forEach((item: any) => {
      config.value.control.iconButtonList.push({
        name: item.name,
        icon: item.icon || 'leave',
        url: `/bpm/flowStart/${item.key}`,
      })
    })
  }

  onMounted(() => {
    if (!config.value.control) {
      config.value.control = {
        iconButtonList: [],
        direction: 'vertical',
        iconSize: 30,
        textSize: 16,
        spaceSize: 6,
        title: '',
      }
    }
    if (!config.value.control.iconButtonList) {
      config.value.control.iconButtonList = []
    }
  })
</script>
