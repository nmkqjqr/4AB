<template>
  <el-container class="layout-container-demo">
    <el-header>
      <router-link
        v-if="type != '1'"
        :to="{
          name: 'AttendanceLogList',
        }"
      >
        <el-button :icon="Back">返回</el-button>
      </router-link>
      <ab-save
        v-else
        back-name="AttendanceLogList"
        :before-save-fn="beforeSave"
        :form-ref="formRef"
        :save-data="info.data"
        :url="salaryApi.attendanceLogSaveUrl"
      />
      <ab-load
        v-model="info.data"
        :url="salaryApi.attendanceLogGetUrl"
        @after-fn="initTableData(info.data)"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-form
            ref="formRef"
            label-suffix="："
            label-width="150px"
            :model="info.data"
            :status-icon="false"
          >
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="info.data.userName" disabled />
            </el-form-item>
            <el-form-item label="考勤所属月份" prop="atteMonth">
              <el-input v-model="info.data.atteMonth" disabled />
            </el-form-item>
            <el-form-item label="应出勤天数" prop="shouldAttendanceDay">
              <el-input-number
                v-model="info.data.shouldAttendanceDay"
                :min="0"
                :max="31"
                :precision="2"
              />
            </el-form-item>

            <el-form-item label="出勤天数" prop="attendanceDay">
              <el-input-number
                v-model="info.data.attendanceDay"
                :min="0"
                :max="31"
                :precision="2"
              />
            </el-form-item>

            <el-form-item label="休息天数" prop="leaveDays">
              <el-input-number
                :min="0"
                :max="31"
                :precision="2"
                v-model="info.data.leaveDays"
              />
            </el-form-item>

            <el-form-item label="旷工/请假天数" prop="absendDays">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="考勤计算为：（旷工或请假天数）/ 应出勤天数"
                placement="right"
              >
                <el-input-number
                  :min="0"
                  :max="31"
                  :precision="2"
                  v-model="info.data.absendDays"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item label="迟到时长(分钟)" prop="lateDays">
              <el-input-number
                :min="0"
                :precision="2"
                v-model="info.data.lateDays"
              />
            </el-form-item>
            <el-form-item label="迟到次数" prop="lateNum">
              <el-input-number :min="0" v-model="info.data.lateNum" />
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
              <el-input v-model="info.data.createTime" disabled />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { salaryApi, abTools, sysApi } from '~/agilebpm'
  import { Delete, Back } from '@element-plus/icons-vue'
  import { abRichEditor } from '~/agilebpm'
  import { Codemirror } from 'vue-codemirror'
  import { number } from 'echarts'

  const formRef = ref()
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const id = proxy.$route.params.id

  const info: any = reactive({
    data: {
      id: '',
      code: '',
      type: 'basicsalary',
      userName: '',
      calculateType: 'fixed_salary',
      isFixedSalary: 1,
      initialValue: null,
      calculateScript: '',
      salaryComment: '',
    },
    salaryCalculateList: [],
  })

  //初始化数据
  const initTableData = (data: any) => {}

  // 保存前校验
  const beforeSave = () => {
    return true
  }

  const type = getCurrentInstance()?.proxy?.$route.query.type
</script>
