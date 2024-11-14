<template>
  <el-form
    style="margin-top: 15px"
    :model="data"
    label-suffix="："
    labelPosition="left"
    labelWidth="90px"
    @submit.prevent
  >
    <el-form-item label="默认高度">
      <el-slider
        v-model="data.height"
        :min="100"
        :max="1000"
        @change="changeHeight"
      />
    </el-form-item>
    <el-form-item label="最大高度">
      <el-slider
        v-model="data.maxHeight"
        :min="100"
        @change="changeHeight"
        :max="1000"
      />
    </el-form-item>
    <el-form-item label="隐藏标头" prop="hideLable">
      <el-switch v-model="data.hideLable" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-button
        type="primary"
        :icon="Edit"
        round
        size="small"
        @click="dialogVisible = true"
      >
        配置
      </el-button>
    </el-form-item>

    <el-dialog
      @close="dialogFn(false)"
      style="width: 90%"
      v-model="dialogVisible"
      title="内容编辑"
    >
      <ab-rich-editor
        v-model="contentValue"
        :height="data.height"
        :max-height="data.maxHeight"
      />
      <template #footer>
        <el-button text type="default" @click="dialogFn(false)">取消</el-button>
        <el-button type="primary" @click="dialogFn(true)">确定</el-button>
      </template>
    </el-dialog>

    <el-form-item v-if="data.readOnly">
      <template #label>
        <div>
          变量替换:
          <el-tooltip
            class="box-item"
            content="对富文本默认值的变量进行动态替换。例如，变量配置定义了createdUserName，来映射表单中值为张三字段，将会把富文本【欢迎您，{createdUserName}】替换为【欢迎您，张三】"
            effect="dark"
            placement="top-start"
          >
            <el-icon>
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
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
        <el-table-column align="center">
          <template #header>
            <div>
              变量定义
              <el-tooltip
                class="box-item"
                content="自定义替换的code，在富文本使用时，需加{}大括号包裹变量code，在此定义时无需大括号。"
                effect="dark"
                placement="top-start"
              >
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <el-input v-model="row.key" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="参数值">
          <template #default="{ row }">
            <el-select
              @change="updateData(row)"
              clearable
              filterable
              allow-create
              v-model="row.value"
              placeholder="请选择"
            >
              <el-option
                v-for="item in allSelect"
                :key="item.param"
                :label="item.name"
                :value="item.param"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column width="35">
          <template #default="{ $index }">
            <el-button link type="danger">
              <el-icon :size="22" @click="() => data.param.splice($index, 1)">
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
    name: 'ab-editor-config',
  }
</script>

<script lang="ts" setup>
  import { abRichEditor } from '@ab-core'
  import { Plus, Edit } from '@element-plus/icons-vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { getDesign } from '~/agilebpm/package/avue-form-design/ab/config/dateUtil'

  //继承的属性data
  const props = defineProps({
    data: { type: Object, required: true },
    form: { type: Object, required: true },
  })

  //将data内的属性转为响应式数据
  const { data } = toRefs(props)

  const dialogVisible = ref(false)

  const contentValue = ref()
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

  let rel = getDesign(bo, isEasy, data.value)

  let currentTable = rel.currentTable

  let allSelect = rel.allArr.filter(
    (s) =>
      s.code != data.value.code &&
      (s.table == currentTable.tableCode || s.table == bo.rel.tableCode)
  )

  contentValue.value = data.value.defaultValue

  const updateData = (row: any) => {
    let obj = allSelect.find((s) => s.param == row.value)
    //是否时是静态字段,找的到表单字段时obj为对象，因此不是静态字段isParam为0，找到表单字段则isParam为1。
    row.isParam = obj ? '0' : '1'
  }

  const addParam = () => {
    if (!data.value.param || data.value.param.length == 0) {
      data.value.param = [
        {
          key: '',
          value: '',
        },
      ]
    } else {
      data.value.param.push({
        key: '',
        value: '',
      })
    }
  }

  const changeHeight = () => {
    if (data.value.height > data.value.maxHeight) {
      data.value.maxHeight = data.value.height
    }
  }

  const dialogFn = (flag: boolean) => {
    dialogVisible.value = false
    if (flag) {
      data.value.defaultValue = contentValue.value
    } else {
      contentValue.value = data.value.defaultValue
    }
  }
</script>

<style scoped lang="scss">
  :deep(.myStyle .el-table .cell) {
    padding: 0 !important;
  }
</style>
