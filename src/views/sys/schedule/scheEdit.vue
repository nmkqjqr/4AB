<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="ScheList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.schedule.saveSchedule"
      />
      <ab-load
        v-model="info.data"
        :url="sysApi.schedule.getSchedule"
        @after-fn="getFn"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-scrollbar>
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="120px"
          :model="info.data"
          :status-icon="false"
        >
          <el-form-item
            label="标题"
            placeholder="请输入标题"
            prop="title"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="info.data.title" />
          </el-form-item>
          <el-form-item
            label="类型"
            placeholder="请选择"
            prop="type"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-select v-model="info.data.type" placeholder="请选择">
              <el-option key="single" label="个人" value="single" />
              <el-option key="share" label="共享" value="share" />
              <el-option key="ilka" label="共同任务" value="ilka" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="info.data.type === 'share' || info.data.type === 'ilka'"
            label="参与者"
            prop="participantNames"
          >
            <el-tag
              v-for="item in info.data.scheduleParticipantList"
              :key="item.participantor"
              closable
              @close="handleClose(item)"
            >
              {{ item.participantorName }}
            </el-tag>
            <ab-cust-dialog
              v-model="info.data.scheduleParticipantList"
              dialog-key="userSelector"
              :style="{
                marginLeft:
                  info.data.scheduleParticipantList &&
                  info.data.scheduleParticipantList.length > 0
                    ? '6px'
                    : '0px',
              }"
              :value-mapping="{
                id: 'participantor',
                name: 'participantorName',
              }"
              @ok="chooseparticipantNames"
            >
              选择
            </ab-cust-dialog>
          </el-form-item>
          <el-form-item
            label="开始日期"
            placeholder="请选择"
            prop="startTime"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-date-picker
              v-model="info.data.startTime"
              placeholder="选择日期"
              type="datetime"
              value-format="x"
            />
          </el-form-item>
          <el-form-item
            label="结束日期"
            placeholder="请选择"
            prop="endTime"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-date-picker
              v-model="info.data.endTime"
              placeholder="选择日期"
              type="datetime"
              value-format="x"
            />
          </el-form-item>
          <el-form-item
            label="实际开始日期"
            placeholder="请选择"
            prop="actualStartTime"
          >
            <el-date-picker
              v-model="info.data.actualStartTime"
              placeholder="选择日期"
              type="datetime"
              value-format="x"
            />
          </el-form-item>
          <el-form-item
            label="完成时间"
            placeholder="请选择"
            prop="completeTime"
          >
            <el-date-picker
              v-model="info.data.completeTime"
              placeholder="选择日期"
              type="datetime"
              value-format="x"
            />
          </el-form-item>
          <el-form-item label="进度" prop="rateProgress">
            <el-input v-model="info.data.rateProgress" type="number" />
          </el-form-item>
          <el-form-item label="锁定" placeholder="请选择" prop="isLock">
            <el-select v-model="info.data.isLock" placeholder="请选择">
              <el-option key="1" label="是" value="1" />
              <el-option key="0" label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="info.data.desc" :rows="4" type="textarea" />
          </el-form-item>
        </el-form>
        <el-table
          v-if="
            info.data.id &&
            (info.data.type === 'share' || info.data.type === 'ilka')
          "
          :data="info.scheduleParticipantList"
          style="width: 100%"
        >
          <el-table-column
            label="参与者名字"
            min-width="120"
            prop="participantorName"
          />
          <el-table-column
            label="完成比例"
            min-width="100"
            prop="rateProgress"
          />
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
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { sysApi, getData } from '~/agilebpm'
  const formRef = ref()
  const info: any = reactive({
    dialog: null,
    cutDialogTitle: '',
    cutDialogVisible: false,
    scheduleParticipantList: [],
    data: {
      title: '',
      type: '',
      startTime: '',
      endTime: '',
      actualStartTime: '',
      participantNames: '',
      completeTime: '',
      rateProgress: 0,
      isLock: '0',
      desc: '',
      scheduleParticipantList: [],
    },
  })
  const chooseparticipantNames = (list: any) => {
    let str = ''
    list.forEach((element: any) => {
      str += `${element.name},`
    })
    // 请求对话框接口
    str = str.slice(0, str.length - 1)
    info.data.participantNames = str
  }
  const itemDeleteFn = (row: any) => {
    getData(sysApi.schedule.itemDelete + row.id, {})
      .then(
        (result: any) => {
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
          })
          getData(sysApi.schedule.getSchedule + info.data.id, {}).then(
            ({ data }) => {
              info.data = data
              if (data.scheduleParticipantList) {
                info.scheduleParticipantList = data.scheduleParticipantList
                info.data.scheduleParticipantList = data.scheduleParticipantList
              }
            }
          )
        },
        () => {}
      )
      .catch(() => {})
  }
  const getFn = (data: any) => {
    if (data.scheduleParticipantList) {
      info.scheduleParticipantList = data.scheduleParticipantList
    }
  }
  const handleClose = (item: any) => {
    info.data.scheduleParticipantList.splice(
      info.data.scheduleParticipantList.indexOf(item),
      1
    )
  }
</script>
