<template>
  <el-container class="layout-container-demo">
    <el-header>
      <ab-save
        back-name="HolidayList"
        :form-ref="formRef"
        :save-data="info.data"
        :url="sysApi.holiday.holidaySave"
      />
      <ab-load v-model="info.data" :url="sysApi.holiday.holidayGet" />
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
            :label="$abT('page.common.name','名称')"
            placeholder=" "
            prop="name"
            :rules="[{ required: true, message: $abT('page.common.required','必填') }]"
          >
            <el-select
              v-model="info.data.name"
              allow-create
              clearable
              filterable
            >
              <el-option value="元旦" />
              <el-option value="春节" />
              <el-option value="清明节" />
              <el-option value="劳动节" />
              <el-option value="端午节" />
              <el-option value="中秋节" />
              <el-option value="国庆节" />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.type','类型')"
            prop="type"
            :rules="[{ required: true, message: $abT('page.common.required','必填') }]"
          >
            <el-select v-model="info.data.type" placeholder=" ">
              <el-option
                :label="$abT('page.holidayConf.legalHolidays ','法定节假日')"
                value="LR"
              />
              <el-option
                :label="$abT('page.holidayConf.legalWorkingDay','法定工作日')"
                value="LW"
              />
              <el-option
                :label="$abT('page.holidayConf.companyHolidays','公司节假日')"
                value="CR"
              />
              <el-option
                :label="$abT('page.holidayConf.companyWorkingDay','公司工作日')"
                value="CW"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.startTime','开始时间')"
            prop="startDay"
            :rules="[{ required: true, message: $abT('page.common.required','必填') }]"
          >
            <el-date-picker
              v-model="info.data.startDay"
              placeholder=" "
              type="date"
              value-format="x"
            />
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.endTime','结束时间')"
            prop="endDay"
            :rules="[{ required: true, message: $abT('page.common.required','必填') }]"
          >
            <el-date-picker
              v-model="info.data.endDay"
              placeholder=" "
              type="date"
              value-format="x"
            />
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.system','系统')"
            prop="system"
            :rules="[{ required: true, message: $abT('page.common.required','必填') }]"
          >
            <ab-select-tree
              v-model="info.data.system"
              :operation="false"
              type-code="holidaySystemType"
            />
          </el-form-item>
          <el-form-item
            :label="$abT('page.common.desc','描述')"
            placeholder=" "
            prop="remark"
          >
            <el-input v-model="info.data.remark" type="textarea" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { sysApi } from '~/agilebpm'
  const formRef = ref()
  const info: any = reactive({
    data: {
      name: '',
      system: '',
      year: '',
      startDay: '',
      endDay: '',
      remark: '',
      type: '',
    },
  })
</script>
