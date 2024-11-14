<template>
  <div class="comprehensive-table-container">
    <div ref="titleForm">
      <el-row class="vab-query-form">
        <el-col class="top-panel">
          <el-form
            ref="queryForm"
            :inline="true"
            label-width="90px"
            :model="query"
            @submit.prevent
          >
            <el-form-item label="用户名称" prop="userName$VLK">
              <el-input
                v-model="query.userName$VLK"
                placeholder="请输入用户名"
              />
            </el-form-item>

            <el-form-item label="所属月份" prop="atteMonth$VLK">
              <el-date-picker
                v-model="query.atteMonth$VLK"
                format="YYYY-MM"
                placeholder="选择一个月份"
                type="month"
                value-format="YYYY-MM"
              />
            </el-form-item>

            <el-form-item>
              <el-button :icon="Search" type="primary" @click="search()">
                查询
              </el-button>
              <el-button :icon="RefreshRight" @click="reset()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!--   -->
        <el-col class="left-panel">
          <el-button
            v-ab-btn-rights:salary_attendanceCalculate
            :disabled="info.calculateIng"
            icon="Plus"
            type="primary"
            @click="openAttendanceCalculate()"
          >
            同步考勤
          </el-button>
          <el-button
            v-ab-btn-rights:salary_temp_down
            :disabled="info.calculateIng"
            type="primary"
            @click="downTemplate()"
          >
            下载导入模板
          </el-button>

          <ab-upload-dialog
            accept=".xls,.xlsx"
            :after-save="importSave"
            :after-save-need-download="true"
            alias="salary_temp_imp"
            :data="info.uploadData"
            join-btn-right="1"
            :search="search"
          />

          <el-button
            v-ab-btn-rights:attendanceLog_del
            :disabled="!selectedData || selectedData.length == 0"
            icon="delete"
            type="danger"
            @click="delBySeletedIds(salaryApi.attendanceLogDelUrl)"
          >
            批量删除
          </el-button>
        </el-col>
      </el-row>
    </div>

    <ab-table
      ref="abTable"
      v-model="selectedData"
      :height="tableHeight"
      :query-param="query"
      row-key="id"
      :url="salaryApi.attendanceLogListUrl"
    >
      <ab-column label="用户名" min-width="130" prop="userName" />
      <ab-column label="考勤所属月份" min-width="120" prop="atteMonth" />

      <ab-column
        label="应出勤天数"
        min-width="120"
        prop="shouldAttendanceDay"
      />
      <ab-column label="出勤天数" min-width="100" prop="attendanceDay" />
      <ab-column label="休息天数" min-width="100" prop="leaveDays" />
      <ab-column label="旷工/请假天数" min-width="100" prop="absendDays" />
      <ab-column label="迟到时长(分钟)" min-width="100" prop="lateDays" />
      <ab-column label="迟到次数" min-width="100" prop="lateNum" />
      <ab-column label="创建时间" min-width="100" prop="createTime" />
      <ab-column ab-template="edit" fixed="right" label="操作" width="230" />
      <template #edit="{ scope }">
        <router-link
          v-ab-btn-rights:attendanceLog_edit
          :to="{
            name: 'AttendanceLogEdit',
            query: { id: scope.row.id, type: '1' },
          }"
        >
          <el-button text type="primary">编辑</el-button>
        </router-link>
        <el-button
          v-ab-btn-rights:attendanceLog_calculate
          :disabled="info.calculateIng"
          text
          type="primary"
          @click="attendanceCalculate(scope.row.id, 1)"
        >
          重新同步
        </el-button>

        <el-button
          v-ab-btn-rights:attendanceLog_del
          text
          type="primary"
          @click="
            sendAction(
              salaryApi.attendanceLogDelUrl + scope.row.id,
              `确定删除【 ${scope.row.userName} 】的考勤数据吗?`
            )
          "
        >
          删除
        </el-button>
      </template>
    </ab-table>

    <el-dialog v-model="info.dialogVisible" title="同步考勤" width="788px">
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="120px"
        :model="info.userType"
      >
        <el-form-item label="选择月份" placeholder="请选择要同步的考勤月份">
          <el-date-picker
            v-model="info.time"
            format="YYYY-MM"
            placeholder="选择一个月份"
            type="month"
            value-format="YYYY-MM"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button text @click="info.dialogVisible = false">取消</el-button>
          <el-button
            :disabled="info.calculateIng"
            type="primary"
            @click="attendanceCalculate(null, 0)"
          >
            {{ info.calculateIng ? '同步中。。' : '开始同步' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { reactive, defineComponent, getCurrentInstance } from 'vue'
  import { abTableMix, salaryApi, abTools, abUploadDialog } from '~/agilebpm'
  import {
    Delete,
    Edit,
    Search,
    Plus,
    RefreshRight,
  } from '@element-plus/icons-vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  export default defineComponent({
    name: 'AttendanceLogList',
    components: { abUploadDialog },
    mixins: [abTableMix],

    setup() {
      // 查询条件定义，如果ts 需要定义所有参数，这里覆盖父类，不是的话可以不用设置，父类已经定义了query 对象
      const query = reactive({
        userName$VLK: '',
        atteMonth$VLK: '',
      })

      const info: any = reactive({
        calculateIng: false,
        time: '',
        uploadData: {
          btnText: '导入',
          tip: '请选择.xls.xlsx文件',
          url: salaryApi.attendanceLogImportUrl,
        },
      })
      // @ts-ignore
      const { proxy } = getCurrentInstance()
      const attendanceCalculate = (userId: any, type: any) => {
        if (!info.time && type == 0) {
          ElMessage.error('请选择需要同步考勤的月份')
          return
        }
        info.calculateIng = true
        salaryApi.attendanceCalculate(info.time, userId).then((result: any) => {
          if (result.data && result.data === '考勤同步完成') {
            ElMessage.success(result.data)
          } else {
            ElMessage.error(result.data)
          }
          query.atteMonth$VLK = info.time
          proxy.search()
          info.calculateIng = false
        })
      }
      const downTemplate = () => {
        salaryApi.exportTemplateUrl().then((result: any) => {
          abTools.downImgFile(`考勤导入模板.xls`, result)
        })
      }

      const openAttendanceCalculate = () => {
        info.dialogVisible = true
      }

      const importSave = (result: any) => {
        if (result.size == 0) {
          ElMessage({
            message: '导入成功',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '部分导入失败',
            type: 'error',
          })
          abTools.downImgFile(`失败数据.xls`, result)
        }
      }

      return {
        query,
        Delete,
        Edit,
        Search,
        Plus,
        salaryApi,
        RefreshRight,
        attendanceCalculate,
        downTemplate,
        info,
        abUploadDialog,
        importSave,
        openAttendanceCalculate,
      }
    },
  })
</script>
