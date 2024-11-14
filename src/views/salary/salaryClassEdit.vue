<template>
  <el-container class="layout-container-demo">
    <el-header>
      <router-link
        v-if="type != '1'"
        :to="{
          name: 'SalaryClassList',
        }"
      >
        <el-button :icon="Back">返回</el-button>
      </router-link>
      <ab-save
        v-else
        back-name="SalaryClassList"
        :before-save-fn="beforeSave"
        :form-ref="formRef"
        :save-data="info.data"
        :url="salaryApi.salaryClassSaveUrl"
      />
      <ab-load
        v-model="info.data"
        :url="salaryApi.salaryClassGetUrl"
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
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item
              label="薪酬体系名称"
              prop="name"
              :rules="[{ required: true, message: '请输入长度不超过50的薪酬体系名称',max:50 }]"
            >
              <el-input
                v-model="info.data.name"
                :disabled="type != '1'"
                placeholder="请输入薪酬体系名称"
                style="width: 230px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="薪酬组"
              prop="type"
              :rules="[{ required: true, message: '必填' }]"
            >
              <ab-select-tree
                v-model="info.data.type"
                :disabled="type != '1'"
                :has-root="false"
                type-code="salarySystemType"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="薪酬体系备注" prop="comment"  :rules="[{ required: true, message: '备注长度请不要超过500！',max:500 }]">
              <el-input
                v-model="info.data.comment"
                :disabled="type != '1'"
                placeholder="请输入薪酬体系备注"
                style="width: 230px"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="status">
              <el-switch
                v-model="info.data.status"
                :active-value="1"
                :disabled="type != '1'"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item>
            <ab-cust-dialog
              dialog-key="salaryaccountselection"
              :extra-data="info.data.salaryRuleList"
              :icon="Plus"
              style="margin-left: -66px"
              type="primary"
              @ok="addRuleTable"
              :disabled="type != '1'"
            >
              添加薪酬科目
            </ab-cust-dialog>
          </el-form-item>
        </el-row>

        <el-row>
          <el-table
            border
            :data="info.data.salaryRuleList"
            empty-text="请添加薪酬科目"
            style="width: 100%"
          >
            <el-table-column label="科目名称" prop="name" width="180" />

            <el-table-column label="编码" prop="code" width="180" />
            <el-table-column label="科目类型" prop="type" width="120" >
              <template #default="scope">
            <span v-if="scope.row.type =='basicSalary' ">基本工资</span>
              <span v-if="scope.row.type =='performance' ">绩效</span>
              <span v-if="scope.row.type =='subsidy' ">补贴/奖金</span>
              <span v-if="scope.row.type =='deduction' ">扣款</span>
              <span v-if="scope.row.type =='taxDeduction' ">个税扣除</span>
              <span v-if="scope.row.type =='totalTax' ">个税</span>

            </template>
            </el-table-column>
            <el-table-column
              label="计算方式"
              min-width="100"
              prop="calculateType"
              width="120"
            >
            <template #default="scope">
            <span v-if="scope.row.calculateType =='fixed_salary' ">定薪金额</span>
              <span v-if="scope.row.calculateType =='bean_id' ">内置计算</span>
              <span v-if="scope.row.calculateType =='groovy_script' ">脚本计算</span>
            </template>
          </el-table-column>

            <el-table-column label="说明" prop="salaryComment" />
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button
                  :icon="Delete"
                  plain
                  type="danger"
                  @click="delSalaryRule(scope.$index)"
                  :disabled="type != '1'"
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
  import { Delete, Back } from '@element-plus/icons-vue'
  import { abRichEditor, abUtil } from '~/agilebpm'
  import { Codemirror } from 'vue-codemirror'
  import { number } from 'echarts'

  const formRef = ref()
  //引入 当前实例
  const { proxy } = abTools.useCurrentInstance()
  const id = proxy.$route.params.id

  const info: any = reactive({
    data: {
      id: '',
      status: 1,
      type: 'basicsalary',
      name: '',
      salaryRuleList: [],
    },
  })

  const delSalaryRule = (index: number) => {
    abUtil.Arrays.del(index, info.data.salaryRuleList)
  }
  const addRuleTable = (data: any, row: any) => {
    if (!data.length) {
      ElMessage({
        message: '请选择薪酬科目',
        type: 'warning',
      })
      return
    }

    data.forEach((sr: any) => {
      let isPush = true
      info.data.salaryRuleList.forEach((rule: any) => {
        if (rule.id === sr.id) {
          ElMessage({
            message: `薪酬科目【${sr.name}（${sr.code}）】已存在`,
            type: 'warning',
          })
          isPush = false
          return
        }
      })
      if (isPush) {
        row.push({
          id: sr.id,
          name: sr.name,
          code: sr.code,
          type: sr.type,
          calculateType: sr.calculateType,
          salaryComment: sr.salaryComment,
          updateBy: sr.updateBy,
        })
      }
    })
  }

  //初始化数据
  const initDefList = () => {
        salaryApi.getDefList().then((result: any) => {
          if (result.isOk && result.data) {
            result.data.forEach((rule: any)=>{
              info.data.salaryRuleList.push({
              id: rule.id,
              name: rule.name,
              code: rule.code,
              type: rule.type,
              typeName:rule.typeName,
              typeDesc:rule.typeDesc,
              calculateType: rule.calculateType,
              salaryComment: rule.salaryComment,
              updateBy: rule.updateBy,
               })
            })
          }
        })
  }

  initDefList()

  // 保存前校验
  const beforeSave = () => {
    return true
  }

  const type = getCurrentInstance()?.proxy?.$route.query.type
</script>
