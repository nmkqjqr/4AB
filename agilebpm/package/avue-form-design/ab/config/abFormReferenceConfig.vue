<template>
  <div>
    <label class="el-form-item__label" style="padding: 0">表单引用配置：</label>
  
<!--表单配置-->
    <el-form-item label="pc端表单">
        <el-input v-model="data.fromRefConfig.formName" :readonly="false" clearable @clear="clearForm()">
          <template #append>
            <ab-cust-dialog
              v-model ="data.fromRefConfig"
              dialog-key="formSelector"
              :param="{type_$VEQ:'pc'}"
              type="primary"
              :dialogSetting="{multiple:0}"
              :value-mapping="{code:'formCode',name:'formName'}"
          >
          <el-icon><Search></Search></el-icon>
          </ab-cust-dialog>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="app端表单" >
        <el-input v-model="data.fromRefConfig.formNameMobile" :readonly="false" clearable @clear="clearFormMobile()">
          <template #append>
            <ab-cust-dialog
              v-model ="data.fromRefConfig"
              dialog-key="formSelector"
              :param="{type_$VEQ:'mobile'}"
              type="primary"
              :dialogSetting="{multiple:0}"
              :value-mapping="{code:'formCodeMobile',name:'formNameMobile'}"
          >
          <el-icon><Search></Search></el-icon>
          </ab-cust-dialog>
          </template>
        </el-input>
      </el-form-item>
      <!--对话框配置-->
      <el-form-item label="对话框">
      <el-input v-model="data.fromRefConfig.dialogName" :readonly="false"  placeholder="请选择一个对话框" clearable @clear="clearDialog()" >
        <template #append>
          <ab-cust-dialog
            dialog-key="custDialog"
            type="primary"
            :dialogSetting="{multiple:0}"
            @ok="choseDialog"
          >
            <el-icon><Search/></el-icon>
          </ab-cust-dialog>
        </template>
      </el-input>

    </el-form-item>
    

    <el-form-item label="值字段" v-if="data.fromRefConfig.dialogName" >
      <el-select
        v-model="pageData.valueInfo"
        placeholder="请选择引用表单Id 值字段"
      >
        <el-option
          v-for="(item, index) in pageData.dialogFields"
          :key="index"
          :label="item.showName"
          :value="item.returnName+','+item.columnName"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="描述字段"  v-if="data.fromRefConfig.dialogName">
      <el-select
        v-model="pageData.labelInfo"
        placeholder="请选择值对应格式化字段"
      >
        <el-option
          v-for="(item, index) in pageData.dialogFields"
          :key="index"
          :label="item.showName"
          :value="item.returnName+','+item.columnName"
        />
      </el-select>
    </el-form-item>

    <dialog-condition-seeting
      v-if="data.fromRefConfig.dialogName"
      :dialog ="pageData.dialogInfo"
      :params="data.fromRefConfig.params"
      :paramsDefaultValue = "data.fromRefConfig.paramsDefaultValue"
      :currentCode="props.data.tableCode"
      :column-prop="props.data.prop"
      :is-mb="props.form.isMb"
    /> 
    
    
    <defult-value-config v-model="data.defaultValue"  :filed-type="data.fieldType"></defult-value-config>
     <el-form-item label="展现形式">
         <el-radio-group v-model="data.fromRefConfig.showStyle" class="ml-4">
          <el-radio label="tile" size="large">平铺</el-radio>
          <el-radio label="card" size="large">卡片</el-radio>
        </el-radio-group>
      </el-form-item>
    
    <!--搜索按钮文本-->
    <el-form-item label="按钮文本">
      <el-input v-model="data.fromRefConfig.searchDesc" placeholder="请输入按钮文本" />
    </el-form-item>
    
  </div>
</template>

<script lang="ts">
  export default {
      name: "ab-form-reference-config",
  };
  </script>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { bizApi } from '@agilebpm/api'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import defultValueConfig from './component/defaultValueConfig.vue'
  import dialogConditionSeeting from './component/dialogConditionSeeting.vue'

 const props = defineProps({data:{type:Object,required:true},form:{type:Object,required:true},})
 const {data} = toRefs(props)

  const pageData = reactive({
    dialogFields: []  as any [],
    valueInfo:'',
    labelInfo:'' ,
    dialogInfo:{}
  })
  
  //选择对话框
  const choseDialog = (list:any)=>{
    if(!list || list.length < 1){
      return
    }
    const dialogNo = list[0]
    pageData.dialogInfo = dialogNo
    data.value.fromRefConfig.dialogKey =dialogNo.code
    data.value.fromRefConfig.dialogName = dialogNo.name
    data.value.fromRefConfig.valueField=null
    data.value.fromRefConfig.labelField=null
    data.value.fromRefConfig.params={}
    data.value.fromRefConfig.paramsDefaultValue={}
    pageData.labelInfo=''
    pageData.valueInfo=''
  }

  //获取返回值 和 参数列表
  const getDialogInfo = function (dialogKey: string) {
    if (!dialogKey) {
      return
    }
    //清掉之前的数据
    pageData.dialogFields.splice(0,pageData.dialogFields.length)

    bizApi.customDialog.getDialogByCode(dialogKey).then(
      (result: any) => {
        if(!result.isOk || !result.data){
          ElMessage.error(`${dialogKey}对话框获取失败`)
          return
        }
        const fileds = [] as any[]
        //如果数据源是接口的话取返回值和条件字段的交集
        if(result.data.dataSource === "interface"){
          if (result.data.conditionFields?.length === 0 || result.data.returnFields?.length === 0) {
            return
          }
          result.data.returnFields.forEach((rf:any)=>{
            const filed = result.data.conditionFields.find((cf:any)=>{
              return rf.columnName === cf.columnName
            })
            if (filed){
              fileds.push(rf)
            }
          })
          if(fileds.length === 0){
            return
          }
        }else{
          fileds.push(...result.data.returnFields)
        }
        //处理返回字段和显示字段
        if( result.data.displayFields ){
          fileds.forEach((rf:any)=>{
            const item = result.data.displayFields.find((df:any)=>{
             return df.columnName === rf.columnName
            })
            rf.showName = rf.returnName
            if(item){
              rf.showName = item.showName+'('+rf.returnName+')'
            }
          })
        }
        fileds.forEach((item: any) => {
          pageData.dialogFields.push({returnName:item.returnName,showName:item.showName,columnName:item.columnName})
        })
        pageData.dialogInfo = result.data
      },
      () => {
        ElMessage.error('获取' + dialogKey + '对话框失败')
      }
    )
  }

  

  const initData = ()=>{
    if(!data.value.fromRefConfig){
      data.value.fromRefConfig = {
        searchDesc:'',
        dialogKey:'',
        valueField:'',
        labelField:'',
        param:'',
        labelColumn:'',
        formCode:'',
        formName:'',
        formCodeMobile:'',
        formNameMobile:'',
        showStyle:'tile',
        params: {} as any,
        paramsDefaultValue: {} as any,
      }
    }else{
      if (data.value.fromRefConfig.labelField && data.value.fromRefConfig.labelColumn) {
         pageData.labelInfo = `${data.value.fromRefConfig.labelField},${data.value.fromRefConfig.labelColumn}`
      }
      if(data.value.fromRefConfig.valueField && data.value.fromRefConfig.param){
        pageData.valueInfo = `${data.value.fromRefConfig.valueField},${data.value.fromRefConfig.param}`
      }
    }
  }

  initData()
  if(data.value.fromRefConfig.dialogKey){
    getDialogInfo(data.value.fromRefConfig.dialogKey)
  }

  watch(
    () => data.value.fromRefConfig.dialogKey,
    (newValue) => {
      getDialogInfo(newValue)
    }
  )

  watch(()=>pageData.valueInfo,(newValue)=>{
    if(!newValue){
      data.value.fromRefConfig.valueField=''
      data.value.fromRefConfig.param=''
      return
    }
    const strs = newValue.split(',')
    data.value.fromRefConfig.valueField = strs[0]
    data.value.fromRefConfig.param=strs[1]
   
  })

  watch(()=>pageData.labelInfo,(newValue)=>{
    if(!newValue){
      data.value.fromRefConfig.fromRefConfig=''
      data.value.fromRefConfig.labelColumn=''
      return
    }
    const strs = newValue.split(',')
    data.value.fromRefConfig.labelField = strs[0]
    data.value.fromRefConfig.labelColumn = strs[1]
  })

  const clearDialog = ()=>{
    pageData.dialogInfo = null 
    data.value.fromRefConfig.labelField = ''
    data.value.fromRefConfig.labelColumn =''
    data.value.fromRefConfig.valueField = ''
    data.value.fromRefConfig.param = ''
    data.value.fromRefConfig.dialogKey = ''
    data.value.fromRefConfig.dialogName = ''
    data.value.fromRefConfig.params = {}
    data.value.fromRefConfig.paramsDefaultValue = {}
  }

  const clearFormMobile = ()=>{
    data.value.fromRefConfig.formNameMobile = ''
    data.value.fromRefConfig.formCodeMobile = ''
  }

  const clearForm = ()=>{
    data.value.fromRefConfig.formName = ''
    data.value.fromRefConfig.formCode = ''
  }
 


</script>
