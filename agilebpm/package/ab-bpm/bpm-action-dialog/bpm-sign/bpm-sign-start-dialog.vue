<template>
  <el-dialog
    :append-to-body="true"
    :before-close="dialogCancel"
    draggable
    :model-value="props.isShow"
    :title="props.title"
    width="700px"
  >
    <el-form
      ref="formRef"
      label-suffix="："
      label-width="auto"
      :model="info.data"
    >
      <el-form-item
        :label="$abT('bpm.office.countersigningPersonnel', '会签人员')"
        prop="users"
        :rules="{
          required: true,
          message: $abT('page.common.pleaseSelectPersonnel', '请选择人员'),
          trigger: 'blur',
        }"
      >
        <ab-cust-dialog
          dialog-key="userSelector"
          :icon="Plus"
          type="primary"
          @ok="add"
        >
          {{ $abT('bpm.office.addUsers', '增加用户') }}
        </ab-cust-dialog>
        <el-tag
          v-for="user in info.data.users"
          :key="user.key"
          closable
          type="success"
          @close="abUtil.Arrays.remove(user, info.data.users)"
        >
          {{ user.name }}
        </el-tag>
      </el-form-item>

      <el-form-item
        :label="$abT('bpm.office.approvalMethod', '审批方式')"
        prop="approvalType"
        :rules="{
          required: true,
          message: $abT('page.common.required', '必填'),
        }"
      >
        <el-radio-group v-model="info.data.approvalType">
          <el-tooltip
            :content="
              $abT(
                'bpm.office.configuredNodepersonnelSign',
                '根据配置的节点人员进行串行逐个审批'
              )
            "
            effect="dark"
            placement="top-start"
          >
            <el-radio-button label="serial">
              {{ $abT('bpm.office.serial ', '串行') }}
            </el-radio-button>
          </el-tooltip>
          <el-tooltip
            :content="
              $abT(
                'bpm.office.configuredNodepersonnelParallel',
                '根据配置的节点人员进行并行同时审批'
              )
            "
            effect="dark"
            placement="top-start"
          >
            <el-radio-button label="parallel">
              {{ $abT('bpm.office.parallel', '并行') }}
            </el-radio-button>
          </el-tooltip>
          <el-tooltip
            :content="
              $abT(
                'bpm.office.sigParallelVoting',
                '根据配置的节点人员进行并行审批投票'
              )
            "
            effect="dark"
            placement="top-start"
          >
            <el-radio-button label="vote">
              {{ $abT('bpm.office.vot', '投票') }}
            </el-radio-button>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        :label="$abT('bpm.office.subsequentActions', '后续行为')"
        prop="followUp"
        :rules="{
          required: true,
          message: $abT('page.common.required', '必填'),
        }"
      >
        <el-select v-model="info.data.followUp">
          <el-tooltip
            class="box-item"
            :content="
              $abT('bpm.office.signEndBackInitiator', '结束后返回会签发起人')
            "
            effect="dark"
            placement="right-start"
          >
            <el-option
              :label="$abT('bpm.office.addSignatureBefore', '前加签')"
              value="back"
            />
          </el-tooltip>

          <el-tooltip
            class="box-item"
            :content="
              $abT('bpm.office.endJumpNextTask', '结束后自动跳转到下个节点')
            "
            effect="dark"
            placement="right-start"
          >
            <el-option
              :label="$abT('bpm.office.postEndorsement', '后加签')"
              value="next"
            />
          </el-tooltip>

          <el-tooltip
            class="box-item"
            :content="
              $abT(
                'bpm.office.stayOnTheToDolistAfterInitiation',
                '发起后停留在待办列表'
              )
            "
            effect="dark"
            placement="right-start"
          >
            <el-option
              :label="$abT('bpm.office.communicate', '沟通')"
              value="stay"
            />
          </el-tooltip>
        </el-select>
      </el-form-item>

      <span v-show="info.data.approvalType == 'vote'">
        <el-form-item
          :label="$abT('bpm.office.agreeToTheStrategy', '同意策略')"
          required
        >
          <el-col :span="13">
            <el-form-item
              label-width="0px"
              prop="countType"
              :rules="{
                required: true,
                message: $abT('page.common.required', '必填'),
              }"
            >
              <el-radio-group v-model="info.data.countType">
                <el-radio-button label="percent">
                  {{ $abT('bpm.office.percentage', '百分比') }}
                </el-radio-button>
                <el-radio-button label="number">
                  {{ $abT('bpm.office.numberOfVotes', '投票数') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col v-if="info.data.countType == 'percent'" :span="11">
            <el-form-item
              label-width="0px"
              prop="percent"
              :rules="{
                required: true,
                message: $abT('page.common.required', '必填'),
              }"
            >
              <el-input-number
                controls-position="right"
                v-model="info.data.percent"
                :max="100"
                :min="1"
                :placeholder="$abT('bpm.office.percentage', '百分比')"
              />
              %
            </el-form-item>
          </el-col>

          <el-col v-if="info.data.countType == 'number'" :span="11">
            <el-form-item
              label-width="0px"
              prop="number"
              :rules="{
                required: true,
                message: $abT('page.common.required', '必填'),
              }"
            >
              <el-input-number
                v-model="info.data.number"
                controls-position="right"
                :max="100"
                :min="1"
                :placeholder="$abT('bpm.office.numberOfVotes', '投票数')"
              />
              {{ $abT('bpm.office.ticket', '票') }}
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item
          :label="$abT('bpm.office.endStrategy', '结束策略')"
          prop="endType"
          :rules="{
            required: true,
            message: $abT('page.common.required', '必填'),
          }"
        >
          <el-select v-model="info.data.endType">
            <el-option
              :label="
                $abT('bpm.office.everyoneNeedsToVote', '所有人都需要投票')
              "
              value="all"
            />
            <el-option
              :label="
                $abT(
                  'bpm.office.afterMeetingTheVote',
                  '满足同意策略后不再等待剩下人员投票'
                )
              "
              value="satisfy"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="info.data.followUp == 'next'"
          :label="$abT('bpm.office.whenTheVoteNotPassed', '投票不通过时')"
          prop="opposeAction"
          :rules="{
            required: true,
            message: $abT('page.common.required', '必填'),
          }"
        >
          <el-radio-group v-model="info.data.opposeAction">
            <el-radio-button label="oppose">
              {{ $abT('bpm.office.markResultAgainst', '标记结果为反对') }}
            </el-radio-button>
            <el-radio-button label="reject">
              {{ $abT('bpm.office.executeRejectionOperation', '执行驳回操作') }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </span>

      <el-form-item
        :label="$abT('bpm.office.executeRejectionOperation', '执行驳回操作')"
        prop="privilegers"
      >
        <sign-privileger-dialog
          v-model="info.data.privilegers"
          :approval-type="info.data.approvalType"
          from="start"
          :users="info.data.users"
        />
      </el-form-item>

      <el-form-item
        :label="$abT('bpm.office.commentsRemarks', '意见/备注')"
        prop="opinion"
      >
        <el-input
          v-model="info.data.opinion"
          :placeholder="$abT('bpm.office.enterDescOrRemark', '请输入意见/备注')"
          :rows="4"
          type="textarea"
        />
      </el-form-item>

      <ab-daily-phrases @setDailyPhrases="setDailyPhrasesFn" />
    </el-form>
    <template #footer>
      <el-button text type="default" @click="dialogCancel">
        {{ $abT('page.common.cancel', '取消') }}
      </el-button>
      <el-button :loading="info.loading" type="primary" @click="dialogOk">
        {{ $abT('page.common.ok', '确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import * as abUtil from '~/agilebpm/utils/ab-util'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { abStoreAdaptor } from '@agilebpm/api'
  import SignPrivilegerDialog from '~/agilebpm/package/ab-common-resource/bpmDesign/signPrivilegerDialog.vue'
  import { FormInstance } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  import abDailyPhrases from '../componets/ab-daily-phrases.vue'
  import { abT } from '@/i18n'

  const formRef = ref<FormInstance>()

  const props = defineProps({
    bpmData: { required: true, type: Object as PropType<BpmData> },
    isShow: { required: true, type: Boolean },
    title: {
      required: false,
      type: String,
      default: abT('bpm.office.commentsRemarks', '意见/备注'),
    },
  })
  // callback 为 对话框处理完数据后返回事件
  const emit = defineEmits(['dialogCancel', 'callback'])

  const info: any = reactive({
    actionData: {} as PropType<ActionData>,
    data: {
      approvalType: 'parallel',
      users: [],
      followUp: 'stay',
      privilegers: [],
      countType: 'number',
      number: 1,
      percent: 1,
      endType: 'all',
      opposeAction: 'oppose',
      opinion: '',
    },
    loading: false,
    timer: null as any,
  })

  //初始化逻辑
  onMounted(() => {
    //复制bpmData数据达到数据隔离
    info.actionData = abUtil.clone(props.bpmData).actionData
    info.abUser = abStoreAdaptor().getAbUser
    //默认增加当前人为特权人方便他进行管理
    info.data.privilegers.push({
      type: 'user', //目前先支持用户
      key: info.abUser.userId,
      name: info.abUser.fullName,
      weight: 1,
      addRights: true,
      reduceRights: true,
    })
  })

  // 关闭对话框
  const dialogCancel = () => {
    emit('dialogCancel', false)
    info.loading = false
  }

  const dialogOk = async () => {
    info.loading = true
    await abTools.formValidate(formRef.value)?.then(
      () => {
        info.actionData.extendConf.signData = info.data
        dialogCancel()
        emit('callback', info.actionData)
      },
      //校验失败，loading 取消
      () => {
        info.loading = false
      }
    )
    if (info.timer) clearTimeout(info.timer)
    info.timer = setTimeout(() => {
      info.loading = false
    }, 5000)
  }

  const add = (users: any) => {
    users.forEach((user: any) => {
      let b = false
      info.data.users.forEach((u: any) => {
        if (u.key == user.id) {
          b = true
        }
      })
      if (b) return

      info.data.users.push({
        type: 'user',
        name: user.name,
        id: user.id,
      })
    })
  }
  const setDailyPhrasesFn = (value: string) => {
    if (info.data.opinion) {
      info.data.opinion = info.data.opinion + value
    } else {
      info.data.opinion = value
    }
  }
</script>

<style lang="scss" scoped>
  .el-tag {
    margin-top: 5px;
    margin-left: 10px;
  }

  :deep(.el-form-item__label) {
    font-weight: 600 !important;
    color: #333;
  }
</style>
