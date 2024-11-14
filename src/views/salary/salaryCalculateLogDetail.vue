<template>
  <el-container class="layout-container-demo">
    <el-header>
      <router-link
        :to="{
          name: 'SalaryCalculateLogList',
        }"
      >
        <el-button :icon="Back">返回</el-button>
      </router-link>

      <ab-load
        v-model="info.data"
        :url="salaryApi.salaryCalculateGetUrl"
        @after-fn="initTableData(info.data)"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-row >
        <el-form
          ref="formRef"
          label-suffix="："
          label-width="150px"
          :model="info.data"
          :status-icon="false"
        >
          <el-row :span="24">
            <el-col :span="6">
              <el-form-item
                label="用户名"
                prop="userName"
              >
                <el-input
                  v-model="info.data.userName"
                  :disabled="type != '1'"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="工资所属月份"
                prop="salaryMonth"
              >
                <el-input
                  v-model="info.data.salaryMonth"
                  :disabled="type != '1'"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="状态"
                prop="status"
              >
                <span v-if="info.data.status ==1 ">工资条计算错误</span>
                <span v-if="info.data.status ==2 ">工资条计算完成</span>
                <span v-if="info.data.status ==3 ">已送达员工</span>
                <span v-if="info.data.status ==4 ">上级部门审核中</span>
                <span v-if="info.data.status ==5 ">已发放</span>


              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实发工资总额" prop="totalSalary">
                <el-input
                  v-model="info.data.totalSalary"
                  :disabled="type != '1'"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="6">
            <el-form-item label="更新时间" prop="updateTime">
              <el-input
                v-model="info.data.updateTime"
                :disabled="type != '1'"
              />
            </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item label="基本工资合计" prop="baseSalaryTotal">
              <el-input
                v-model="info.data.baseSalaryTotal"
                :disabled="type != '1'"
              />
            </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item label="绩效" prop="performanceTotal">
              <el-input
                v-model="info.data.performanceTotal"
                :disabled="type != '1'"
              />
            </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item label="补贴/奖金" prop="subsidyTotal">
              <el-input
                v-model="info.data.subsidyTotal"
                :disabled="type != '1'"
              />
            </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="6">
            <el-form-item label="扣款" prop="deductTotal">
              <el-input
                v-model="info.data.deductTotal"
                :disabled="type != '1'"
              />
            </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item label="个税抵扣" prop="taxDeductTotal">
              <el-input
                v-model="info.data.taxDeductTotal"
                :disabled="type != '1'"
              />
            </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item label="个税" prop="taxTotal">
              <el-input
                v-model="info.data.taxTotal"
                :disabled="type != '1'"
              />
            </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item label="补充值" prop="supplementValue">
              <el-input
                v-model="info.data.supplementValue"
                :disabled="type != '1'"
              />
            </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-form-item label="补充说明" prop="supplementary">
              <el-input
                v-model="info.data.supplementary"
                :disabled="type != '1'"
              />
            </el-form-item>


          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="总额备注" prop="salaryRemarks">

                {{info.data.salaryRemarks}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>


      </el-row>
      <el-divider content-position="left">
        计算明细
      </el-divider>

      <el-row>
        <el-table
          style="width: 100%;"
          :data="info.salaryCalculateDetailList"
        >
          <el-table-column
            label="科目名称"
            min-width="180"
            prop="salaryRuleName"
          />

          <el-table-column
            label="薪酬科目类型"
            min-width="180"
            prop="salaryRuleType"
          >
            <template #default="scope">
              <span v-if="scope.row.salaryRuleType =='basicSalary' ">基本工资</span>
              <span v-if="scope.row.salaryRuleType =='performance' ">绩效</span>
              <span v-if="scope.row.salaryRuleType =='subsidy' ">补贴/奖金</span>
              <span v-if="scope.row.salaryRuleType =='deduction' ">扣款</span>
              <span v-if="scope.row.salaryRuleType =='taxDeduction' ">个税扣除</span>
              <span v-if="scope.row.salaryRuleType =='totalTax' ">个税</span>

            </template>
          </el-table-column>
          <el-table-column label="计算金额" prop="calculateValue" width="120" />
          <el-table-column
            label="计算结果备注"
            min-width="260"
            prop="calculateComment"
          />


        </el-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { salaryApi, abTools, sysApi,abTableMix } from '~/agilebpm'
import { Delete, Back } from '@element-plus/icons-vue'
import { abRichEditor } from '~/agilebpm'
import { Codemirror } from 'vue-codemirror'
import { number } from 'echarts'

const formRef = ref()
//引入 当前实例
const { proxy } = abTools.useCurrentInstance()
const id = proxy.$route.query.id

const info: any = reactive({
  data: {},
  salaryCalculateDetailList:[],
})


//初始化数据
const initTableData = (data: any) => {
  salaryApi.calculateLogDetail(data.id).then((result) => {
    info.salaryCalculateDetailList = result.data
  });
}

// 保存前校验
const beforeSave = () => {
  return true
}
const type = getCurrentInstance()?.proxy?.$route.query.type

</script>
