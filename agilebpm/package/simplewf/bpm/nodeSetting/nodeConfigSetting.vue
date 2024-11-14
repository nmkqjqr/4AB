<template>
  <el-drawer
    v-model="data.approverDrawer"
    :append-to-body="true"
    :destroy-on-close="true"
    placement="right"
    size="760px"
    :transfer="true"
    @close="$emit('approverDrawerClose', null)"
  >
    <template #header>
      <span style="font-size: 16px">节点设置-{{ nodeDef.nodeName }}</span>
    </template>

    <div style="height: 100%; padding: 10px; overflow: auto">
      <el-tabs
        v-if="nodeDef.nodeType === 'UserTask'"
        v-model="data.userConfigTab"
        name="userConfigTab"
      >
        <el-tab-pane label="设置属性" name="1">
          <el-form label-width="60px" :model="nodeDef">
            <el-form-item
              label="名称"
              prop="nodeName"
              :rules="[
                { required: true, message: '必填' },
                { max: 50, message: '最多可输入50个字符' },
              ]"
            >
              <el-input v-model="nodeDef.nodeName" />
            </el-form-item>
            <el-form-item
              label="描述"
              :rules="[{ max: 350, message: '最多可输入350个字符' }]"
            >
              <el-input v-model="nodeDef.nodeDesc" type="textarea" />
            </el-form-item>
          </el-form>
          <el-form :label-width="140" :model="nodeDef">
            <el-card>
              <div style="height: 40px; font-size: 16px; line-height: 40px">
                候选人设置
              </div>
              <userSetting
                :common-util="commonUtil"
                :user-rules="nodeDef.plugins.nodeUser"
              />
            </el-card>
            <br />
            <el-divider content-position="left">操作按钮设置</el-divider>

            <el-checkbox-group v-model="nodeDef.buttonList">
              <el-checkbox
                v-for="btn in data.buttonList"
                :key="btn.actionName"
                border
                :label="btn"
                size="small"
                style="margin-right: 12px; margin-bottom: 4px"
              >
                {{ btn.name }}
              </el-checkbox>
            </el-checkbox-group>
            <br />
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="表单权限设置" name="2" tab="userConfigTab">
          <formPermissionSetting
            :common-util="commonUtil"
            :node-def="nodeDef"
          />
        </el-tab-pane>
        <el-tab-pane label="开启会签投票" name="3" tab="userConfigTab">
          <el-form :label-width="120" :model="nodeDef">
            <el-form-item label="是否开启">
              <el-switch
                v-model="nodeDef.plugins.sign.open"
                active-text="是"
                inactive-text="否"
                inline-prompt
              />
            </el-form-item>
            <span v-show="nodeDef.plugins.sign.open">
              <el-form-item label="审批方式">
                <el-radio-group v-model="nodeDef.plugins.sign.approvalType">
                  <el-tooltip
                    content="根据配置的节点人员进行串行逐个审批"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-radio-button label="serial">串行</el-radio-button>
                  </el-tooltip>
                  <el-tooltip
                    content="根据配置的节点人员进行并行同时审批"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-radio-button label="parallel">并行</el-radio-button>
                  </el-tooltip>
                  <el-tooltip
                    content="根据配置的节点人员进行并行审批投票"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-radio-button label="vote">投票</el-radio-button>
                  </el-tooltip>
                </el-radio-group>
              </el-form-item>
              <span v-show="nodeDef.plugins.sign.approvalType == 'vote'">
                <el-form-item label="同意策略">
                  <el-radio-group v-model="nodeDef.plugins.sign.countType">
                    <el-radio-button label="percent">百分比</el-radio-button>
                    <el-radio-button label="number">投票数</el-radio-button>
                  </el-radio-group>
                  <el-input-number
                    v-show="nodeDef.plugins.sign.countType == 'percent'"
                    v-model="nodeDef.plugins.sign.percent"
                    :max="100"
                    :min="1"
                    placeholder="百分比"
                    style="margin-left: 10px"
                  />
                  <span v-show="nodeDef.plugins.sign.countType == 'percent'">
                    %
                  </span>
                  <el-input-number
                    v-show="nodeDef.plugins.sign.countType == 'number'"
                    v-model="nodeDef.plugins.sign.number"
                    :min="1"
                    placeholder="投票数"
                    style="margin-left: 10px"
                  />
                  <span v-show="nodeDef.plugins.sign.countType == 'number'">
                    票
                  </span>
                </el-form-item>
                <el-form-item label="结束策略">
                  <el-radio-group v-model="nodeDef.plugins.sign.endType">
                    <el-radio-button label="all">
                      所有人都需要投票
                    </el-radio-button>
                    <el-radio-button label="satisfy">
                      满足同意策略后不再等待剩下人员投票
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="投票不通过时">
                  <el-radio-group v-model="nodeDef.plugins.sign.opposeAction">
                    <el-radio-button label="oppose">
                      标记结果为反对
                    </el-radio-button>
                    <el-radio-button label="reject">
                      执行驳回操作
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </span>
            </span>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-form
        v-if="nodeDef.nodeType === 'ServiceTask'"
        label-width="100px"
        :model="nodeDef"
      >
        <el-form-item
          label="名称"
          :rules="[
            { required: true, message: '必填' },
            { max: 50, message: '最多可输入50个字符' },
          ]"
        >
          <el-input v-model="nodeDef.nodeName" />
        </el-form-item>
        <el-form-item
          label="描述"
          :rules="[{ max: 350, message: '最多可输入350个字符' }]"
        >
          <el-input v-model="nodeDef.nodeDesc" type="textarea" />
        </el-form-item>
        <el-card>
          <div style="height: 40px; font-size: 16px; line-height: 40px">
            抄送人设置
          </div>
          <userSetting
            :common-util="commonUtil"
            :user-rules="nodeDef.plugins.carbonCopy.userRules"
          />
        </el-card>
        <br />
        <el-divider content-position="left">抄送消息设置</el-divider>
        <el-form-item label="通知方式">
          <ab-msg-type v-model="nodeDef.plugins.carbonCopy.msgType" />
        </el-form-item>
        <el-form-item
          label="选择消息模板"
          label-width="auto"
          placeholder=""
          prop="templateCode"
          :rules="[{ required: true, message: '请选择消息模板' }]"
        >
          <msg-template v-model="nodeDef.plugins.carbonCopy.templateCode" />
        </el-form-item>

        <el-divider content-position="left" orientation="left">
          表单权限设置
        </el-divider>
        <formPermissionSetting
          :common-util="commonUtil"
          :node-def="nodeDef"
          :readonly="true"
        />
      </el-form>
      <el-form v-if="nodeDef.nodeType === 'StartNoneEvent'" :label-width="140">
        <el-divider content-position="left" orientation="left">
          权限设置
        </el-divider>
        <formPermissionSetting :common-util="commonUtil" :node-def="nodeDef" />
      </el-form>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
  import userSetting from './userSetting.vue'
  import formPermissionSetting from './formPermissionSetting.vue'
  import { abMsgType } from '@ab-core'
  import msgTemplate from '~/agilebpm/package/ab-common-resource/bpmDesign/msgTemplate.vue'
  import { sysApi } from '@agilebpm/api'
  const props = defineProps({
    nodeDef: { required: true, type: Object },
    commonUtil: { required: true, type: Object },
  })

  const { nodeDef, commonUtil } = toRefs(props)
  const data: any = reactive({
    isShow: true,
    userConfigTab: '1',
    approverDrawer: false,
    selectItem: {},
    currentNodeBtns: [],
    msgType: [],
    //节点默认的全部按钮
    buttonList: [
      {
        groovyScript: '',
        name: '同意',
        actionName: 'agree',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '保存',
        actionName: 'save',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '发起会签',
        actionName: 'signStart',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '传阅',
        actionName: 'carbonCopy',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '驳回',
        actionName: 'reject',
        javaScript: '',
      },
      /* {
      name: '撤回',
      actionName: 'recall',
      javaScript: '',
      groovyScript: '',
    },
    {
      name: '撤销',
      actionName: 'revoke',
      javaScript: '',
      groovyScript: '',
    },*/
      {
        groovyScript: '',
        name: '审批历史',
        actionName: 'taskOpinion',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '流程图',
        actionName: 'flowImage',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '转办',
        actionName: 'turn',
        javaScript: '',
      },
      {
        groovyScript: '',
        name: '人工终止',
        actionName: 'manualEnd',
        javaScript: '',
      },

      {
        groovyScript: '',
        name: '打印',
        actionName: 'printed',
        javaScript: '',
      },
    ],
  })

  onMounted(() => {
    if (nodeDef.value && nodeDef.value.buttonList) {
      nodeDef.value.buttonList.forEach((item: any) => {
        data.currentNodeBtns.push(item.actionName)
      })
    }
  })

  // 把button 设置到 nodeDef.value.buttonList 中
  const buttonChange = (values: any) => {
    nodeDef.value.buttonList = data.buttonList.filter((item: any) => {
      return values.indexOf(item.actionName) >= 0
    })
  }
  const show = () => {
    //初始化数据
    if (!nodeDef.value?.carbonCopy?.templateCode) {
      nodeDef.value.carbonCopy = {
        nodeKey: '',
        desc: '',
        formType: 'instance',
        event: '',
        userRules: [],
        msgType: 'email,inner',
        templateCode: 'copy_template',
      }
    }
    data.approverDrawer = true
  }
  const emit = defineEmits(['approverDrawerClose'])
  const onClose = () => {
    emit('approverDrawerClose', null)
  }
  defineExpose({
    //
    show,
  })
</script>
<style scoped>
  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-right: 12px !important;
    margin-left: 0px !important;
  }
  td {
    padding: 10px;
  }
  fieldset {
    padding: 10px;
    border: 2px dotted #ddd;
  }
</style>
