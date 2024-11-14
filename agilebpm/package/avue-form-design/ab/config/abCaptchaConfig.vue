<template>
  <el-form
    style="margin-top: 15px"
    :model="data"
    label-suffix="："
    labelPosition="left"
    labelWidth="90px"
    @submit.prevent
  >
    <el-form-item v-if="!data.readOnly" label="回退限制2222" prop="regression">
      <el-switch v-model="data.regression" />
    </el-form-item>
    <el-form-item label="隐藏标头" prop="hideLable">
      <el-switch v-model="data.hideLable" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <div>
          <el-tooltip
            class="box-item"
            content="参数值为number类型，即实体字段数据库中的最终值，会自动从0开始生成，无需手动修改。"
            effect="dark"
            placement="top-start"
          >
            <el-icon style="width: 27px">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
        配置：
      </template>
      <el-button
        :icon="Plus"
        round
        size="small"
        type="primary"
        @click="addParam"
      >
        添加
      </el-button>
    </el-form-item>
    <span class="myStyle" v-if="data.param && data.param.length > 0">
      <el-table
        :cell-style="{
          height: '40px',
          padding: '0',
        }"
        :data="data.param"
        :header-cell-style="{ height: '10px' }"
        :row-style="{
          height: '40px',
          padding: '0',
        }"
        style="padding: 0; margin-bottom: 40px"
      >
        <el-table-column align="center" label="默认进度" width="80">
          <template #default="{ row }">
            <el-radio-group v-model="row.default">
              <el-radio :label="true" size="large" @change="radioClick(row)">
                <template #default>
                  <span style="display: none"></span>
                </template>
              </el-radio>
            </el-radio-group>
          </template>
        </el-table-column>

        <el-table-column label="参数值" align="center" width="70">
          <template #default="{ row }">
            <el-input disabled v-model="row.value" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="显示名称">
          <template #default="{ row }">
            <el-input
              v-model="row.label"
              placeholder="请选择"
              style="width: 90%"
            />
          </template>
        </el-table-column>

        <el-table-column width="35">
          <template #default="{ row, $index }">
            <el-button link type="danger" @click="deleteItem(row, $index)">
              <el-icon :size="22">
                <Delete />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </span>
  </el-form>
</template>

<script lang="ts">
  export default {
    name: 'ab-captcha-config',
  }
</script>

<script lang="ts" setup>
  import { Plus } from '@element-plus/icons-vue'
  //继承的属性data
  const props = defineProps({ data: { type: Object, required: true } })
  //将data内的属性转为响应式数据
  const { data } = toRefs(props)

  if (!data.value.param || data.value.param.length == 0) {
    data.value.param = [
      {
        default: true,
        value: 0,
        label: '阶段1',
      },
      {
        default: false,
        value: 1,
        label: '阶段2',
      },
      {
        default: false,
        value: 2,
        label: '阶段3',
      },
    ]
  }

  const radioClick = (row: any) => {
    data.value.param.forEach((element: any) => {
      if (element.value != row.value) {
        element.default = false
      }
    })
  }

  const deleteItem = (item: any, index: number) => {
    if (data.value.param.length == 1) {
      ElMessage.error('删除失败，导航条组件至少需要一个节点！')
    } else {
      data.value.param.splice(index, 1)
      data.value.param.forEach((s: any, index: number) => (s.value = index))
      if (item.default) {
        data.value.param[0].default = true
      }
    }
  }

  const addParam = () => {
    if (!data.value.param || data.value.param.length == 0) {
      data.value.param = [
        {
          default: true,
          value: 0,
          label: '',
        },
      ]
    } else {
      data.value.param.push({
        default: false,
        value: data.value.param.length,
        label: '新增阶段',
      })
    }
  }
</script>

<style scoped lang="scss">
  :deep(.myStyle .el-table .cell) {
    padding: 0 !important;
  }
</style>
