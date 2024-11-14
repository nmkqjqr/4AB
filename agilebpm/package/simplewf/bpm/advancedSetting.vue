<template>
  <div
    class="t-a-c"
    style="z-index: 9999; display: flex; justify-content: center"
  >
    <div
      class="t-a-l"
      style="
        display: inline-block;
        width: 660px;
        padding-top: 20px;
        background-color: white;
      "
    >
      <el-form
        ref="advancedSettingForm"
        label-width="160px"
        :model="flowSetting"
      >
        <el-form-item label="属性设置：">
          <div style="text-align: left">
            <el-checkbox v-model="flowSetting.bpmProperties.allowExecutorEmpty">
              任务执行人是否可以为空
            </el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="意见弹窗设置：">
          <el-radio-group v-model="flowSetting.bpmProperties.requiredOpinion">
            <el-radio label="不弹" value="false" />
            <el-radio label="弹" value="true" />
            <el-radio label="意见必填" value="trueAndRequired" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="流程节点自动跳过：">
          <div style="text-align: left">
            <el-checkbox
              v-model="flowSetting.plugins.nodeSkip.firstskip"
              label="流程第一个节点跳过"
            />
            <br />
            <el-checkbox
              v-model="flowSetting.plugins.nodeSkip.nextskip"
              label="下一节点执行人是当前任务处理人跳过"
            />
            <br />
            <el-checkbox
              v-model="flowSetting.plugins.nodeSkip.nullskip"
              label="任务节点执行人为空跳过"
            />
            <br />
            <el-checkbox
              v-model="flowSetting.plugins.nodeSkip.allskip"
              label="所有节点跳过(用于流程测试)"
            />
          </div>
        </el-form-item>
        <el-form-item label="明确任务候选人：">
          <div style="text-align: left">
            <el-checkbox v-model="flowSetting.plugins.ensureCandidate.enable">
              启动时，明确所有任务候选人
            </el-checkbox>
            <br />
            <el-checkbox
              v-model="flowSetting.plugins.ensureCandidate.canSetUserNodes"
              :disabled="!flowSetting.plugins.ensureCandidate.enable"
            >
              发起人可修改所有任务候选人
            </el-checkbox>
            <br />
            <el-checkbox
              v-model="flowSetting.plugins.ensureCandidate.userCanEmpty"
            >
              任务候选人可以为空
            </el-checkbox>
            <br />
            <el-checkbox
              v-model="flowSetting.plugins.ensureCandidate.skiptBeforMyTask"
              :disabled="!flowSetting.plugins.ensureCandidate.enable"
            >
              后续环节存在相同任务时，跳过当前任务
            </el-checkbox>
            <br />
          </div>
        </el-form-item>

        <el-form-item label="待办通知方式：" prop="msgType">
          <ab-msg-type v-model="flowSetting.plugins.nodeMessage[0].msgType" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { sysApi } from '@agilebpm/api'
  import { abMsgType } from '@ab-core'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    flowSetting: { required: true, type: Object },
  })
  const { flowSetting } = toRefs(props)

  const data: any = reactive({
    msgType: [],
  })

  const validate = () => {
    const validateMsg: never[] = []
    return validateMsg
  }

  const tipmessage = (val: any) => {
    if (val) {
      ElMessage({
        showClose: true,
        message: '选择支持移动端，请配置移动端表单',
        type: 'info',
      })
    }
  }
  watch(
    () => flowSetting.value?.plugins?.nodeMessage[0]?.msgType,
    (newVal) => {
      flowSetting.value.plugins.nodeMessage[1].msgType = newVal
    },
    { deep: true, immediate: true }
  )

  defineExpose({
    validate,
  })
</script>
<style></style>
