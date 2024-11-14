<template>
  <div>
     
    <el-form-item label="展示详情">
         <template #label>
          <div>
            展示详情
            <el-tooltip
              class="box-item"
              content="配置表单，用值字段关联表单主键，点击选中项，弹出表单内容"
              effect="dark"
              placement="top-start"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
  
        <el-switch
          v-model="config.showDetail"
          inline-prompt
          active-text="是"
          inactive-text="否"
          :active-value="true"
          :inactive-value="false"
        />
    </el-form-item>
  
    
    <!--详情展示配置-->
    <div v-if="config.showDetail" style="margin-top: 10px;">
      <el-form-item label="pc端详情表单" label-width="120px">
        <el-input v-model="config.detailFormName"  clearable>
          <template #append>
            <ab-cust-dialog
              v-model ="config"
              dialog-key="formSelector"
              :param="{type_$VEQ:'pc'}"
              type="primary"
              :dialogSetting="{multiple:0}"
              :value-mapping="{code:'detailFormCode',name:'detailFormName'}"
          >
          <el-icon><Search></Search></el-icon>
          </ab-cust-dialog>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="app端详情表单" label-width="120px">
        <el-input v-model="config.detailFormNameMobile" clearable >
          <template #append>
            <ab-cust-dialog
              v-model ="config"
              dialog-key="formSelector"
              :param="{type_$VEQ:'mobile'}"
              type="primary"
              :dialogSetting="{multiple:0}"
              :value-mapping="{code:'detailFormCodeMobile',name:'detailFormNameMobile'}"
          >
          <el-icon><Search></Search></el-icon>
          </ab-cust-dialog>
          </template>
        </el-input>
      </el-form-item>
    </div>
  </div>
  
</template>
<script setup lang="ts">
 import { Search,QuestionFilled } from '@element-plus/icons-vue'

  
  const props=defineProps({
    config:{type:Object,required:true}
  })

  const {config} = toRefs(props)
</script>