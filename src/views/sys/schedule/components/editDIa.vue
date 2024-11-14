<template>
  <div>
    <el-dialog
      v-model="state.dialogFormVisible"
      :title="
        state.isadd
          ? '添加日程'
          : state.isEdit
          ? '编辑日程'
          : state.iscomplete
          ? '完成日程'
          : ''
      "
      width="800px"
    >
      <el-form
        ref="ruleFormRef"
        v-loading="state.formLoading"
        class="demo-ruleForm"
        label-width="100px"
        :model="state.ruleForm"
        :rules="state.rules"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="state.ruleForm.title"
            :disabled="state.iscomplete"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            v-if="state.isEdit || state.iscomplete"
            v-model="state.ruleForm.type"
            :disabled="state.iscomplete"
            placeholder="请选择"
          >
            <el-option label="个人" value="single" />
            <el-option label="共享" value="share" />
            <el-option label="共同任务" value="ilka" />
          </el-select>
          <el-select
            v-if="state.isadd"
            v-model="state.ruleForm.type"
            :disabled="state.iscomplete"
            placeholder="请选择"
          >
            <el-option label="个人待办" value="single" />
            <el-option label="多人协作待办" value="share" />
            <el-option label="多人待办" value="ilka" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            state.ruleForm.type === 'share' || state.ruleForm.type === 'ilka'
          "
          label="参与者"
          prop="participantNames"
        >
          <el-tag
            v-for="item in state.ruleForm.scheduleParticipantList"
            :key="item.participantor"
            closable
            @close="handleClose(item)"
          >
            {{ item.participantorName }}
          </el-tag>
          <ab-cust-dialog
            v-model="state.ruleForm.scheduleParticipantList"
            dialog-key="userSelector"
            :style="{
              marginLeft:
                state.ruleForm.scheduleParticipantList &&
                state.ruleForm.scheduleParticipantList.length > 0
                  ? '6px'
                  : '0px',
            }"
            :value-mapping="{ id: 'participantor', name: 'participantorName' }"
            @ok="chooseuserSelector"
          >
            选择
          </ab-cust-dialog>
        </el-form-item>
        <el-form-item
          v-if="!state.iscomplete"
          label="开始日期"
          prop="startTime"
        >
          <el-date-picker
            v-model="state.ruleForm.startTime"
            placeholder="选择日期时间"
            type="datetime"
            value-format="x"
          />
        </el-form-item>
        <el-form-item v-if="!state.iscomplete" label="结束日期" prop="endTime">
          <el-date-picker
            v-model="state.ruleForm.endTime"
            placeholder="选择日期时间"
            type="datetime"
            value-format="x"
          />
        </el-form-item>
        <el-form-item
          v-if="state.isEdit || state.iscomplete"
          label="实际开始日期"
          prop="actualStartTime"
        >
          <el-date-picker
            v-model="state.ruleForm.actualStartTime"
            placeholder="选择日期时间"
            type="datetime"
            value-format="x"
          />
        </el-form-item>
        <el-form-item
          v-if="state.isEdit || state.iscomplete"
          label="完成时间"
          prop="completeTime"
        >
          <el-date-picker
            v-model="state.ruleForm.completeTime"
            placeholder="选择日期时间"
            type="datetime"
            value-format="x"
          />
        </el-form-item>
        <el-form-item
          v-if="state.isEdit || state.iscomplete"
          label="进度"
          prop="rateProgress"
        >
          <el-input v-model="state.ruleForm.rateProgress" type="number" />
        </el-form-item>
        <el-form-item v-if="state.isEdit" label="锁定" prop="isLock">
          <el-select v-model="state.ruleForm.isLock" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="state.ruleForm.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <el-table
        v-if="
          state.isEdit &&
          (state.ruleForm.type === 'share' || state.ruleForm.type === 'ilka')
        "
        :data="state.scheduleParticipantList"
        style="width: 100%"
      >
        <el-table-column
          label="参与者名字"
          min-width="120"
          prop="participantorName"
        />
        <el-table-column label="完成比例" min-width="100" prop="rateProgress" />
        <el-table-column
          label="提交注释"
          min-width="140"
          prop="submitComment"
        />
        <el-table-column
          align="center"
          label="实际开始时间"
          min-width="210"
          prop="actualStartTime"
        >
          <template #default="{ row }">
            <el-date-picker
              v-model="row.actualStartTime"
              placeholder="选择时间"
              size="small"
              type="datetime"
              value-format="x"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="完成时间"
          min-width="210"
          prop="completeTime"
        >
          <template #default="{ row }">
            <el-date-picker
              v-model="row.completeTime"
              placeholder="选择时间"
              size="small"
              type="datetime"
              value-format="x"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="80">
          <template #default="{ row }">
            <el-button size="small" text @click="itemDeleteFn(row)">
              删除{{ row.name }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            text
            type="primary"
            @click="state.dialogFormVisible = false"
          >
            取消
          </el-button>
          <el-button
            :loading="state.loadingSave"
            type="primary"
            @click="submitForm(ruleFormRef)"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { sysApi, bizApi, getData, postData } from '~/agilebpm'
  import { dateFormat } from '@/utils'
  import type { FormInstance } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'

  const state = reactive({
    dialogFormVisible: false,
    isEdit: false,
    isadd: false,
    iscomplete: false,
    formLoading: false,
    ruleForm: {
      title: '',
      type: 'single',
      participantNames: '',
      startTime: '',
      endTime: '',
      remark: '',
      actualStartTime: '',
      completeTime: '',
      rateProgress: null,
      scheduleParticipantList: [],
      isLock: '0',
    },
    rules: {
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      type: [{ required: true, message: '请选择', trigger: 'change' }],
      startTime: [
        {
          type: 'date',
          required: true,
          message: '请选择日期',
          trigger: 'change',
        },
      ],
      endTime: [
        {
          type: 'date',
          required: true,
          message: '请选择时间',
          trigger: 'change',
        },
      ],
    },
    loadingSave: false,
    dialog: null,
    cutDialogVisible: false,
    cutDialogTitle: '',
    scheduleParticipantList: [],
    checkEdList: [],
    editId: '',
  })
  const emit = defineEmits(['reloadcalendar'])
  const ruleFormRef = ref<FormInstance>()
  // 监听弹框打开 关闭
  watch(
    () => state.dialogFormVisible,
    (newValue, oldValue) => {
      console.log(oldValue)
      if (!newValue) {
        ruleFormRef.value.resetFields()
        state.isEdit = false
        state.iscomplete = false
        state.isadd = false
      }
    }
  )
  // 提交form
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        state.loadingSave = true
        // state.ruleForm.startTime = new Date(state.ruleForm.startTime).getTime()
        // state.ruleForm.endTime = new Date(state.ruleForm.endTime).getTime()
        if (!state.isadd) {
          if (
            state.ruleForm.actualStartTime &&
            state.ruleForm.actualStartTime !== null
          ) {
            state.ruleForm.actualStartTime = dateFormat(
              state.ruleForm.actualStartTime
            )
          }
          if (
            state.ruleForm.completeTime &&
            state.ruleForm.completeTime !== null
          ) {
            state.ruleForm.completeTime = dateFormat(
              state.ruleForm.completeTime
            )
          }
        }
        if (state.iscomplete) {
          postData(sysApi.schedule.completeTask, state.ruleForm).then(
            (data) => {
              state.dialogFormVisible = false
              state.loadingSave = false
            },
            () => {
              state.loadingSave = false
            }
          )
        } else {
          postData(sysApi.schedule.saveSchedule, state.ruleForm).then(
            (data) => {
              emit('reloadcalendar')
              state.dialogFormVisible = false
              state.loadingSave = false
            },
            () => {
              state.loadingSave = false
            }
          )
        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
  // 打开弹框
  const open = (toDay: any) => {
    state.dialogFormVisible = true
    state.isadd = true
    state.ruleForm.startTime = `${dateFormat(toDay).split(' ')[0]} 09:00:00`
    state.ruleForm.endTime = `${dateFormat(toDay).split(' ')[0]} 18:00:00`
  }
  // 打开编辑
  const editche = (params: { id: any }) => {
    state.editId = params.id
    state.dialogFormVisible = true
    state.formLoading = true
    state.isEdit = true
    getData(sysApi.schedule.getSchedule + params.id, {}).then(({ data }) => {
      state.formLoading = false
      state.ruleForm = data
      if (data.scheduleParticipantList) {
        state.scheduleParticipantList = data.scheduleParticipantList
        state.ruleForm.scheduleParticipantList = data.scheduleParticipantList
      }
    })
  }
  // 删除
  const removeche = (params: { id: any }) => {
    ElMessageBox.confirm('确认删除此日程吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        getData(sysApi.schedule.removeSchedule + params.id, {}).then(() => {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          emit('reloadcalendar')
        })
      })
      .catch(() => {})
  }
  const completeche = (params: { id: any }) => {
    state.dialogFormVisible = true
    state.formLoading = true
    state.iscomplete = true
    getData(sysApi.schedule.getSchedule + params.id, {}).then(({ data }) => {
      state.formLoading = false
      state.ruleForm = data
    })
  }
  const chooseparticipantNames = () => {
    // 请求对话框接口
    getData(`${bizApi.customDialog.getByCode}userSelector`, {}).then(
      (result) => {
        state.cutDialogVisible = true
        state.dialog = result.data
      },
      () => {}
    )
  }

  const chooseuserSelector = (list: any) => {
    let str = ''
    list.forEach((element: any) => {
      str += `${element.name},`
    })
    // 请求对话框接口
    str = str.slice(0, str.length - 1)
    state.ruleForm.participantNames = str
  }

  const itemDeleteFn = (row: any) => {
    getData(sysApi.schedule.itemDelete + row.id, {})
      .then(
        (result) => {
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
          })
          state.formLoading = true
          getData(sysApi.schedule.getSchedule + state.editId, {}).then(
            ({ data }) => {
              state.formLoading = false
              state.ruleForm = data
              if (data.scheduleParticipantList) {
                state.scheduleParticipantList = data.scheduleParticipantList
                state.ruleForm.scheduleParticipantList =
                  data.scheduleParticipantList
              }
            }
          )
        },
        () => {}
      )
      .catch(() => {})
  }
  const handleClose = (item: any) => {
    state.ruleForm.scheduleParticipantList.splice(
      state.ruleForm.scheduleParticipantList.indexOf(item),
      1
    )
  }
  // 输出
  defineExpose({
    open,
    editche,
    removeche,
    completeche,
  })
</script>
