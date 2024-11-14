<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>多实例配置</span>

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
      empty-text="请配置多实例"
      stripe
      style="width: 100%"
    >
      <el-table-column label="开始节点">
        <template #default="scope">
          <ab-tooltip-tag
            v-if="flowSetting.nodeMap[scope.row.startNode]"
            :text="flowSetting.nodeMap[scope.row.startNode]['nodeName']"
          />
          <el-tag v-else type="danger">节点已被删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="结束节点">
        <template #default="scope">
          <ab-tooltip-tag
            v-if="flowSetting.nodeMap[scope.row.endNode]"
            :text="flowSetting.nodeMap[scope.row.endNode]['nodeName']"
          />
          <el-tag v-else type="danger">节点已被删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="回收模式">
        <template #default="scope">
          <ab-tooltip-tag
            :text="
              info.MultiInstRrecovery.find(
                (item) => item.key == scope.row.recovery
              )['desc']
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="分发模式">
        <template #default="scope">
          <ab-tooltip-tag
            :text="
              {
                cand: '候选人分发',
                subtable: '子表分发',
                subflow: '子流程分发',
              }[scope.row.dish]
            "
          />
        </template>
      </el-table-column>

      <el-table-column fixed="right" width="120">
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
      destroy-on-close
      title="多实例配置对话框"
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
          label-width="120px"
          :model="info.data"
        >
          <el-form-item
            label="开始节点"
            placeholder="请选择"
            prop="startNode"
            :rules="[
              { required: true, trigger: 'blur', message: '请选择开始节点' },
            ]"
          >
            <el-select v-model="info.data.startNode">
              <el-option
                v-for="item in userTaskNodes"
                :key="item.nodeKey"
                :label="item.nodeName"
                :value="item.nodeKey"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="结束节点"
            placeholder="请选择"
            prop="endNode"
            :rules="[
              { required: true, trigger: 'blur', message: '请选择结束节点' },
            ]"
          >
            <el-select v-model="info.data.endNode">
              <el-option
                v-for="item in userTaskNodes"
                :key="item.nodeKey"
                :label="item.nodeName"
                :value="item.nodeKey"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="!isCallActivity()"
            label="回收模式"
            prop="recovery"
            :rules="[
              { required: true, trigger: 'blur', message: '请选择回收模式' },
            ]"
          >
            <el-select v-model="info.data.recovery">
              <el-option
                v-for="item in info.MultiInstRrecovery"
                :key="item.key"
                :label="item.desc"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="分发模式"
            prop="dish"
            :rules="[
              { required: true, trigger: 'blur', message: '请选择分发模式' },
            ]"
          >
            <el-select v-model="info.data.dish">
              <el-option label="候选人分发" value="cand" />
              <el-option label="子表分发" value="subtable" />
              <el-option
                v-if="isCallActivity()"
                label="子流程分发"
                value="subflow"
              />
            </el-select>
          </el-form-item>

          <span v-if="['subtable', 'subflow'].includes(info.data.dish)">
            <el-form-item
              v-if="flowSetting.bizModeList.length != 1"
              label="业务对象"
              prop="boCode"
              :rules="[
                { required: true, trigger: 'blur', message: '请选择业务对象' },
              ]"
            >
              <el-select v-model="info.data.boCode" @change="boChange">
                <el-option
                  v-for="item in flowSetting.bizModeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="业务表"
              prop="tableCode"
              :rules="[
                { required: true, trigger: 'blur', message: '请选择业务表' },
              ]"
            >
              <el-select v-model="info.data.tableCode">
                <el-option
                  v-for="item in getAllRels()"
                  :key="item.tableCode"
                  :label="`${item.tableComment}（${item.typeDesc}）`"
                  :value="item.tableCode"
                />
              </el-select>
            </el-form-item>
            <span v-if="info.data.dish == 'subtable'">
              <el-form-item
                label="候选人类型"
                prop="candType"
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    message: '请选择候选人类型',
                  },
                ]"
              >
                <el-select v-model="info.data.candType">
                  <el-option
                    v-for="item in info.GroupType"
                    :key="item.type"
                    :label="item.desc"
                    :value="item.type"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="候选人字段"
                prop="candColumn"
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    message: '请选择候选人字段',
                  },
                ]"
              >
                <el-select v-if="getRel()" v-model="info.data.candColumn">
                  <el-option
                    v-for="item in getRel().table.columnsWithoutPrimary"
                    :key="item.code"
                    :label="item.comment"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </span>

            <span v-if="info.data.dish == 'subflow'">
              <el-form-item
                label="以子表数据启动"
                label-width="125"
                prop="subStart"
              >
                <el-switch
                  v-model="info.data.subStart"
                  active-text="是"
                  inactive-text="否"
                  inline-prompt
                />
              </el-form-item>
            </span>
          </span>
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
  import { abTools, sysApi, bizApi } from '~/agilebpm'

  const props = defineProps({
    nodeConfig: { required: true, type: Object as PropType<NodeConfig> },
    flowSetting: { required: true, type: Object as PropType<FlowSetting> },
    pluginData: {
      required: true,
      type: Array as PropType<Array<BpmWordTemplate>>,
    },
  })

  const { pluginData, flowSetting } = toRefs(props)

  const userTaskNodes: any = []

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
    MultiInstRrecovery: null,
    bo: null,
    GroupType: null,
  })

  sysApi.tools
    .getEnum(
      'com.dstz.bpm.engine.plugin.node.multiinst.MultiInstRrecovery',
      true
    )
    .then((resp) => {
      info.MultiInstRrecovery = resp.data
    })

  sysApi.tools
    .getEnum('com.dstz.org.api.enums.GroupType', true)
    .then(({ data }) => {
      info.GroupType = data
      info.GroupType.push({ type: 'user', desc: '用户' })
    })

  onMounted(() => {
    for (const nodeKey in props.flowSetting.nodeMap) {
      userTaskNodes.push(props.flowSetting.nodeMap[nodeKey])
    }

    console.info(userTaskNodes)
    console.info(props)
  })

  const deletePlugin = () => {
    ElMessageBox.confirm('确定删除此插件吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delete flowSetting.value.plugins['multiInst']
      })
      .catch(() => {})
  }

  const dialogOk = async () => {
    if (!formRef) return

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
    //新增
    if (index == -1) {
      info.data = {
        startNode: '',
        endNode: '',
        recovery: 'auto',
        dish: 'cand',
        boCode: '',
        tableCode: '',
        candType: 'user',
        candColumn: '',
        subStart: false,
      }
    } else {
      info.data = abUtil.clone(pluginData.value[index])
    }
    if (flowSetting.value.bizModeList.length == 1) {
      info.data.boCode = flowSetting.value.bizModeList[0].code
      boChange()
    }
    info.activeIndex = index
    info.dialogVisible = true
  }

  const boChange = () => {
    if (!info.data.boCode) {
      return
    }
    bizApi.bizObject.getBizObject(info.data.boCode).then((resp) => {
      info.bo = resp.data
    })
  }

  const getAllRels = (rel = null) => {
    if (!info.bo) {
      return []
    }
    if (!rel) {
      rel = info.bo.rel
    }
    const list: any = []
    rel.children.forEach((c: any) => {
      list.push(c)
      const l = getAllRels(c)
      l.forEach((r: any) => {
        list.push(r)
      })
    })

    return list
  }

  const getRel = () => {
    const rels = getAllRels()
    return rels.find((r) => r.tableCode == info.data.tableCode)
  }

  const isCallActivity = () => {
    //节点相同，且节点是外部子流程
    if (info.data.startNode && info.data.startNode == info.data.endNode) {
      const node = userTaskNodes.find((n) => n.nodeKey == info.data.startNode)
      if (node && node.nodeType == 'CallActivity') return true
    }
    return false
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
