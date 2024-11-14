<template>
  <div>
    <el-divider content-position="center">应用列表配置</el-divider>
    <el-form-item label="自定义列表">
      <el-input v-model="config.control.name" placeholder="请选择" readonly>
        <template #append>
          <ab-cust-dialog
            v-model="config.control"
            dialog-key="custGrid"
            type="primary"
            :value-mapping="{ code: 'code', name: 'name' }"
            @ok="ok"
          >
            选择
          </ab-cust-dialog>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="入参">
      <el-select
        v-model="config.control.condition"
        multiple
        placeholder="请选择"
        style="width: 240px"
        value-key="fieldName"
        @change="changeCondition"
      >
        <el-option
          v-for="item in info.condition"
          :key="item.fieldName"
          :label="item.fieldDesc"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-table
      border
      :data="config.control.condition"
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column label="过滤条件" prop="conditionName">
        <template #default="scope">
          <span>{{ scope.row.conditionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="全局入参" prop="nameParam">
        <template #default="{ row }">
          <el-select
            v-model="row.nameParam"
            class="m-2"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in formCombination.designJson.params"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="name" label="操作">
          <template #default="{ $index }">
            <el-button
            :icon="Delete"
            text
            type="danger"
            @click="abUtil.Arrays.del($index, config.control.condition)"
          >
            删除
          </el-button>
          </template>
        </el-table-column> -->
    </el-table>
    <el-form-item label="赋值" style="margin-top: 15px">
      <el-select
        v-model="config.control.assignment"
        multiple
        placeholder="请选择"
        style="width: 240px"
        value-key="fieldName"
        @change="changeAssignment"
      >
        <el-option
          v-for="item in info.assignment"
          :key="item.fieldName"
          :label="item.fieldDesc"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-table
      border
      :data="config.control.assignment"
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column label="赋值字段" prop="fieldDesc">
        <template #default="scope">
          <span>{{ scope.row.fieldDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="全局入参" prop="nameParam">
        <template #default="{ row }">
          <el-select
            v-model="row.nameParam"
            class="m-2"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in formCombination.designJson.params"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="name" label="操作">
          <template #default="{ $index }">
            <el-button
            :icon="Delete"
            text
            type="danger"
            @click="abUtil.Arrays.del($index, config.control.condition)"
          >
            删除
          </el-button>
          </template>
        </el-table-column> -->
    </el-table>
    <!-- <el-form-item label="联动组件" style="margin-top: 15px">
      <el-select
        v-model="config.control.reloadCom"
        :multiple="true"
        style="width: 100%"
      >
        <template
          v-for="item in getFlatComponentList().filter(
            (i) => i.label !== config.label
          )"
          :key="item.key"
        >
          <el-option :label="item.label" :value="item.key" />
        </template>
      </el-select>
    </el-form-item> -->
    <el-alert
      title="主键入参取全局联动参数，如果主键发生变化，会触发表单重新加载"
      type="info"
    />
    <!-- <el-dialog
    v-model="info.dialogVisible"
    append-to-body
    destroy-on-close
    title="表单按钮"
    width="500"
  >
    <el-button :icon="Plus" text type="primary" @click="add">
      添加
    </el-button>
    <el-table :data="config.control.condition" style="width: 100%">
        <el-table-column prop="conditionValue" label="隐藏入参">
          <template #default="scope">
            <el-select v-model="scope.row.conditionValue" class="m-2" placeholder="Select">
              <el-option
                v-for="item in info.condition"
                :key="item.fieldName"
                :label="item.fieldDesc"
                :value="item.fieldName"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="全局入参">
          <template #default="{ row }">
            <el-select v-model="row.name" class="m-2" placeholder="Select">
              <el-option
                v-for="item in formCombination.designJson.params"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作">
          <template #default="{ $index }">
            <el-button
            :icon="Delete"
            text
            type="danger"
            @click="abUtil.Arrays.del($index, config.control.condition)"
          >
            删除
          </el-button>
          </template>
        </el-table-column>
      </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-space wrap>
          <el-button text type="primary" @click="info.dialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogOk">确定</el-button>
        </el-space>
      </span>
    </template>
  </el-dialog> -->
    <el-form-item label="定时刷新">
      <el-switch v-model="config.control.timedRefresh" />
    </el-form-item>
    <el-form-item
      v-if="config.control.timedRefresh"
      prop="control.refreshCycle"
      :rules="[
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入1以上的正整数（单位/秒）',
          trigger: 'change',
        },
      ]"
    >
      <template #label>
        <div>
          <el-tooltip
            class="box-item"
            content="刷新周期为1以上的正整数（单位/秒）"
            effect="dark"
            placement="top-start"
          >
            <el-icon style="width: 100%; font-style: normal">
              <QuestionFilled />
              刷新周期：
            </el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-input
        v-model="config.control.refreshCycle"
        type="number"
        @change="
          () => {
            if (config.control.refreshCycle < 1) {
              config.control.refreshCycle = 1
            } else {
              if (!Number.isInteger(config.control.refreshCycle))
                // 如果输入值有小数部分，则省略小数部分
                config.control.refreshCycle = Math.floor(
                  config.control.refreshCycle
                )
            }
          }
        "
      />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { defineProps, PropType, toRefs } from 'vue'
  import { Delete, Edit, Plus } from '@element-plus/icons-vue'
  import { sysApi, bizApi, bpmApi, postData, getData } from '~/agilebpm/api'
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
  // const getFlatComponentList = inject('getFlatComponentList') as any

  const { config, formCombination } = toRefs(props)
  const info = reactive({
    dialogVisible: false,
    condition: [],
    assignment: [],
  })

  onMounted(() => {
    //兼容老数据，对于之前没有过定时时间的都默认10
    if (!config.value.control.refreshCycle) {
      config.value.control.refreshCycle = 10
    }
    if (!config.value.control) {
      config.value.control = {
        condition: [],
        assignment: [],
        chooseType:0
      }
    }
    if (config.value.control.code) {
      loadData(config.value.control.code)
    }
  })
  // const ok = (list: any) => {
  //   loadData(list[0].code)
  // }
  const loadData = (code: any) => {
    info.condition = []
    postData(bizApi.custGrid.voUrl + code, {}).then(
      ({ data }) => {
        config.value.control.chooseType = data.chooseType
        // 处理查询条件
        data.sqlConditionVOS.forEach((item: any, index: any) => {
          if (item.showType == '2') {
            info.condition.push(item)
          }
        })
        info.assignment = JSON.parse(JSON.stringify(data.fieldsList))
      },
      ({ message }) => {
        // 如果不启用
      }
    )
  }
  const changeCondition = (value: any) => {
    value.forEach((item: any) => {
      if (!item.conditionName) {
        item.conditionName = item.fieldDesc
      }
      if (!item.nameParam) {
        item.nameParam = ''
      }
    })
  }
  const add = () => {
    props.config.control.condition.push({})
  }
  const dialogOk = () => {
    info.dialogVisible = false
  }

  const changeAssignment = () => {}

  watch(
    () => config.value.control.name,
    (newValue) => {
      if (config.value.control.code && config.value.control.code.length > 0) {
        loadData(config.value.control.code)
      }
      config.value.label = `${newValue}-列表`
    }
  )
</script>
