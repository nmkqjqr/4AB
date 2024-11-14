<template>
  <div v-if="data.dataSelectorConfig">
    <label class="el-form-item__label" style="padding: 0">人员选择配置：</label> 
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

        <el-select
          v-model="data.defaultValue"
          allow-create
          clearable
          filterable
          placeholder="请选择默认值"
        >
          <el-option
            v-for="(val, key) in pageData.defaultValueOptions"
            :key="key"
            :label="val"
            :value="key"
          />
        </el-select>
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
    <!--参数配置-->
     <dialog-condition-seeting
      v-if="pageData.dialogInfo"
      :dialog ="pageData.dialogInfo"
      :params="data.dataSelectorConfig.params"
      :paramsDefaultValue = "data.dataSelectorConfig.paramsDefaultValue"
      :currentCode="props.data.tableCode"
      :column-prop="props.data.prop"
      :is-mb="props.form.isMb"
      @getCourrentInfo = "getCourrentInfoFn"
    />

    <!--字段映射配置-->
    <div>
      <label class="el-form-item__label" style="padding: 0">字段映射配置：</label> <br />
      <el-button  :icon = 'Plus' class="mt-4"  text type="primary" style="width: 100%" @click="addMappingField">添加映射字段</el-button>
      <el-table :data="data.dataSelectorConfig.mappingFields" v-if="data.dataSelectorConfig.mappingFields && data.dataSelectorConfig.mappingFields.length > 0">
        <el-table-column label="对象字段" prop="boField" min-width="120" >
          <template #default = scope>
            <el-select v-model="data.dataSelectorConfig.mappingFields[scope.$index]['boField']" placeholder="请选择对象字段">
              <el-option v-for="(column,index) in  pageData.columns" :key="index" :label="column.name" :value="column.code"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="对话框字段" prop="dialogField" min-width="120">
          <template #default = scope>
            <el-select v-model="data.dataSelectorConfig.mappingFields[scope.$index]['dialogField']" placeholder="请选择对话框字段">
              <el-option v-for="(field,index) in  pageData.dialogFields" :key="index" :label="field.showName" :value="field.returnName"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="90">
          <template #default = scope>
            <el-button type="primary" text @click="deleteMappingField(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
     <!--展示详情-->
    <detail-setting :config="data.dataSelectorConfig"/>

  </div>
</template>

<script lang="ts">
  export default {
      name: "ab-user-select-config",
  };
  </script>

<script lang="ts" setup>
 
  import { defineProps } from 'vue'
  import * as abTools from '~/agilebpm/utils/ab-tools'
  import { Search,Plus } from '@element-plus/icons-vue'
  import { bizApi } from '@agilebpm/api'
  import dialogConditionSeeting from './component/dialogConditionSeeting.vue'
  import detailSetting from './component/detailSetting.vue'

  const props = defineProps({data:{type:Object,required:true},form:{type:Object,required:true},})
  const {data} = toRefs(props)
  const dialogKey = 'userSelector'
  const pageData = reactive({
    defaultValueOptions:{
      '${currentUserId}': '当前用户',
    },
    currentTable:{} as any,
    boInfo:window.getBo() as any,
    isBo : abTools.useCurrentInstance().proxy.$route.query.mode != 'diyBo' ,
    columns:[] as any[],
    dialogFields:[] as any[],
    dialogInfo:{},
  })

  const initData = ()=>{
    if(!data.value.dataSelectorConfig){
      data.value.dataSelectorConfig = {
        multiple:0,
        searchDesc:'',
        mappingFields:[] as any,
        objectMapping:pageData.currentTable.tablePath,
        params:{},
        paramsDefaultValue:{},
      }
    }
    data.value.dataSelectorConfig.dialogKey = dialogKey
    data.value.dataSelectorConfig.selectType = 'user'
    data.value.dataSelectorConfig.valueField = 'id'
    data.value.dataSelectorConfig.labelField = 'name'
    data.value.dataSelectorConfig.param = 'userId'
    data.value.dataSelectorConfig.labelColumn = 'fullname'
    data.value.dataSelectorConfig.objectMapping = pageData.currentTable.tablePath
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

  const addMappingField  = ()=>{
    if(!data.value.dataSelectorConfig.mappingFields){
      data.value.dataSelectorConfig.mappingFields = [] as any
    }
    data.value.dataSelectorConfig.mappingFields.push({
      boField:'',
      dialogField:''
    })
  }

const deleteMappingField = (index :number)=>{
  if(!data.value.dataSelectorConfig.mappingFields || data.value.dataSelectorConfig.mappingFields == 0){
    return
  }
  data.value.dataSelectorConfig.mappingFields.splice(index,1)
}


  const getTableColumn=(tableInfo:any)=>{
    const columns = [] as any[]
    tableInfo.table.columns.forEach((column:any)=>{
      //排除一下 当前字段,去除主键
      if((!column.primary || column.primary !== 1)&& data.value.code !== column.code){
        columns.push({
          name: tableInfo.tableComment + '-' + column.comment,
          value: tableInfo.tablePath + '.' + column.code,
          code: column.code,
        })
      }
    })
    return columns
  }
  
  //获取对话框返回值 和 参数列表
  const getDialogInfo = function (dialogKey: string) {
    if (!dialogKey) {
      return
    }
    
    bizApi.customDialog.getDialogByCode(dialogKey).then(
      (result: any) => {
        const fileds = [] as any[]
        //过滤掉id，id不可再映射其他字段了
        fileds.push(...result.data.returnFields.filter((e:any)=>{
          return !['id'].includes(e.returnName)
        }))
        
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
        getParam(result.data.returnFields)
      },
      () => {
        ElMessage.error('获取用户选择对话框失败')
      }
    )
  }

  watch(()=>pageData.currentTable.tablePath,(newValue:any)=>{
    if(newValue && newValue.tablePath){
       data.value.dataSelectorConfig.objectMapping = newValue
       pageData.columns = getTableColumn(pageData.currentTable)
    }
  })

  const getCourrentInfoFn = (currentInfo:any)=>{
    pageData.currentTable =currentInfo.currentTable
    data.value.dataSelectorConfig.objectMapping =  pageData.currentTable.tablePath
    pageData.columns = getTableColumn(currentInfo.currentTable)
  }

  initData()
  getDialogInfo(dialogKey)
  



</script>
