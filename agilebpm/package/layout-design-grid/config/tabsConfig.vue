<template>
  <div>
    <el-divider content-position="center">标签页配置</el-divider>
    <draggable
      :animation="340"
      group="tabsGroup"
      item-key="maincontainer"
      :list="config.columns"
    >
      <!-- <div v-for="(item,index) in formConf.columns" :key="index" class="columns_item_config"> -->
      <template #item="{ element, index }">
        <div class="columns_item_config">
          <el-checkbox
            :model-value="element.key == config.default"
            size="large"
            @change="(val:any) => checkChange(val, element)"
          />
          <el-input v-model="element.name" style="margin-left: 6px" />
          <el-icon :size="22" @click="edit(element)">
            <Edit />
          </el-icon>
          <el-icon class="move-btn" :size="22">
            <Sort />
          </el-icon>
          <el-icon :size="22" @click="delTabsClick(index)">
            <Delete />
          </el-icon>
        </div>
      </template>
      <!-- </div> -->
    </draggable>
    <div class="add_btn" @click="addTabsClick">
      <el-button :icon="Plus" text type="primary">添加标签卡</el-button>
    </div>
    <el-form-item label="页签风格">
      <el-select v-model="config.control.type">
        <el-option label="border-card" value="border-card" />
        <el-option label="card" value="card" />
        <el-option label="default" value="" />
      </el-select>
    </el-form-item>
  </div>
  <el-dialog
    v-model="pageInfo.showDialog"
    :title="pageInfo.isAdd ? '新增' : '编辑' + '标签页面'"
    width="500px"
  >
    <el-form
      ref="formRef"
      label-position="left"
      label-width="80px"
      :model="pageInfo.currentItem"
    >
      <el-form-item
        label="面板名字"
        prop="name"
        :rules="[{ required: true, message: '必填' }]"
      >
        <el-input v-model="pageInfo.currentItem.name" />
      </el-form-item>
      <el-form-item label="展示条件" prop="showCondition">
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
  import { ElMessage } from 'element-plus'
  import { Plus, Delete, Sort, Edit } from '@element-plus/icons-vue'
  import draggable from 'vuedraggable'
  import type { FormInstance } from 'element-plus'
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

  const state = reactive({
    activeName: 'second',
  })

  const { activeName } = toRefs(state)
  const addTabsClick = () => {
    const str = new Date().getTime().toString()

    config?.value?.columns?.push({
      key: `${config.value.type}item${0}${str}`,
      list: [],
      name: 'new Tabs',
      showCondition: '',
    })
  }

  const checkChange = (val: boolean, item: any) => {
    if (val) {
      config.value.default = item.key
    }
  }
  const delTabsClick = (index: number) => {
    if (['tabs', 'collapse'].includes(config?.value?.type)) {
      config?.value?.columns?.splice(index, 1)
    }
  }

  const pageInfo = reactive({
    currentItem: {} as any,
    showDialog: false,
    isAdd: true,
    editTemp: {},
  })

  const formRef = ref<FormInstance>()
  const dialogOk = () => {
    formRef.value?.validate((valid: boolean) => {
      if (valid) {
        if (pageInfo.isAdd) {
          config?.value?.columns?.push(pageInfo.currentItem)
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
    abUtil.easyClone(item, pageInfo.currentItem)
    pageInfo.showDialog = true
    pageInfo.editTemp = item
    pageInfo.isAdd = false
    window.setTimeout(() => {
      formRef.value?.validate(() => {})
    }, 10)
  }
</script>
