<template>
  <el-dialog v-model="dialogVisible" title="联动查询" width="800px" >
    <el-form label-suffix="：" label-width="120" ref="formRef" :model="plugin">
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="对话框" prop="dialogName" :rules="{ required: true, message: '必填' }">
            <el-input v-model="plugin.dialogName" :readonly="true" style="width: 160px;margin-right: 5px;" placeholder="请选择对话框"/>
            <ab-cust-dialog
              dialog-key="custDialog"
              type="primary"
              :dialogSetting="{multiple:0}"
              @ok="choseDialog"
            >
              请选择
            </ab-cust-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="赋值对象" prop="mappingBo" :rules="{ required: true, message: '必填' }">
            <el-select
              v-model="plugin.mappingBo"
              placeholder="请选择赋值对象"
              @change="mappInfoBoChange"
              style="width: 180px;"
            >
              <el-option v-for="(table,index) in dataInfo.canUseTable" :key="index"  :label="table.tableComment" :value="table.tablePath" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="插件描述" prop="desc" :rules="{ required: true, message: '必填' }">
        <el-input v-model="plugin.desc"  placeholder="请输入插件描述" />
      </el-form-item>

      <el-form-item label="联动查询时机" >
        <el-radio-group v-model="plugin.immediate" >
          <el-radio-button :label= "false">仅入参变化时查询</el-radio-button>
          <el-radio-button  :label="true">每次打开页面时增加查询</el-radio-button>
          <el-radio-button  :label="getIdPath">第一次打开页面时增加查询</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-if=" dataInfo.dialog.conditionFields && dataInfo.dialog.conditionFields.length > 0">
      <label class="el-form-item__label" style="padding: 0">对话框参数配置：</label>
      <el-table :data="dataInfo.dialog.conditionFields" >
        <el-table-column label="参数名称" prop="showName" min-width="120px"/>
        <el-table-column label="入参字段" prop="paramName" min-width="120px">
          <template #default = scope>
            <el-select v-model="plugin.params[scope.row.paramName]"  placeholder="请选择参数字段" clearable    filterable
    allow-create
    default-first-option>
              <el-option v-for="(column,index) in dataInfo.canUseColumns" :key="index" :label="column.name" :value="column.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="默认值" min-width="90px">
          <template #default = scope>
            <el-input v-model="plugin.paramsDefaultValue[scope.row.paramName]" :placeholder="`请输入默认值`"/>
          </template>
        </el-table-column>
        <el-table-column  label="是否必填" width="90px">
          <template #default = scope>
            <el-switch
              v-model="plugin.paramsRequired[scope.row.paramName]"
              inline-prompt
              active-text="是"
              inactive-text="否"
            /> 
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="dataInfo.selecteTable && Object.keys(dataInfo.selecteTable).length > 0 && plugin.dialogKey" >
      <label class="el-form-item__label" style="padding: 0">字段映射配置：</label> <br />
      <el-button :icon = 'Plus' type="primary" @click="addMappingField">添加映射字段</el-button>
      <el-table :data="plugin.mappingFields" v-if="plugin.mappingFields && plugin.mappingFields.length > 0">
        <el-table-column label="对象字段" prop="boField" min-width="120" >
          <template #default = scope>
            <el-select v-model="plugin.mappingFields[scope.$index]['boField']" placeholder="请选择对象字段">
            <el-option v-for="(column,index) in  dataInfo.selecteTable.table.columns" :key="index" :label="column.comment" :value="column.code"></el-option>
          </el-select>
          </template>
        </el-table-column>
        <el-table-column label="对话框字段" prop="dialogField" min-width="120">
          <template #default = scope>
            <el-select v-model="plugin.mappingFields[scope.$index]['dialogField']" placeholder="请选择对象字段">
            <el-option v-for="(field,index) in  dataInfo.dialog.returnFields" :key="index" :label="field.showName" :value="field.returnName"></el-option>
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
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button text @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="ok()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { ElMessage } from 'element-plus'
  import { bizApi } from '@agilebpm/api'
  import { Plus,Delete,ArrowDown } from '@element-plus/icons-vue'

  const props = defineProps({
    plugin: {
      type: Object,
      required: true,
    },
    modelValue:{
      type:Boolean,
      required:true
    },
    tableName:{
      type:String
    }
  })
  const emits = defineEmits(['update:modelValue','dialogOk'])

  // 是否展示与外部传入的是否展示双向绑定
  const dialogVisible = useVModel(props, 'modelValue', emits)

  const { plugin } = toRefs(props)
  const formRef = ref()
  

  //页面展示需要的数据
  const dataInfo = reactive({
    dialog:{} as any,
    canUseColumns:[] as any [],
    currnetTableRel:{} as any,
    parentTableRel:{} as any,
    canUseTable:[] as any[],
    selecteTable:{} as any,
    boInfo:null as any
  })

  const getIdPath = computed(()=>{
    if(!dataInfo.boInfo) return 'false';
    return "!data." + dataInfo.boInfo.code  + '.id';
  })


  const ok = ()=>{
    formRef.value.validate((valid:any) => {
      if (!valid) {
        ElMessage({ showClose: true,  message: '请检查表单', type: 'warning', })
        return ;
      }
      emits('dialogOk', plugin)
    })
  }


  //选择对话框，对话框改变了，把相关数据清空
  const choseDialog = (list:any)=>{
    if(!list || list.length < 1){
      return
    }
    plugin.value.dialogKey =list[0].code
    plugin.value.dialogName = list[0].name
    plugin.value.paramsDefaultValue = {}
    plugin.value.paramsRequired = {}
    plugin.value.params={}
    if(plugin.value.mappingFields){
      plugin.value.mappingFields.splice(0,plugin.value.mappingFields.length)
    }
    getDialogInfo(plugin.value.dialogKey)
  }

  //获取对话框的 相关信息，返回值 ， 参数列表，配置
  const getDialogInfo = function (dialogKey: string) {
    if (!dialogKey) {
      return
    }
    bizApi.customDialog.getDialogByCode(dialogKey).then(
      (result: any) => {
        if(result.isOk && result.data){
          dataInfo.dialog = result.data
          if(dataInfo.dialog.conditionFields){
            dataInfo.dialog.conditionFields.forEach((item:any)=>{
              item.paramName = buildcondition(item)
            })
          }
        }else{
          ElMessage.error('获取' + dialogKey + '对话框信息失败')
        }
      }
    )
  }

  
 

 const getTableColumn=(tableInfo:any)=>{
    const columns = [] as any[]
    tableInfo.table.columns.forEach((column:any)=>{
      columns.push({
          name: tableInfo.tableComment + '-' + column.comment,
          value: tableInfo.tablePath + '.' + column.code,
          code: column.code,
        })
    })
    return columns
  }

  
  const getCurrentTableFn = (tableInfo:any,parentTable:any)=>{
    if(tableInfo.tableCode == props.tableName){
      dataInfo.currnetTableRel= tableInfo
      dataInfo.parentTableRel = parentTable
      return
    }

    if(!tableInfo.children || tableInfo.children.length === 0 ){
      return
    }
    for (const i in tableInfo.children) {
      getCurrentTableFn(tableInfo.children[i],tableInfo)
    }
  }

  
 const setTablePath = (tableInfo:any,parentTableInfo:any)=>{

    let path = ''
    //主表path
    if (tableInfo.type === "main") {
      path = "data." + dataInfo.boInfo.code
    }else{
      //当前表的path
      if(tableInfo.tableCode == dataInfo.currnetTableRel.tableCode){
        path = tableInfo.tableCode
      }else{
        //其他表的path
        let parentPath = !parentTableInfo?'data.'+ dataInfo.boInfo.code:parentTableInfo.tablePath

        if (tableInfo.type === "oneToMany") {
          path = parentPath+'.'+tableInfo.tableCode+'List'
        }
        if (tableInfo.type === "oneToOne") {
          path = parentPath + "." + tableInfo.tableCode
        }
      }
    }
    tableInfo.tablePath = path
    if(!tableInfo.children || tableInfo.children.length === 0 ){
      return
    }
    for (const i in tableInfo.children) {
      setTablePath(tableInfo.children[i],tableInfo)
    }
 }

 /**
   * 1.获取可用的列，向上递归，主表只能用主表的，
   * 2.子表可以用主表，父表
   * 3.如果当前表是主表，子表是一对一的关系也可以用
   * 
   */
 const getCanUseColumns = ()=>{
  if(!props.tableName){
     getTableColumn(dataInfo.boInfo.rel).forEach(item=>{
        dataInfo.canUseColumns.push(item)
    })
    const children:any [] = dataInfo.boInfo.rel.children
    if(children &&children.length > 0){
      children.forEach((child:any)=>{
         if(child.type === 'oneToOne'){
            getTableColumn(child).forEach(item=>{
              dataInfo.canUseColumns.push(item)
            })
          }
      })
    }
  }else(
    getCanUseColumn(dataInfo.boInfo.rel,null)
  )
 } 
 const getCanUseColumn = (tableInfo:any,parentTable:any)=>{
    //多个child一个父级，父级会重复，要去重
    if(parentTable && !dataInfo.canUseColumns.find((item:any)=>{item.value == parentTable.tablePath+'.'+item.code })){
      getTableColumn(parentTable).forEach(item=>{
        dataInfo.canUseColumns.push(item)
      })
    }
    if(tableInfo.tableCode == props.tableName){
      getTableColumn(tableInfo).forEach(item=>{
        dataInfo.canUseColumns.push(item)
      })
      return
    }
    tableInfo.children.forEach((child:any)=>{
      getCanUseColumn(child,tableInfo)
    })
 }


  /**
   * 获取可用的表，向下递归，主表 可以 push 子表，孙子表
   * 子表只能push 子表，内部赋值
   */
  const getCanUseTables = (tableInfo:any)=>{
    dataInfo.canUseTable.push(tableInfo)
    if(!tableInfo.children || tableInfo.children.length === 0){
      return
    }
    for (const i in tableInfo.children) {
      getCanUseTables(tableInfo.children[i])
    }
  }

  const mappInfoBoChange = (value:string)=>{
    if(plugin.value.mappingFields){
      plugin.value.mappingFields.splice(0,plugin.value.mappingFields.length)
    }
    initSelectTable()
  }

   const initSelectTable = ()=>{
    dataInfo.canUseTable.forEach((item:any)=>{
      if(item.tablePath == plugin.value.mappingBo ){
        dataInfo.selecteTable = item
        plugin.value.mappingInitData = `initData.${dataInfo.boInfo.code}.${item.tableCode}`
        return
      }
    })
   }

  const addMappingField  = ()=>{
    if(!plugin.value.mappingFields){
      plugin.value.mappingFields=[] as any
    }
    plugin.value.mappingFields.push({
      boField:'',
      dialogField:''
    })
  }

  const deleteMappingField = (index :number)=>{
    if(!plugin.value.mappingFields || plugin.value.mappingFields == 0){
      return
    }
    plugin.value.mappingFields.splice(index,1)
  }

  const dataInfoClear = ()=>{
    dataInfo.canUseColumns.splice(0,dataInfo.canUseColumns.length)
    dataInfo.canUseTable.splice(0,dataInfo.canUseTable.length)
    dataInfo.currnetTableRel=null
    dataInfo.parentTableRel=null
    if(!plugin.value.immediate){
      plugin.value.immediate =false
    }
  }

  /**
   *  获取当前表
   *  全局配置下，无表名，既当前表是主表
   */
  const getCurrentTable = ()=>{
    if(!props.tableName){
      dataInfo.currnetTableRel = dataInfo.boInfo.rel
    }else{
      getCurrentTableFn(dataInfo.boInfo.rel,null)
    }
  }

  onMounted(()=>{
    dataInfo.boInfo = window.getBo()
    dataInfoClear()
    getCurrentTable()
    setTablePath(dataInfo.boInfo.rel,null)
    getDialogInfo(plugin.value.dialogKey)
    getCanUseTables(dataInfo.currnetTableRel)
    getCanUseColumns()
    initSelectTable()
  })
      
 


  //对话框查询条件拼接
  const buildcondition =(conditionFieldInfo: any)=> {
  let result = conditionFieldInfo.columnName + '-'
  const dataType = conditionFieldInfo.dbType
  if (!dataType) {
    return result + 'V' + conditionFieldInfo.condition
  }
  if (dataType.search(/DATE/i) != -1 || dataType.search(/TIME/i) != -1) {
    return result + 'D' + conditionFieldInfo.condition
  }

  if (
    dataType.search(/INT/i) != -1 ||
    dataType.search(/FLOAT/i) != -1 ||
    dataType.search(/DOUBLE/i) != -1 ||
    dataType.search(/DECIMAL/i) != -1
  ) {
    return result + 'N' + conditionFieldInfo.condition
  }
  return result + 'V' + conditionFieldInfo.condition
}
</script>
<style lang="scss" scoped>
  .afd-config-form {
    padding: 10px 0 0 0;
  }
</style>
