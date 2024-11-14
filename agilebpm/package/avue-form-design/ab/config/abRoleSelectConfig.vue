<template>
  <div v-if="data.dataSelectorConfig">
    <label class="el-form-item__label" style="padding: 0">角色选择配置：</label>
  
      <!--默认值 -->
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
        <el-input v-model="data.defaultValue" placeholder="请输入默认值"/>
    </el-form-item>
    <!--搜索按钮文本-->
    <el-form-item label="按钮文本">
      <el-input v-model="data.dataSelectorConfig.searchDesc" placeholder="请输入按钮文本" />
    </el-form-item>
    <!--是否多选-->
    <el-form-item label="多选">
      <el-switch
        v-model="data.dataSelectorConfig.multiple"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <!--对话框参数配置-->
    <dialog-condition-seeting
      v-if="pageData.dialogInfo"
      :dialog ="pageData.dialogInfo"
      :params="data.dataSelectorConfig.params"
      :paramsDefaultValue = "data.dataSelectorConfig.paramsDefaultValue"
      :currentCode="props.data.tableCode"
      :column-prop="props.data.prop"
      :is-mb="props.form.isMb"
    /> 
    <!--展示详情-->
    <detail-setting :config="data.dataSelectorConfig"/>
    
  </div>
</template>

<script lang="ts">
  export default {
      name: "ab-role-select-config",
  };
  </script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { bizApi } from '@agilebpm/api'
  import dialogConditionSeeting from './component/dialogConditionSeeting.vue'
  import detailSetting from './component/detailSetting.vue'


  const props = defineProps({data:{type:Object,required:true},form:{type:Object,required:true},})
  const {data} = toRefs(props)
   const pageData = reactive({
    dialogInfo:{},
  })
  
  const initData = ()=>{
    if(!data.value.dataSelectorConfig){
      data.value.dataSelectorConfig = {
        multiple:0,
        searchDesc:'',
        params:{},
        paramsDefaultValue:{},
      }
    }
    data.value.dataSelectorConfig.dialogKey = 'roleSelector'
    data.value.dataSelectorConfig.selectType = 'role'
    data.value.dataSelectorConfig.valueField = 'id'
    data.value.dataSelectorConfig.labelField = 'name'
    data.value.dataSelectorConfig.param = 'groupId'
    data.value.dataSelectorConfig.labelColumn = 'name'
    //兼容一下老数据
    if(!data.value.dataSelectorConfig.params){
      data.value.dataSelectorConfig.params={}
    }
     if(!data.value.dataSelectorConfig.paramsDefaultValue){
      data.value.dataSelectorConfig.paramsDefaultValue={}
    }
  }

  //获取展示字段 和value 字段对应的数据库字段 作为 对话框的查询条件
  const getParam = (dialogReturnFields:any)=>{
    if(!dialogReturnFields || dialogReturnFields.length === 0){
      return
    }
    
    const param =  dialogReturnFields.forEach(e => {
      if(e.returnName === "id"){
        data.value.dataSelectorConfig.param = e.columnName
      }
      if(e.returnName === "name"){
         data.value.dataSelectorConfig.labelColumn = e.columnName
      }
    })
  }

  initData()
  
  bizApi.customDialog.getDialogByCode("roleSelector").then(
    (result: any) => {
      pageData.dialogInfo = result.data
      getParam(result.data.returnFields)
    },
    () => {
      ElMessage.error('获取角色对话框失败')
    }
  )
  
</script> -
