<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>word模板配置</span>

        <el-button text @click="deletePlugin()">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>
    </template>

    <el-table
      border
      :data="pluginData"
      empty-text="请配置word模板"
      stripe
      style="width: 100%"
    >
      <el-table-column label="节点">
        <template #default="scope">
          <span v-if="!scope.row.nodeKey">全局节点</span>
          <span v-else-if="flowSetting.nodeMap[scope.row.nodeKey]">
            {{ flowSetting.nodeMap[scope.row.nodeKey]['nodeName'] }}
          </span>
          <el-tag v-else type="danger">节点已被删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="word模板">
        <template #default="scope">
          <ab-tooltip-tag
            :text="`${scope.row.wordName}（${scope.row.wordCode}）`"
          />
        </template>
      </el-table-column>
      <el-table-column label="即时" width="60">
        <template #default="scope">
          {{ scope.row.immediate ? '是' : '否' }}
        </template>
      </el-table-column>

      <el-table-column width="155">
        <template #header>
          <el-button :icon="Plus" text type="primary" @click="edit(-1)">
            新增
          </el-button>
        </template>

        <template #default="scope">
          <el-button
            size="small"
            style="padding-right: 1px; padding-left: 1px"
            text
            type="primary"
            @click="edit(scope.$index)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            text
            type="primary"
            @click="abUtil.Arrays.del(scope.$index, pluginData)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--对话框-->
    <el-dialog
      v-model="info.dialogVisible"
      title="word模板对话框"
      width="500px"
    >
      <div
        :style="{
          overflow: 'auto',
        }"
      >
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="100px"
          :model="info.data"
        >
          <el-form-item
            label="节点"
            prop="nodeKey"
            :rules="[
              {
                message: '节点已配置模板',
                trigger: 'change',
                validator: nodeDuplicateRuleValidator,
              },
            ]"
          >
            <el-select
              v-model="info.data.nodeKey"
              clearable
              placeholder="默认：全局节点"
            >
              <el-option
                v-for="item in userTaskNodes"
                :key="item.nodeKey"
                :label="item.nodeName"
                :value="item.nodeKey"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="word模板"
            prop="wordCode"
            :rules="[
              { required: true, trigger: 'blur', message: '请选择模板' },
            ]"
          >
            <el-tag v-if="info.data.wordCode">
              {{ `${info.data.wordName}（${info.data.wordCode}）` }}
            </el-tag>
            <ab-cust-dialog
              v-model="info.data"
              dialog-key="wordTemplateSelector"
              :icon="Search"
              :param="{
                bo_code_$VIN: flowSetting.bizModeList.map((n) => n.code),
              }"
              size="small"
              style="margin-left: 5px"
              type="primary"
              :value-mapping="{ code: 'wordCode', name: 'wordName' }"
            >
              word打印
            </ab-cust-dialog>
          </el-form-item>
          <el-form-item label="是否即时" prop="immediate">
            <el-switch
              v-model="info.data.immediate"
              active-text="是"
              inactive-text="否"
              inline-prompt
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="info.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogOk">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
  import { Plus, Close, Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { PropType } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'

  const props = defineProps({
    nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
    pluginData: {
      required: true,
      type: Array as PropType<Array<BpmWordTemplate>>,
    },
  })

  const { pluginData, flowSetting } = toRefs(props)

  const userTaskNodes = inject('userNodeList') as Array<NodeConfig>

  const formRef = ref()

  //页面用到的双向绑定的信息
  const info: any = reactive({
    dialogVisible: false,
    data: {
      nodeKey: '',
      wordCode: '',
      wordName: '',
      immediate: false,
    },
    activeIndex: -1,
  })

  onMounted(() => {})

  const deletePlugin = () => {
    //此处不应该删除nodeInit ，nodeInit不应该存在
    ElMessageBox.confirm('确定删除此插件吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delete flowSetting.value.plugins['word']
      })
      .catch(() => {})
  }

  const dialogOk = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid: any) => {
      if (valid) {
        if (info.activeIndex == -1) {
          pluginData.value.push(info.data)
        } else {
          pluginData.value[info.activeIndex] = info.data
        }
        info.dialogVisible = false
      } else {
        ElMessage({
          message: '请完善表单！',
          type: 'warning',
        })
      }
    })
  }

  const edit = (index: number) => {
    if (flowSetting.value.bizModeList.length == 0) {
      ElMessage({
        message: '流程还没配置业务对象',
        type: 'warning',
      })
      return
    }
    //新增
    if (index == -1) {
      info.data = {
        nodeKey: '',
        wordCode: '',
        wordName: '',
        immediate: false,
      }
    } else {
      info.data = abUtil.clone(pluginData.value[index])
    }
    info.activeIndex = index
    info.dialogVisible = true
  }

  const nodeDuplicateRuleValidator = (rule: any, value: any, callback: any) => {
    let b = false
    pluginData.value.forEach((item, i) => {
      if (i != info.activeIndex && item.nodeKey == value) {
        b = true
      }
    })
    if (!b) {
      callback()
    } else {
      callback(new Error(rule.message))
    }
  }
</script>
<style scoped lang="scss">
  :deep(.el-card__header) {
    padding: 4px 12px !important;
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    line-height: 36px;
  }
</style>
