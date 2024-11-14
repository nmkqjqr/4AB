<template>
  <span>
    <el-form-item label="默认值">
      <el-button
        :icon="Edit"
        round
        size="small"
        type="primary"
        @click="info.dialogVisible = true"
      >
        配置
      </el-button>
    </el-form-item>

    <el-dialog
      v-model="info.dialogVisible"
      style="width: 90%"
      title="内容编辑"
      @close="dialogFn(false)"
    >
      <ab-rich-editor v-model="info.contentValue" />
      <template #footer>
        <el-button text type="default" @click="dialogFn(false)">取消</el-button>
        <el-button type="primary" @click="dialogFn(true)">确定</el-button>
      </template>
    </el-dialog>

    <el-form-item>
      <template #label>
        <div>
          <el-tooltip
            class="box-item"
            content="对富文本默认值的变量进行动态替换。例如，变量配置定义了createdUserName，来映射表单中值为张三字段，将会把富文本【欢迎您，{createdUserName}】替换为【欢迎您，张三】"
            effect="dark"
            placement="top-start"
          >
            <el-icon style="margin: 0">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
          变量替换：
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

    <div
      v-if="config.control.param && config.control.param.length > 0"
      class="myStyle"
    >
      <el-table
        :cell-style="{
          height: '40px',
          padding: '0',
        }"
        :data="config.control.param"
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
              变量定义
            </div>
          </template>
          <template #default="{ row }">
            <el-input
              v-model="row.key"
              placeholder="请输入"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="参数值">
          <template #default="{ row }">
            <el-select
              v-model="row.value"
              allow-create
              clearable
              filterable
              placeholder="全局参数"
            >
              <el-option
                v-for="item in formCombination?.designJson?.params"
                :key="'{' + item.name + '}'"
                :label="item.name"
                :value="'{' + item.name + '}'"
              />
              <!-- {{ formCombination?.designJson?.params }}
      <span
        v-for="param in formCombination?.designJson?.params"
        :key="param.name"
      >
        <el-option
          v-if="/^\$\{.*\}$/.test(param.value)"
          :label="param.name"
          :value="param.name"
        />
        <el-option v-else :label="param.name" :value="param.value" />
      </span> -->
            </el-select>
          </template>
        </el-table-column>

        <el-table-column width="35">
          <template #default="{ $index }">
            <el-button link type="danger">
              <el-icon
                :size="22"
                @click="() => config.control.param.splice($index, 1)"
              >
                <Delete />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </span>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import { abUtil } from '~/agilebpm'
  import { Plus, Edit } from '@element-plus/icons-vue'
  import { bizApi, cmsApi, sysApi } from '~/agilebpm/api'
  import { Codemirror } from 'vue-codemirror'
  import { abRichEditor } from '@ab-core'
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

  const { config } = toRefs(props)

  const info: any = reactive({
    dialogVisible: false,
    contentValue: config.value.control.contentValue,
  })

  const dialogFn = (flag: boolean) => {
    info.dialogVisible = false
    if (flag) {
      config.value.control.contentValue = info.contentValue
      props.config.initFunction()
    } else {
      info.contentValue = config.value.control.contentValue
    }
  }

  const addParam = () => {
    if (!config.value.control.param || config.value.control.param.length == 0) {
      config.value.control.param = [
        {
          key: '',
          value: '',
        },
      ]
    } else {
      config.value.control.param.push({
        key: '',
        value: '',
      })
    }
  }
</script>

<style scoped lang="scss">
  :deep(.myStyle .el-table .cell) {
    padding: 0 !important;
  }
</style>
