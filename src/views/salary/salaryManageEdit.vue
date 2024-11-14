<template>
  <el-container class="layout-container-demo">
    <el-header>
      <router-link
        v-if="type != '1'"
        :to="{
          name: 'SalaryManageList',
        }"
      >
        <el-button :icon="Back">返回</el-button>
      </router-link>
      <ab-save
        v-else
        back-name="SalaryManageList"
        :before-save-fn="beforeSave"
        :form-ref="formRef"
        :save-data="info.data"
        :url="salaryApi.salaryManageSaveUrl"
      />
      <ab-load
        v-model="info.data"
        :url="salaryApi.salaryManageGetUrl"
        @after-fn="initTableData(info.data)"
      />
    </el-header>
    <el-divider class="dividermar" />
    <el-main>
      <el-form
        ref="formRef"
        label-suffix="："
        label-width="150px"
        :model="info.data"
        :status-icon="false"
      >
        <el-row :span="24" v-if="proxy.$route.params.id">
          <el-col :span="8">
            <el-form-item
              label="用户名"
              prop="userName"
              :rules="[{ required: true, message: '请输入用户名' }]"
            >
              <el-input
                v-model="info.data.userList[0].userName"
                :disabled="type != '1' || proxy.$route.params.id"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入职时间" prop="entryTime">
              <el-date-picker
                v-model="info.data.userList[0].entryTime"
                :disabled="type != '1'"
                placeholder="选择日期"
                type="date"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="所属团队"
              prop="userName"
              :rules="[{ required: true, message: '请选择所属团队' }]"
            >
              <ab-select-tree
                v-model="info.data.userList[0].type"
                :disabled="type != '1'"
                :has-root="false"
                type-code="xcgllx"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :span="24" v-if="proxy.$route.params.id">
          <el-col :span="8">
            <el-form-item label="剩余年假" prop="userName">
              <el-input-number
                v-model="info.data.userList[0].holidayTime"
                :disabled="type != '1'"
                :max="20"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="加班可调休天数" prop="workHolidayTime">
              <el-input-number
                v-model="info.data.userList[0].workHolidayTime"
                :disabled="type != '1'"
                :max="100"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已用假期" prop="useHolidayTime">
              <el-input-number
                v-model="info.data.userList[0].useHolidayTime"
                :disabled="type != '1'"
                :max="100"
                :min="0"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :span="24" v-if="proxy.$route.params.id">
          <el-col :span="8">
            <el-form-item label="本人银行卡号" prop="bankCardNum">
              <el-input
                v-model="info.data.userList[0].bankCardNum"
                placeholder="请输入本人银行卡号"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item>
            <ab-cust-dialog
              v-if="info.isAddUser"
              dialog-key="userSelector"
              :icon="Plus"
              style="margin-left: -66px"
              type="primary"
              @ok="addUser"
            >
              批量选择用户
            </ab-cust-dialog>
          </el-form-item>

          <el-table
            border
            :data="info.data.userList"
            empty-text="请添加员工信息"
            style="width: 100%"
            v-if="!proxy.$route.params.id"
          >
            <el-table-column label="用户名" min-width="80" prop="userName" />

            <el-table-column label="入职时间" prop="entryTime" width="300">
              <template #default="scope">
                <el-form-item
                  :prop="`userList.${scope.$index}.entryTime`"
                  style="margin-left: -150px; margin-top: 15px"
                >
                  <el-date-picker
                    v-model="scope.row.entryTime"
                    :disabled="type != '1'"
                    placeholder="选择日期"
                    type="date"
                    value-format="YYYY-MM-DD"
                    width="140px"
                  />
                  <el-button
                    v-if="scope.$index == 0"
                    style="margin-left: 5px"
                    :disabled="type != '1'"
                    :icon="Bottom"
                    plain
                    @click="copyByStr(scope.row.entryTime, 'entryTime')"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="所属团队" width="300" prop="type">
              <template #default="scope">
                <el-form-item
                  :prop="`userList.${scope.$index}.type`"
                  style="margin-left: -130px; margin-top: 15px"
                >
                  <ab-select-tree
                    v-model="scope.row.type"
                    :disabled="type != '1'"
                    :has-root="false"
                    type-code="xcgllx"
                    width="190px"
                  />
                  <el-button
                    v-if="scope.$index == 0"
                    style="margin-left: 5px"
                    :disabled="type != '1'"
                    :icon="Bottom"
                    plain
                    @click="copyByStr(scope.row.type, 'type')"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="剩余年假" prop="holidayTime" width="239">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.holidayTime"
                  :disabled="type != '1'"
                  :max="20"
                  :min="0"
                />
                <el-button
                  v-if="scope.$index == 0"
                  style="margin-left: 5px; margin-top: -2px"
                  :disabled="type != '1'"
                  :icon="Bottom"
                  plain
                  @click="copyByStr(scope.row.holidayTime, 'holidayTime')"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="加班可调休天数"
              min-width="185"
              prop="workHolidayTime"
            >
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.workHolidayTime"
                  :disabled="type != '1'"
                  :max="100"
                  :min="0"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="已用假期"
              min-width="165"
              prop="useHolidayTime"
            >
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.useHolidayTime"
                  :disabled="type != '1'"
                  :max="100"
                  :min="0"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="本人银行卡号"
              min-width="190"
              prop="bankCardNum"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.bankCardNum"
                  :disabled="type != '1'"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="本年累计已发薪资"
              min-width="190"
              prop="salarySum"
            >
              <template #default="scope">
                  <el-input-number
                    v-model="scope.row.salarySum"
                    :precision="2"
                    :disabled="type != '1'"
                    :min="0"
                  />
              </template>
            </el-table-column>
            <el-table-column
              label="累计应纳税所得额"
              min-width="190"
              prop="taxSalarySum"
            >
              <template #default="scope">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="<p>如不设置本值第一次使用本系统个税起征点将从0开始</p>
                  <p>第一次使用本系统且不是从第一个月开始计算如果不想税额起征点不想从0开始计算 可以设置此值</p>
                  <p>如果本月薪资20000-五险一金2000-房贷个税抵扣1000-个税起征额度5000=本月应纳税所得额</p>
                    <p>如果从四月份计算在此输入前三个月计税额总合</p>
                      <p>如配置本字段，必须配置本年度累计纳税额，否则第一次计算薪资个税会计算错误</p>"
                  placement="top-end"
                  :raw-content="true"
                >
                <el-input-number
                  v-model="scope.row.taxSalarySum"
                  :precision="2"
                  :disabled="type != '1'"
                  :min="0"
                />
              </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column label="本年累计纳税额" min-width="190" prop="taxSum">
              <template #default="scope">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="<p>根据本年度 累计应纳税所得额 得出的本年度已经纳税额</p>
                    <p> 配置本值必须和 累计应纳税所得额 配合使用</p>
                      <p>如果 本年累计纳税额 和 累计应纳税所得额 不匹配会影响第一次薪资税额计算准确度</p>"
                  placement="top-end"
                  :raw-content="true"
                >
                <el-input-number
                  v-model="scope.row.taxSum"
                  :precision="2"
                  :disabled="type != '1'"
                  :min="0"
                />
              </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column label="操作" min-width="100">
              <template #default="scope">
                <el-button
                  v-if="info.isAddUser"
                  :icon="Delete"
                  plain
                  type="danger"
                  @click="delUser(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <el-row>
          <el-form-item>
            <ab-cust-dialog
              dialog-key="salarysystemselection"
              :disabled="type != '1'"
              :extra-data="info.data.salaryRuleDetails"
              :icon="Plus"
              style="margin-left: -66px; margin-top: 8px"
              type="primary"
              @ok="addClassTable"
            >
              选择薪酬体系
            </ab-cust-dialog>
          </el-form-item>
        </el-row>

        <el-divider content-position="left">
          薪酬体系：{{ info.data.salaryClassName }}
        </el-divider>

        <el-row>
          <el-table
            border
            :data="info.data.salaryRuleDetails"
            empty-text="请添加薪酬体系"
            style="width: 100%"
          >
            <el-table-column
              label="科目名称"
              min-width="180"
              prop="salaryRuleName"
            />

            <el-table-column
              label="编码"
              min-width="180"
              prop="salaryRuleCode"
            />
            <el-table-column label="科目类型" prop="ruleType" width="120">
              <template #default="scope">
                <span v-if="scope.row.ruleType == 'basicSalary'">基本工资</span>
                <span v-if="scope.row.ruleType == 'performance'">绩效</span>
                <span v-if="scope.row.ruleType == 'subsidy'">补贴/奖金</span>
                <span v-if="scope.row.ruleType == 'deduction'">扣款</span>
                <span v-if="scope.row.ruleType == 'taxDeduction'">
                  个税扣除
                </span>
                <span v-if="scope.row.ruleType == 'totalTax'">个税</span>
              </template>
            </el-table-column>
            <el-table-column
              label="计算方式"
              min-width="100"
              prop="calculateType"
            >
              <template #default="scope">
                <span v-if="scope.row.calculateType == 'fixed_salary'">
                  定薪金额
                </span>
                <span v-if="scope.row.calculateType == 'bean_id'">
                  内置计算
                </span>
                <span v-if="scope.row.calculateType == 'groovy_script'">
                  脚本计算
                </span>
              </template>
            </el-table-column>
            <el-table-column label="默认值" prop="fixedValue" width="180">
              <template #default="scope">
                <el-form-item
                  :prop="`salaryRuleDetails.${scope.$index}.fixedValue`"
                  :rules="[
                    { required: scope.row.isFixedSalary, message: '必填' },
                  ]"
                  style="margin-left: -130px"
                >
                  <el-input
                    v-model="scope.row.fixedValue"
                    :disabled="
                      scope.row.calculateType != 'fixed_salary' || type != '1'
                    "
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="说明"
              min-width="300"
              prop="salaryComment"
            />
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button
                  :disabled="type != '1'"
                  :icon="Delete"
                  plain
                  type="danger"
                  @click="delSalaryRule(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { salaryApi, abTools, sysApi } from '~/agilebpm'
  import { Delete, Back, Plus, Bottom } from '@element-plus/icons-vue'
  import { abRichEditor, abUtil } from '~/agilebpm'
  import { Codemirror } from 'vue-codemirror'
  import { number } from 'echarts'

  const formRef = ref()
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const id = proxy.$route.params.id

  export interface SalaryManage {
    id?: string
    type?: string
    userId?: string
    salaryClassId?: string
    entryTime?: Date
    holidayTime?: number
    workHolidayTime?: number
    useHolidayTime?: number
    userName?: string
    salaryClassName?: string
    bankCardNum?: string
    salarySum?: string
    taxSum?: string
    taxSalarySum?: string

    /*     salaryRuleDetails: SalaryManageDetail[]
     */
  }

  export interface SalaryManageDetail {
    id?: string
    userId?: string
    salaryRuleId?: string
    salaryRuleName?: string
    fixedValue?: number
    ruleType?: string // 科目类型
    calculateType?: string //计算方式
    salaryComment?: string //科目备注
  }

  const copyByStr = (val: string, typeStr: string) => {
    info.data.userList.forEach((user: any) => {
      user[typeStr] = val
    })
  }

  const info: any = reactive({
    data: {
      userList: [] as Array<SalaryManage>,
      salaryRuleDetails: [] as Array<SalaryManageDetail>,
      salaryClassName: '',
    },
    isAddUser: true,
  })

  const delSalaryRule = (index: number) => {
    abUtil.Arrays.del(index, info.data.salaryRuleDetails)
  }
  const delUser = (index: number) => {
    abUtil.Arrays.del(index, info.data.userList)
  }

  const addUser = (data: any, row: any) => {
    if (!data.length) {
      ElMessage({
        message: '请至少选择一个用户',
        type: 'warning',
      })
      return
    }
    data.forEach((sr: any) => {
      let isPush = true

      info.data?.userList?.forEach((salaryManage: any) => {
        if (salaryManage.userId === sr.id) {
          ElMessage({
            message: `该用户【${sr.fullName}（${sr.username}）】已存在`,
            type: 'warning',
          })
          isPush = false
          return
        }
      })
      if (isPush) {
        info.data.userList.push({
          userId: sr.id,
          userName: sr.name,
          holidayTime: 0,
          workHolidayTime: 0,
          useHolidayTime: 0,
        })
      }
    })
  }
  const addClassTable = (data: any, row: any) => {
    if (!data.length) {
      ElMessage({
        message: '请选择薪酬体系',
        type: 'warning',
      })
      return
    }

    data.forEach((sr: any) => {
      initClassById(sr.id, sr.name, false)
    })
  }

  //初始化数据
  const initTableData = (data: any) => {
    info.data.userList = []

    if (data?.salaryClassId) {
      initClassById(data.salaryClassId, data.salaryClassName, true)
    }
  }

  //根据体系id初始化数据
  const initClassById = async (id: string, name: string, initUser: boolean) => {
    info.data.salaryRuleDetails = []
    info.data.salaryClassId = ''
    info.data.salaryClassName = ''
    //根据薪酬体系查询出薪酬科目
    salaryApi.getSalaryClassGetUrl(id).then((result) => {
      info.data.salaryClassName = name
      info.data.salaryClassId = id
      if (result.isOk && result.data) {
        result.data?.salaryRuleList?.forEach((rule: any) => {
          info.data.salaryRuleDetails.push({
            salaryRuleId: rule.id,
            salaryRuleCode: rule.code,
            salaryRuleName: rule.name,
            fixedValue: rule.initialValue ? rule.initialValue : null,
            isFixedSalary:
              rule.isFixedSalary === 1 && rule.calculateType === 'fixed_salary'
                ? true
                : false,
            ruleType: rule.type,
            calculateType: rule.calculateType,
            salaryComment: rule.salaryComment,
          })
        })
      }

      //初始化user
      if (info.data.userId && initUser) {
        info.isAddUser = false
        const user = abUtil.clone(info.data)
        info.data.userList.push(user)

        salaryApi.getsalaryManageDetail(info.data.userId).then((result) => {
          if (result.isOk && result.data) {
            //遍历删掉不一样的数据
            const ruleMap = result.data.map((a: any) => a.salaryRuleId)
            for (var i = 0; i < info.data.salaryRuleDetails.length; i++) {
              if (
                ruleMap.indexOf(info.data.salaryRuleDetails[i].salaryRuleId) ==
                -1
              ) {
                info.data.salaryRuleDetails.splice(i, 1)
                i--
              }
            }
            info.data.salaryRuleDetails.forEach((rule: any) => {
              result.data.forEach((element: any) => {
                if (element.salaryRuleId == rule.salaryRuleId) {
                  rule.fixedValue = element.fixedValue
                }
              })
            })
          }
        })
      }
    })
  }

  // 保存前校验
  const beforeSave = () => {
    if (
      info.data?.salaryRuleDetails?.length <= 0 &&
      info.data?.userList?.length <= 0
    ) {
      ElMessage({
        message: '请选择薪酬体系和用户信息',
        type: 'warning',
      })

      return false
    }

    if (info.data?.salaryRuleDetails?.length <= 0) {
      ElMessage({
        message: '请选择薪酬体系',
        type: 'warning',
      })
      return false
    }

    if (info.data?.userList?.length <= 0) {
      ElMessage({
        message: '请选择用户信息',
        type: 'warning',
      })
      return false
    }
    let bankCardNumBool = false
    let bankCardNumStr = ''
    info.data?.userList.forEach((user: any) => {
      if (!user.bankCardNum) {
        bankCardNumBool = true
        bankCardNumStr += user.userName
      }
    })
    if (bankCardNumBool) {
      ElMessage({
        message: '请完善' + bankCardNumStr + '的银行卡号',
        type: 'warning',
      })
      return false
    }
    return true
  }

  const type = getCurrentInstance()?.proxy?.$route.query.type
</script>
