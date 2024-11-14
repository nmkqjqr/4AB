<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>节点表单初始化</span>

        <el-button text @click="deletePlugin()">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>
    </template>

    <el-table
      border
      :data="flowSetting.nodeInitList"
      empty-text="请配置节点表单初始化"
      stripe
      style="width: 100%"
    >
      {{ props.boList }}
      <el-table-column label="节点" :show-overflow-tooltip="true">
        <template #default="scoped">
          <span v-if="flowSetting.nodeMap[scoped.row.nodeKey]">
            {{ flowSetting.nodeMap[scoped.row.nodeKey]['nodeName'] }}
          </span>
          <el-tag v-else type="danger">节点已被删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="100">
        <template #default="scoped">
          {{ scoped.row.desc }}
        </template>
      </el-table-column>

      <el-table-column prop="address" width="155">
        <template #header>
          <el-button :icon="Plus" text type="primary" @click="addNodeDialog">
            新增
          </el-button>
        </template>

        <template #default="scoped">
          <el-button
            size="small"
            style="padding-right: 1px; padding-left: 1px"
            text
            type="primary"
            @click="editNodeDialog(scoped.row, scoped.$index)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            text
            type="primary"
            @click="delNodeDialog(scoped.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :before-close="handleClose"
      title="节点表单初始化配置"
      width="50%"
    >
      <div
        :style="{
          overflow: 'auto',
        }"
      >
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="data.nodeData"
        >
          <el-form-item
            label="脚本描述"
            placeholder="请输入脚本描述"
            prop="desc"
            :rules="[{ required: true, message: '请输入脚本描述' }]"
          >
            <el-input v-model="data.nodeData.desc" style="width: 360px" />
          </el-form-item>

          <el-form-item
            label="初始化节点"
            prop="nodeKey"
            :rules="[{ required: true, message: '请选择初始化节点' }]"
          >
            <el-select v-model="data.nodeData.nodeKey" clearable >
              <el-option
                v-for="item in userTaskNodes"
                :key="item.nodeKey"
                :label="item.nodeName"
                :value="item.nodeKey"
              />
            </el-select>
          </el-form-item>

          <div style="margin-bottom: 5px; margin-left: 120px; overflow: hidden">
            <el-space>
              <script-variable-select v-model="data.nodeData.beforeShow" is-node-init = true :is-close-script-variables = "info.isCloseScriptVariables" />
            </el-space>
          </div>

          <el-form-item label="展示前脚本" placeholder="" prop="beforeShow">
            <codemirror
              v-model="data.nodeData.beforeShow"
              :autofocus="true"
              :indent-with-tab="true"
              placeholder=""
              :style="{
                height: `90px`,
                border: `1px solid #e4e7ed`,
                width: `100%`,
              }"
            />
          </el-form-item>
          <div style="margin-bottom: 5px; margin-left: 120px; overflow: hidden">
            <el-space>
              <el-space>
                <script-variable-select v-model="data.nodeData.whenSave"  is-node-init = true :is-close-script-variables = "info.isCloseScriptVariables"  />
              </el-space>
            </el-space>
          </div>

          <el-form-item label="保存后脚本" placeholder="" prop="whenSave">
            <codemirror
              v-model="data.nodeData.whenSave"
              :autofocus="true"
              :indent-with-tab="true"
              placeholder=""
              :style="{
                height: `90px`,
                border: `1px solid #e4e7ed`,
                width: `100%`,
              }"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogOk">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
  import { Plus, Close } from '@element-plus/icons-vue'
  import { defineProps, PropType, reactive } from 'vue'
  import { ElMessage, FormInstance } from 'element-plus'
  import { Codemirror } from 'vue-codemirror'
  import nodeUser from '../../ab-setting/node-setting/node-user/nodeUser.vue'
  import msgTemplate from '~/agilebpm/package/ab-common-resource/bpmDesign/msgTemplate.vue'

  import * as abUtil from '~/agilebpm/utils/ab-util'
  import { cascaderOptions } from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/conditionScriptConfig'
  import scriptVariableSelect from '~/agilebpm/package/ab-common-resource/bpmDesign/conditionScript/scriptVariableSelect.vue'

  const props = defineProps({
    nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
    boList: {
      required: true,
      type: Array,
    },
    typeList: {
      required: true,
      type: Array,
      default: () => {
        return []
      },
    },
  })

  const { flowSetting, boList } = toRefs(props)

  onMounted(() => {})

  const userTaskNodes = inject('userNodeList') as Array<NodeConfig>

  // 设置脚本变量的
  const setVariableScript = (type: string) => {
    data.nodeData[type] = `${data.nodeData[type]} ${data.nodeData[
      `${type}_scriptVariables`
    ].join('.')}`
    window.setTimeout(() => {}, 100)
  }


  const formRef = ref()

  const data = reactive({
    nodeData: {} as NodeInit,
    dialogHeight: document.documentElement.clientHeight * 0.65,
    scriptVariables: [] as any,
  })
  
  const deletePlugin = () => {
    //此处不应该删除nodeInit ，nodeInit不应该存在
    ElMessageBox.confirm('确定删除此插件吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delete flowSetting.value.plugins['nodeInit']
        flowSetting.value.nodeInitList = []
      })
      .catch(() => {})
  }

  //dialog
  const dialogVisible = ref(false)

  const handleClose = (done: () => void) => {
    done()
  }

  let index = -1
  const addNodeDialog = () => {
    index = -1
    dialogVisible.value = true
    data.nodeData = {
      desc: '',
      nodeKey: '',
      beforeShow: '',
      whenSave: '',
      beforeShow_scriptVariables: [],
      whenSave_scriptVariables: [],
    }
    initBoData()
  }
  const initBoData = () => {
    //初始化对象字段
    data.scriptVariables = []
    // 赋值下 通用变量
    cascaderOptions.forEach((item) => {
      data.scriptVariables.push(item)
    })
    initBo(boList)
  }
  const pageData = reactive({
    variables: {
      value: 'variableScope',
      label: '流程变量',
      type: 'variables',
      children: [] as object[],
    },
  })

  const initBo = (boList: any) => {
    boList.value.forEach((item: any) => {
      const boData = {
        value: item.code,
        label: item.rel.tableComment,
        type: 'main',
        valuePath: item.rel.tableCode,
        children: [],
      }

      getTableColumnByRel(item.rel, boData)

      data.scriptVariables.push(boData)
    })
  }
  const info: any = reactive({
    isCloseScriptVariables: false,
  })

  
  watch(()=>data.nodeData.nodeKey,(newValue:any)=>{
    if(newValue && newValue.indexOf('StartEvent')!=-1){
      info.isCloseScriptVariables = true
    }else{
      info.isCloseScriptVariables = false
    }
  })
  const getTableColumnByRel = (rel: any, boData: any) => {
    if (!rel.table && !rel.table.columnsWithoutPrimary.length) return

    boData.children = []
    rel.table.columns.forEach((column: any) => {
      boData.children.push({
        label: column.comment,
        code:
          boData.type === 'main'
            ? column.code
            : `List<IBusinessData> businessData = ${column.code}`,
        value:
          boData.type === 'main'
            ? `put('${column.code}','')`
            : `"获取子表： List<IBusinessData> 请根据实际情况获取子表数据 businessData.put('${column.code}','') }`,
        type: boData.type === 'main' ? column.type : 'List',
      })
    })

    // 第二层只处理字段，不处理它的子表，直接不加进去啦
    if (rel.children && rel.children.length > 0) {
      rel.children.forEach((tableRel: any) => {
        const child = {
          code: tableRel.tableCode,
          label: tableRel.tableComment,
          value: `getChildren('${tableRel.tableCode}')`,
          disabled: boData.type !== 'main',
          type: tableRel.type,
          children: [],
        }

        boData.children.push(child)
        getTableColumnByRel(tableRel, child)
      })
    }
  }

  const editNodeDialog = (row: NodeInit, indexNum: number) => {
    dialogVisible.value = true
    data.nodeData = abUtil.clone(row)
    index = indexNum
    initBoData()
  }

  const saveNodeDialog = () => {
    //编辑
    const newData = abUtil.clone(data.nodeData)
    if (index != -1) {
      flowSetting.value.nodeInitList.splice(index, 1, newData)
    } else {
      //新增
      flowSetting.value.nodeInitList.push(newData)
    }
    index = -1
    dialogVisible.value = false
  }

  const delNodeDialog = (index: number) => {
    flowSetting.value.nodeInitList.splice(index, 1)
  }

  // 条件脚本赋值
  const chooseresBeforeShow = (list: any) => {
    if (list) {
      data.nodeData.beforeShow = list[0].script
    }
  }
  const chooseresWhenSave = (list: any) => {
    if (list) {
      data.nodeData.whenSave += ` ${list[0].script}`
    }
  }

  const dialogOk = async () => {
    debugger
    if (!formRef) return

    await formRef.value.validate((valid: any) => {
      if (valid) {
        saveNodeDialog()
      } else {
        ElMessage({
          message: '请完善表单！',
          type: 'warning',
        })
      }
    })
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
