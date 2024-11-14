<template>
  <el-container class="layout-container-demo">
    <el-header>
      <router-link
        v-if="type != '1'"
        :to="{
          name: 'SalaryRuleList',
        }"
      >
        <el-button :icon="Back">返回</el-button>
      </router-link>
      <ab-save
        v-else
        back-name="SalaryRuleList"
        :before-save-fn="beforeSave"
        :form-ref="formRef"
        :save-data="info.data"
        :url="salaryApi.salaryRuleSaveUrl"
      />
      <ab-load
        v-model="info.data"
        :url="salaryApi.salaryRuleGetUrl"
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
            <el-form-item
              label="科目名称"
              prop="name"
              :rules="[{ required: true, message: '请输入科目名称' }]"
            >
              <ab-pinyin
                v-model="info.data.name"
                v-model:to="info.data.code"
                :disabled="type != '1'"
                placeholder="请输入科目名称"
              />
            </el-form-item>
            <el-form-item
              label="科目编码"
              prop="code"
              :rules="[
              {  required: true,pattern: /^\w{1,50}$/, message: '请勿输入字母数字下划线以外的字符且最大长度50' },
            ]"
            >
              <el-input
                v-model="info.data.code"
                :disabled="type != '1'"
                placeholder="请输入科目编码"
              />
            </el-form-item>

            <el-form-item
              label="科目类型"
              prop="type"
              :rules="[{ required: true, message: '必填' }]"
            >
              <ab-select-tree
                v-model="info.data.type"
                :disabled="type != '1'"
                :has-root="false"
                type-code="salaryaccounttype"
                @change ="calculateTypeChange(info.data.type)"
              />
            </el-form-item>

            <el-form-item label="默认科目" prop="isDefault">
              <el-switch
                v-model="info.data.isDefault"
                active-text="是"
                :active-value="1"
                :disabled="type != '1'"
                inactive-text="否"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item label="计算方式" prop="calculateType">
              <el-radio-group
                v-model="info.data.calculateType"
                :disabled="type != '1'"
                placeholder="请选择计算方式"
              >
                <el-radio-button
                  v-for="item in info.salaryCalculateList"
                  :key="item.type"
                  :label="item.type"
                >
                  {{ item.desc }}
                </el-radio-button>
              </el-radio-group>
              <!-- <el-select
                v-model="info.data.calculateType"
                :disabled="type != '1'"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in info.salaryCalculateList"
                  :key="item.type"
                  :label="item.desc"
                  :value="item.type"
                />
              </el-select> -->
            </el-form-item>

            <el-form-item
              v-if="info.data.calculateType === 'fixed_salary'"
              label="定薪必填"
              prop="isFixedSalary"
            >
              <el-switch
                v-model="info.data.isFixedSalary"
                active-text="是"
                :active-value="1"
                :disabled="type != '1'"
                inactive-text="否"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item
              v-if="info.data.calculateType === 'fixed_salary'"
              label="定薪值"
              prop="initialValue"
            >
              <el-input
                v-model="info.data.initialValue"
                :disabled="type != '1'"
                placeholder="请输入定薪值"
              />
            </el-form-item>

            <el-form-item
              v-if="
                info.data.calculateType === 'groovy_script' ||
                info.data.calculateType === 'fixed_salary'
              "
              label="自定义脚本实现"
              prop="calculateScript"
            >
              <div style="width:100%">
                <el-row >
                  <el-col :span="24">
                    <el-select
                      class="m-2"
                      :disabled="type != '1'"
                      placeholder="选择脚本参数"
                      size="small"
                    >
                      <el-option
                        v-for="item in info.templateParamList"
                        :key="item.key"
                        :label="item.key"
                        :value="item.value"
                        @click="addParamData( item.value)"
                      />
                    </el-select>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <codemirror
                      v-model="info.data.calculateScript"
                      :autofocus="true"
                      :disabled="type != '1'"
                      :indent-with-tab="true"
                      placeholder=""
                      :style="{
                  height: `130px`,
                  border: `1px solid #e4e7ed`,
                  width: `60%`,
                }"
                    />
                  </el-col>
                </el-row>
              </div>
            </el-form-item>

            <el-form-item
              v-if="info.data.calculateType === 'bean_id'"
              label="内置计算"
              prop="calculateScript"
            >
              <el-input
                v-model="info.data.calculateScript"
                :disabled="type != '1'"
                placeholder="请输入内置BeanId"
              />
            </el-form-item>

            <el-form-item label="薪酬科目说明" prop="salaryComment">
              <el-input
                v-model="info.data.salaryComment"
                :disabled="type != '1'"
                placeholder="请输入薪酬科目说明"
                type="textarea"
              />
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
    type: '',
    name: '',
    calculateType: 'fixed_salary',
    isFixedSalary: 1,
    initialValue: null,
    calculateScript: '',
    salaryComment: '',
  },
  salaryCalculateList: [],
  templateParamList:[],
})

sysApi.tools
  .getEnum('com.dstz.salary.api.constants.SalaryCalculateTypeEnum', true)
  .then(({ data }) => {
    info.salaryCalculateList = data
  })

const calculateTypeChange = (type: string) =>{
  if(type === 'basicSalary' || type === 'taxDeduction'){
    info.templateParamList = []
  }
  if(type === 'performance'){
    info.templateParamList = [
      { key: '基本工资', value: 'basicSalary' }
    ]
  }
  if(type === 'subsidy'){
    info.templateParamList = [
      { key: '基本工资', value: 'basicSalary' },
      { key: '绩效', value: 'performance' }
    ]
  }

  if(type === 'deduction'){
    info.templateParamList = [
      { key: '基本工资', value: 'basicSalary' },
      { key: '绩效', value: 'performance' },
      { key: '补贴/奖金', value: 'subsidy' }
    ]
  }
  info.templateParamList.push({ key: '用户id', value: 'userId' },{ key: '计算月份', value: 'time' })

}


const addParamData = (key:string) =>{
  info.data.calculateScript = info.data.calculateScript + '  '+ key
}

//初始化数据
const initTableData = (data: any) => {
  calculateTypeChange(data.type)
}

// 保存前校验
const beforeSave = () => {
  return true
}
const type = getCurrentInstance()?.proxy?.$route.query.type

</script>
