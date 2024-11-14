<template>
  <div>
    <el-form-item label="日期格式" v-if="data.fieldType == 'date'">
      <el-select
        v-model="data.dateType"
        placeholder="请选择日期格式"
      >
        <el-option label="年（eg：2024）" value="year" />
        <el-option label="年月（eg：2024-01）" value="month" />
        <el-option label="年月日（eg：2024-01-01）" value="date" />
        <el-option label="年月日时分秒（eg：2024-01-01 01:01:01）" value="datetime" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <template #label>
        <div>
          默认值:
          <el-tooltip
            class="box-item"
            content="支持以#{}包含的以脚本运行，eg:#{sysScript.getCurrentUserName()}"
            effect="dark"
            placement="top-start"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-select
        v-model="data.defaultValue"
        v-if="defaultValueOps[data.fieldType]"
        allow-create
        clearable
        filterable
        :placeholder="defaultValuePlaceholder"
      >
        <el-option
          v-for="(val, key) in defaultValueOps[data.fieldType]"
          :key="key"
          :label="val"
          :value="key"
        />
      </el-select>
      <el-input
        v-else
        v-model="data.defaultValue"
        :placeholder="defaultValuePlaceholder"
      />
    </el-form-item>
  </div>
</template>

<script setup>
  import { Operation, Minus, QuestionFilled } from '@element-plus/icons-vue'
</script>

<script>
  export default {
    name: 'ab-hidden-config',
    props: ['data'],
    data() {
      return {
        defaultValueOps: {},
        abColumn : null,
      }
    },
    mounted() {
      if(window.ab_bo){
        this.abColumn = window.ab_bo.getCol(this.data.tableCode,this.data.code)
      }
      this.defaultValueOps.varchar = {
        '${currentUserId}': '当前用户ID',
        '${currentUserName}': '当前用户名',
        '${currentUserAccount}': '当前用户账号',
        '${currentOrgId}': '当前用户组织ID',
        '${currentOrgName}': '当前用户组织名',
        '${currentOrgCode}': '当前用户组织编码',
      }
      this.defaultValueOps.date = { '${currentDateTime}': '当前时间' }
    },
    methods: {},
    watch: {},
    computed : {
      defaultValuePlaceholder(){
        if(this.abColumn && this.abColumn.defaultValue){
          return "业务实体默认值：" + this.abColumn.defaultValue
        }
        return "请输入默认值"
      }
    }
  }
</script>
